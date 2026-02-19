-- Add deleted_at column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Index for performance when filtering deleted users
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at);
