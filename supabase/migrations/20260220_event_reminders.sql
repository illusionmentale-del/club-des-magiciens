-- 1. Add event_type to lives
ALTER TABLE public.lives ADD COLUMN event_type TEXT DEFAULT 'live';

-- 2. Create event_reminders table
CREATE TABLE IF NOT EXISTS public.event_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.lives(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, user_id)
);

-- 3. Row Level Security for event_reminders
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;

-- Users can only view and manage their own reminders
CREATE POLICY "Users can manage their own reminders" 
ON public.event_reminders 
FOR ALL 
USING (auth.uid() = user_id);

-- Admins can view all reminders
CREATE POLICY "Admins can view all reminders" 
ON public.event_reminders 
FOR SELECT 
USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
