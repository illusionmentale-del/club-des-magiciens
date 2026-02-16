-- Add flags to library_items
ALTER TABLE library_items ADD COLUMN IF NOT EXISTS show_in_news BOOLEAN DEFAULT false;
ALTER TABLE library_items ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false;

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES library_items(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'completed',
    UNIQUE(user_id, item_id)
);

-- Enable RLS for user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for user_progress
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON user_progress
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can insert/update/delete progress" ON user_progress
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
-- Allow users to insert progress (validation) if we want client-side validation, 
-- but usually secure validation goes through server action. 
-- For now, let's allow inserts for authenticated users for their own id, but maybe restricted?
-- Better to use Server Actions with admin privilege or specific logic. 
-- So we keep standard RLS: only admins ALL, users SELECT.


-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    condition_type TEXT CHECK (condition_type IN ('count', 'specific_item', 'manual')),
    condition_value TEXT, -- Could be number (count) or item_id
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Policies for badges
CREATE POLICY "Everyone can view badges" ON badges
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage badges" ON badges
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Enable RLS for user_badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policies for user_badges
CREATE POLICY "Users can view their own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user badges" ON user_badges
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage user badges" ON user_badges
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
