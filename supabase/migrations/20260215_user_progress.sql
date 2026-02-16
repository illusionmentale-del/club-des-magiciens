-- Create user_progress table
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

-- Enable RLS
alter table public.user_progress enable row level security;

-- Policies
create policy "Users can view their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own progress"
  on public.user_progress for all
  using (auth.uid() = user_id);

-- admin policy
create policy "Admins can view all progress"
  on public.user_progress for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
