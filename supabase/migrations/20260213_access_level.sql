-- Add access_level to profiles
-- access_level: 'adult' (default), 'kid'

ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "access_level" text DEFAULT 'adult';
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_access_level_check" CHECK (access_level IN ('adult', 'kid'));

-- Update existing profiles strictly to adult
UPDATE "profiles" SET "access_level" = 'adult' WHERE "access_level" IS NULL;
