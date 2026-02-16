-- 1. Create `library_items` table
create type library_item_type as enum ('trick', 'activity', 'challenge', 'routine', 'theory', 'business');

create table public.library_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text, -- Strategic subtitle for adults
  description text,
  video_url text, -- Vimeo/Mux ID
  thumbnail_url text,
  resource_url text, -- PDF or file
  
  audience text not null check (audience in ('kids', 'adults')),
  type library_item_type not null,
  
  published_at timestamp with time zone default now(),
  
  -- Kids specific
  week_number integer, -- e.g. 1, 2, 3...
  is_main boolean default false, -- True = Main content of the week, False = Bonus
  
  linked_product_id uuid references public.products(id) on delete set null,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Create `library_tags` table (Taxonomy for Adults)
create type library_tag_type as enum ('theme', 'ambition');

create table public.library_tags (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  type library_tag_type not null,
  created_at timestamp with time zone default now()
);

-- 3. Create `library_item_tags` table
create table public.library_item_tags (
  item_id uuid references public.library_items(id) on delete cascade not null,
  tag_id uuid references public.library_tags(id) on delete cascade not null,
  primary key (item_id, tag_id)
);

-- 4. Create `user_library_progress` table
create table public.user_library_progress (
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_id uuid references public.library_items(id) on delete cascade not null,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  last_watched_at timestamp with time zone default now(),
  primary key (user_id, item_id)
);

-- 5. Enable RLS
alter table public.library_items enable row level security;
alter table public.library_tags enable row level security;
alter table public.library_item_tags enable row level security;
alter table public.user_library_progress enable row level security;

-- 6. RLS Policies

-- Public/Authenticated Read for Tags (needed for filters)
create policy "Anyone can view tags" on public.library_tags for select using (true);
create policy "Anyone can view item tags" on public.library_item_tags for select using (true);

-- LIBRARY ITEMS POLICIES
-- Admin: Full access
create policy "Admins can manage library items"
  on public.library_items for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Adults: Can view 'adults' content if role is 'adult' or 'admin'
create policy "Adults can view adult library items"
  on public.library_items for select
  using (
    audience = 'adults'
    and published_at <= now()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'adult' or role = 'admin')
    )
  );

-- Kids: Can view 'kids' content if access_level is 'kid' AND week logic matches
-- IMPORTANT: This relies on the 'created_at' of the profile as the anchor for the subscription start.
-- If the subscription started later, this logic assumes Day 1 = Profile Creation.
-- We might need to refine this later with a dedicated 'subscription_start_date' column on profiles if subscriptions restart.
create policy "Kids can view unlocked library items"
  on public.library_items for select
  using (
    audience = 'kids'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() 
      and p.access_level = 'kid'
      and (
        -- If week_number is null, it's viewable (e.g. intro content)
        week_number is null
        OR
        -- Logic: Content Week <= (Current Date - User Created Date) / 7 + 1
        -- Default to 1st week if new.
        week_number <= (extract(day from (now() - p.created_at)) / 7)::int + 1
      )
    )
  );

-- Progress Policies
create policy "Users can view own library progress"
  on public.user_library_progress for select
  using (auth.uid() = user_id);

create policy "Users can update own library progress"
  on public.user_library_progress for all
  using (auth.uid() = user_id);

-- 7. Seed Data (Tags)
insert into public.library_tags (name, slug, type) values
  ('Restaurant', 'restaurant', 'theme'),
  ('Corporate', 'corporate', 'theme'),
  ('Réseaux', 'reseaux', 'theme'),
  ('Psychologie', 'psychologie', 'theme'),
  ('Worker routines', 'worker-routines', 'theme'),
  ('Business', 'business', 'theme'),
  ('Théorie', 'theorie', 'theme'),
  ('Débuter', 'debuter', 'ambition'),
  ('Structurer', 'structurer', 'ambition'),
  ('Optimiser', 'optimiser', 'ambition')
on conflict (slug) do nothing;
