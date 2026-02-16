-- Add avatar columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url_kids TEXT;

-- Storage Bucket for Avatars (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Public Read
CREATE POLICY "Avatar Public Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Authenticated Upload (User can upload their own)
-- Note: 'path' usually contains user_id, e.g. "user_id/avatar.jpg"
-- But for simplicity, we let authenticated users upload.
CREATE POLICY "Avatar Auth Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Authenticated Update (User can replace their own)
CREATE POLICY "Avatar Auth Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Authenticated Delete
CREATE POLICY "Avatar Auth Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
