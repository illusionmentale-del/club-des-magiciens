-- Create table for Masterclass page settings
CREATE TABLE IF NOT EXISTS public.kids_masterclass_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Les Masterclass',
    description TEXT NOT NULL DEFAULT 'Apprends des techniques avancées et perfectionne ta magie avec nos experts.',
    hero_video_id UUID REFERENCES public.library_items(id) ON DELETE SET NULL,
    hero_title TEXT,
    hero_description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.kids_masterclass_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can view the settings
CREATE POLICY "Public kids masterclass settings view"
ON public.kids_masterclass_settings
FOR SELECT USING (true);

-- Only admins can manage the settings
CREATE POLICY "Admin kids masterclass settings manage"
ON public.kids_masterclass_settings
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert default row if table is empty
INSERT INTO public.kids_masterclass_settings (title, description)
SELECT 'Les Masterclass', 'Apprends des techniques avancées et perfectionne ta magie avec nos experts.'
WHERE NOT EXISTS (SELECT 1 FROM public.kids_masterclass_settings);
