-- Add audience targeting to Gamification Tables (Kids vs Adults separation)

-- 1. Create enum type if it does not exist (we might just use text to avoid enum complexities, let's use text with check constraint)

ALTER TABLE IF EXISTS public.avatar_skins
ADD COLUMN IF NOT EXISTS target_audience text DEFAULT 'kids' CHECK (target_audience IN ('kids', 'adults', 'all'));

ALTER TABLE IF EXISTS public.gamification_quests
ADD COLUMN IF NOT EXISTS target_audience text DEFAULT 'kids' CHECK (target_audience IN ('kids', 'adults', 'all'));

-- Update existing records to default to 'kids' (since everything built so far is for kids)
UPDATE public.avatar_skins SET target_audience = 'kids' WHERE target_audience IS NULL;
UPDATE public.gamification_quests SET target_audience = 'kids' WHERE target_audience IS NULL;
