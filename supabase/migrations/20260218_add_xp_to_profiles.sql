-- Add XP column for gamification
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;

-- Ensure magic_level exists (just in case, though it seems present)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS magic_level TEXT DEFAULT 'Apprenti';
