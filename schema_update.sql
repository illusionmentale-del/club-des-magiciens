-- 1. Update Profiles Table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS magic_level text,
ADD COLUMN IF NOT EXISTS bio text;

-- 2. Create Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Enable RLS on Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Comments
-- Everyone can read comments
CREATE POLICY "Public comments are viewable by everyone" 
ON comments FOR SELECT 
USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Users can insert their own comments" 
ON comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update/delete their own comments
CREATE POLICY "Users can update own comments" 
ON comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" 
ON comments FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Add username to Profiles policy (if needed, usually public read is already there)
