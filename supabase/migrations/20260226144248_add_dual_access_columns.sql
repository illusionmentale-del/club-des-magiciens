-- 1. Add boolean flags for dual-platform access
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_kids_access boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_adults_access boolean DEFAULT false;

-- 2. Migrate existing data based on the old `access_level` column
-- By default, we consider:
-- "kid" -> has_kids_access = true, has_adults_access = false
-- "default" (or anything else) -> has_adults_access = true, has_kids_access = false
-- An admin could have both, but for now we give them adult access to manage the dashboard.
UPDATE public.profiles
SET 
  has_kids_access = CASE 
    WHEN access_level = 'kid' THEN true 
    ELSE false 
  END,
  has_adults_access = CASE 
    WHEN access_level = 'default' THEN true 
    ELSE false 
  END;

-- For Admis, let's explicitly give them both accesses so they can manage all spaces freely
UPDATE public.profiles
SET 
  has_kids_access = true,
  has_adults_access = true
WHERE role = 'admin';
