-- Insert a sample course
insert into public.courses (title, description, image_url, price)
values 
('Mentalisme Pro', 'Maîtrisez l''art de la lecture de pensée.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2514&auto=format&fit=crop', 97.00);

-- Insert a sample video (linked to the course we just created)
-- We use a subquery to get the course ID dynamically
insert into public.videos (course_id, title, description, video_url, duration, "position", is_free)
select id, 'Introduction au Cold Reading', 'Les bases fondamentales pour lire en quelqu''un comme dans un livre ouvert.', '824804225', 120, 1, true
from public.courses where title = 'Mentalisme Pro';

-- Enroll the current user in this course (OPTIONAL - Run this only if you want to give yourself access immediately)
-- You need to replace 'YOUR_USER_ID' with your actual Supabase User ID (found in Authentication > Users)
-- insert into public.enrollments (user_id, course_id, purchased_at)
-- values ('YOUR_USER_ID', (select id from public.courses where title = 'Mentalisme Pro'), now());
