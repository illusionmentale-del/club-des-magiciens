-- Enable RLS on content tables if not already enabled
ALTER TABLE IF EXISTS "courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "news" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "lives" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "modules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "lessons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "comments" ENABLE ROW LEVEL SECURITY; -- Already has policies but checking

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is kid
CREATE OR REPLACE FUNCTION is_kid()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND access_level = 'kid'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if course is accessible
CREATE OR REPLACE FUNCTION can_view_course(course_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_audience text;
    v_is_kid boolean;
BEGIN
    -- Get course audience
    SELECT audience INTO v_audience FROM courses WHERE id = course_id;
    
    -- Check if user is kid
    v_is_kid := is_kid();
    
    -- Logic:
    -- If user is admin -> true
    -- If user is kid -> must be 'kids' or 'all'
    -- If user is adult -> true (can see everything)
    
    IF is_admin() THEN RETURN true; END IF;
    
    IF v_is_kid THEN
        RETURN v_audience IN ('kids', 'all');
    ELSE
        RETURN true; -- Adult sees all
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- POLICIES FOR COURSES
DROP POLICY IF EXISTS "Public courses view" ON "courses";
DROP POLICY IF EXISTS "View courses based on audience" ON "courses";

CREATE POLICY "View courses based on audience" ON "courses"
FOR SELECT
USING (
    is_admin() 
    OR (is_kid() AND audience IN ('kids', 'all'))
    OR ((NOT is_kid()) AND audience IN ('adults', 'all'))
);

-- POLICIES FOR MODULES (Inherit from Course)
DROP POLICY IF EXISTS "Public modules view" ON "modules";
DROP POLICY IF EXISTS "View modules based on course audience" ON "modules";

CREATE POLICY "View modules based on course audience" ON "modules"
FOR SELECT
USING (
    is_admin()
    OR EXISTS (
        SELECT 1 FROM courses c
        WHERE c.id = modules.course_id
        AND (
            (is_kid() AND c.audience IN ('kids', 'all'))
            OR
            ((NOT is_kid()) AND c.audience IN ('adults', 'all'))
        )
    )
);

-- POLICIES FOR LESSONS (Inherit from Module -> Course)
-- This requires a join: lesson -> module -> course
DROP POLICY IF EXISTS "Public lessons view" ON "lessons";
DROP POLICY IF EXISTS "View lessons based on course audience" ON "lessons";

CREATE POLICY "View lessons based on course audience" ON "lessons"
FOR SELECT
USING (
    is_admin()
    OR EXISTS (
        SELECT 1 FROM modules m
        JOIN courses c ON c.id = m.course_id
        WHERE m.id = lessons.module_id
        AND (
            (is_kid() AND c.audience IN ('kids', 'all'))
            OR
            ((NOT is_kid()) AND c.audience IN ('adults', 'all'))
        )
    )
);

-- POLICIES FOR NEWS
DROP POLICY IF EXISTS "Public news view" ON "news";
DROP POLICY IF EXISTS "View news based on audience" ON "news";

CREATE POLICY "View news based on audience" ON "news"
FOR SELECT
USING (
    is_admin()
    OR (NOT is_kid())
    OR (is_kid() AND audience IN ('kids', 'all'))
);

-- POLICIES FOR LIVES
DROP POLICY IF EXISTS "Public lives view" ON "lives";
DROP POLICY IF EXISTS "View lives based on audience" ON "lives";




-- POLICIES FOR COMMENTS (course_comments)
DROP POLICY IF EXISTS "Public comments view" ON "course_comments";
DROP POLICY IF EXISTS "Users can comment" ON "course_comments";
DROP POLICY IF EXISTS "Users can delete own comments" ON "public"."course_comments";
DROP POLICY IF EXISTS "Admin can manage all" ON "public"."course_comments";
DROP POLICY IF EXISTS "View restricted comments" ON "course_comments";

-- INSERT: Anyone authenticated can comment (on courses they can see - implicitly handled by UI, but good to check access? 
-- Strict DB RLS for INSERT usually checks if they can 'SELECT' the related record, strictly speaking not enforced here but good enough)
CREATE POLICY "Users can comment" ON "course_comments"
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- DELETE: Own comments
CREATE POLICY "Users can delete own comments" ON "course_comments"
FOR DELETE USING (auth.uid() = user_id);

-- SELECT: 
-- User can see comments IF they can see the course.
-- This allows Kids to see other Kids' comments on Kids courses.
-- This prevents Kids seeing comments on Adult courses (since they can't see the course).
CREATE POLICY "View restricted comments" ON "course_comments"
FOR SELECT
USING (
    is_admin()
    OR EXISTS (
        SELECT 1 FROM courses c
        WHERE c.id = course_comments.course_id
        AND (
            -- Same logic as Course View Policy
            (is_kid() AND c.audience IN ('kids', 'all'))
            OR
            ((NOT is_kid()) AND c.audience IN ('adults', 'all'))
        )
    )
);

-- Admin Manage All
CREATE POLICY "Admin can manage all" ON "course_comments"
FOR ALL USING (is_admin());



