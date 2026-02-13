-- 1. Ensure RLS is enabled
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

-- 2. Allow Admins to UPDATE any profile (Fixes "Switch to Kids" bug)
CREATE POLICY "Admins can update all profiles" ON "profiles"
FOR UPDATE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. Allow Admins to DELETE any profile (Fixes "Delete User" bug)
CREATE POLICY "Admins can delete any profile" ON "profiles"
FOR DELETE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. Allow Admins to INSERT/SELECT (Generally covered but ensuring it)
CREATE POLICY "Admins can insert profiles" ON "profiles" FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can select all profiles" ON "profiles" FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
