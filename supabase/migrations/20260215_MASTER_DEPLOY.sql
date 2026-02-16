-- 🚨 MASTER DEPLOY SCRIPT --
-- SCRIPT TOTAL "ARCHITECT V2"

-- 1. PROGRESS TRACKING (User Progress)
create table if not exists public.user_progress (
  user_id uuid references public.profiles(id) on delete cascade not null,
  video_id uuid references public.videos(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  is_completed boolean default false,
  last_watched_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (user_id, video_id)
);
alter table public.user_progress enable row level security;
create policy "Users can view their own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert/update their own progress" on public.user_progress for all using (auth.uid() = user_id);

-- 2. PRODUCTS & STORE
-- Idempotent Enum Creation
do $$ begin
    create type product_type as enum ('subscription', 'pack', 'course', 'coaching');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type space_type as enum ('kids', 'adults');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  space space_type not null,
  type product_type not null,
  title text not null,
  description text,
  price integer not null, -- in cents
  currency text default 'eur',
  stripe_price_id text, -- ID from Stripe
  metadata jsonb default '{}'::jsonb,
  is_active boolean default true,
  image_url text, -- For cover images
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- FIX: Handle case where table exists but with different column names
do $$
begin
  if exists(select 1 from information_schema.columns where table_schema = 'public' and table_name = 'products' and column_name = 'active') then
    alter table public.products rename column active to is_active;
  end if;
end $$;

-- Ensure columns exist (idempotent)
alter table public.products add column if not exists is_active boolean default true;
alter table public.products add column if not exists image_url text;

alter table public.products enable row level security;
-- Drop policy if exists to avoid "policy already exists" error
drop policy if exists "Public can view active products" on public.products;
drop policy if exists "Admins can manage products" on public.products;

create policy "Public can view active products" on public.products for select using (is_active = true);
create policy "Admins can manage products" on public.products for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 3. SUBSCRIPTIONS (Stripe Sync)
do $$ begin
    create type subscription_status as enum ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.subscriptions (
  id text primary key, -- Stripe Subscription ID
  user_id uuid references public.profiles(id) on delete cascade not null,
  status subscription_status not null,
  metadata jsonb,
  price_id text,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamp with time zone default now(),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  ended_at timestamp with time zone,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone
);
alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Admins can view all subscriptions" on public.subscriptions for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 4. PROFILE & COURSE UPDATES
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists subscription_status subscription_status;

alter table public.courses add column if not exists is_primary boolean default false;
alter table public.courses add column if not exists product_id uuid references public.products(id) on delete set null;

-- 5. STRICT SECURITY (RLS)
-- Drop old policies to avoid conflicts
drop policy if exists "Enable read access for authenticated users" on public.courses;
drop policy if exists "Enable read access for authenticated users" on public.videos;

create policy "Kids can view kids courses" on public.courses for select using (
    (audience = 'kids' or audience = 'all')
    and exists (select 1 from public.profiles where id = auth.uid() and access_level = 'kid')
);
create policy "Adults can view adult courses" on public.courses for select using (
    (audience = 'adults' or audience = 'all')
    and exists (select 1 from public.profiles where id = auth.uid() and (role = 'adult' or role = 'admin'))
);
create policy "Kids can view kids videos" on public.videos for select using (
    exists (select 1 from public.courses where id = videos.course_id and (audience = 'kids' or audience = 'all'))
    and exists (select 1 from public.profiles where id = auth.uid() and access_level = 'kid')
);
create policy "Adults can view adult videos" on public.videos for select using (
    exists (select 1 from public.courses where id = videos.course_id and (audience = 'adults' or audience = 'all'))
    and exists (select 1 from public.profiles where id = auth.uid() and (role = 'adult' or role = 'admin'))
);

-- END OF MASTER SCRIPT
