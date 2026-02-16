-- Add audience column to instagram_posts
ALTER TABLE "instagram_posts" ADD COLUMN IF NOT EXISTS "audience" text DEFAULT 'adults';
ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_audience_check" CHECK (audience IN ('adults', 'kids', 'all'));
