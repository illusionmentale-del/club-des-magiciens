-- Create a table for public profiles (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a table for Courses (e.g. "Mentalism 101")
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  price decimal(10,2),
  systeme_io_id text, -- To link with Systeme.io product ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

create policy "Courses are viewable by everyone." on public.courses
  for select using (true);

-- Create a table for Videos (Modules inside a course)
create table public.videos (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses on delete cascade not null,
  title text not null,
  description text,
  video_url text not null, -- Vimeo/Mux/Youtube ID
  duration integer, -- in seconds
  "position" integer, -- order in the course
  is_free boolean default false, -- preview available?
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.videos enable row level security;

create policy "Videos are viewable by everyone." on public.videos
  for select using (true);

-- Create a table for User Purchases / Enrollments
create table public.enrollments (
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  purchased_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "Users can see their own enrollments." on public.enrollments
  for select using (auth.uid() = user_id);

-- Function to handle new user creation automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
CREATE TABLE IF NOT EXISTS public.vip_requests (
    id uuid default gen_random_uuid() primary key,
    child_name text not null,
    parent_email text not null,
    context text not null,
    status text default 'en_attente' check (status in ('en_attente', 'approuve', 'rejete')),
    wants_newsletter boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.vip_requests ENABLE ROW LEVEL SECURITY;

-- Admins can view
CREATE POLICY "VIP Requests are viewable by admins" ON public.vip_requests
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));

-- Public can insert
CREATE POLICY "Anyone can insert a VIP request" ON public.vip_requests
    FOR INSERT WITH CHECK (true);

-- Admins can update status
CREATE POLICY "Admins can update VIP requests" ON public.vip_requests
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));
