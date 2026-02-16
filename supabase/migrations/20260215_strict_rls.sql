-- STRICT RLS POLICIES FOR CONTENT SEPARATION

-- 1. COURSES & VIDEOS
-- Need to filter by audience/space.
-- Assuming 'courses' has an 'audience' column (kids, adults, all).
-- If not, we might need to rely on 'access_level' of the user matching the content.

-- Drop existing policies if they are too loose
drop policy if exists "Enable read access for authenticated users" on public.courses;
drop policy if exists "Enable read access for authenticated users" on public.videos;

-- Create separated policies for Courses
create policy "Kids can view kids courses"
  on public.courses for select
  using (
    (audience = 'kids' or audience = 'all')
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and access_level = 'kid'
    )
  );

create policy "Adults can view adult courses"
  on public.courses for select
  using (
    (audience = 'adults' or audience = 'all')
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'adult' or role = 'admin') -- Adults/Admins
    )
  );

-- Create separated policies for Videos
-- Videos inherit access from their course usually, but let's be safe.
create policy "Kids can view kids videos"
  on public.videos for select
  using (
    exists (
      select 1 from public.courses
      where id = videos.course_id
      and (audience = 'kids' or audience = 'all')
    )
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and access_level = 'kid'
    )
  );

create policy "Adults can view adult videos"
  on public.videos for select
  using (
    exists (
      select 1 from public.courses
      where id = videos.course_id
      and (audience = 'adults' or audience = 'all')
    )
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'adult' or role = 'admin')
    )
  );
