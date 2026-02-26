-- Add context column to course_comments to isolate Kids and Adults comments
ALTER TABLE course_comments 
ADD COLUMN IF NOT EXISTS context VARCHAR(50) DEFAULT 'adults';

-- Backfill existing comments (mostly assumed adult unless they match a library_item ID)
-- Since we can't easily join on library_items vs courses without checking both tables,
-- we'll leave existing ones as 'adults' or update them specifically if needed later.
-- We can set a trigger or just handle it in the application logic.

-- Ensure the column is properly indexed for faster queries
CREATE INDEX IF NOT EXISTS idx_course_comments_context ON course_comments(context);
