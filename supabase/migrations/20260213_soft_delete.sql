-- Add deleted_at to profiles for soft delete
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "deleted_at" timestamptz DEFAULT NULL;
