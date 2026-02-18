-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing read policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create explicit read policy
-- Option 1: Public read (often needed for social features)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT
    USING (true);

-- Option 2: Strictly own profile (if you want to lock it down)
-- CREATE POLICY "Users can view own profile" ON public.profiles
--     FOR SELECT
--     USING (auth.uid() = id);

-- Ensure insert/update policies exist (idempotent)
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);
