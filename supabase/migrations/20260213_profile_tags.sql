-- Add tags to profiles
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "tags" text[] DEFAULT '{}';
