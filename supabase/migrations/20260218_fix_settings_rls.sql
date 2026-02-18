-- Enable RLS on settings table (if not already enabled)
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Public settings read access" ON public.settings;

-- Create policy to allow everyone to read settings
CREATE POLICY "Public settings read access" ON public.settings
    FOR SELECT
    USING (true);

-- Ensure admins can manage settings (if not already covered)
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
CREATE POLICY "Admins can manage settings" ON public.settings
    FOR ALL
    USING (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
