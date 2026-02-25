-- Add last_kids_login to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_kids_login TIMESTAMP WITH TIME ZONE;

-- Create kids_video_progress table
CREATE TABLE IF NOT EXISTS public.kids_video_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id VARCHAR NOT NULL,
    progress_seconds INTEGER DEFAULT 0,
    progress_percent INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, video_id)
);

-- RLS Configuration
ALTER TABLE public.kids_video_progress ENABLE ROW LEVEL SECURITY;

-- Policies for kids_video_progress
CREATE POLICY "Users can view their own progress" 
    ON public.kids_video_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
    ON public.kids_video_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
    ON public.kids_video_progress FOR UPDATE 
    USING (auth.uid() = user_id);

-- Admins can view all progress
CREATE POLICY "Admins can view all video progress"
    ON public.kids_video_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.access_level = 'admin'
        )
    );
