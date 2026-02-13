-- Add audience column to content tables
-- Audience enum: 'adults' (default), 'kids', 'all'

-- News
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "audience" text DEFAULT 'adults';
ALTER TABLE "news" ADD CONSTRAINT "news_audience_check" CHECK (audience IN ('adults', 'kids', 'all'));

-- Courses
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "audience" text DEFAULT 'adults';
ALTER TABLE "courses" ADD CONSTRAINT "courses_audience_check" CHECK (audience IN ('adults', 'kids', 'all'));

-- Products
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "audience" text DEFAULT 'adults';
ALTER TABLE "products" ADD CONSTRAINT "products_audience_check" CHECK (audience IN ('adults', 'kids', 'all'));

-- Lives
ALTER TABLE "lives" ADD COLUMN IF NOT EXISTS "audience" text DEFAULT 'adults';
ALTER TABLE "lives" ADD CONSTRAINT "lives_audience_check" CHECK (audience IN ('adults', 'kids', 'all'));

-- Profiles (Optional: tag users, but strictly speaking we might just rely on login context, 
-- but having a flag is safer for RLS)
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "is_kid" boolean DEFAULT false;
