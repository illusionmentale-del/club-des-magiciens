-- 1. Course Likes
CREATE TABLE IF NOT EXISTS public.course_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    is_like BOOLEAN NOT NULL, -- true = like (thumbs up), false = dislike (thumbs down)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id) -- One vote per user per course
);

-- 2. Course Comments
CREATE TABLE IF NOT EXISTS public.course_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    parent_id UUID REFERENCES public.course_comments(id) ON DELETE CASCADE -- For threaded comments/replies
);

-- 3. RLS
ALTER TABLE public.course_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_comments ENABLE ROW LEVEL SECURITY;

-- Likes Policies
CREATE POLICY "Public likes view" ON public.course_likes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON public.course_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change vote" ON public.course_likes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove vote" ON public.course_likes FOR DELETE USING (auth.uid() = user_id);

-- Comments Policies
CREATE POLICY "Public comments view" ON public.course_comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON public.course_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.course_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admin can manage all" ON public.course_comments FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
