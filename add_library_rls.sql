-- Autoriser la lecture publique des fichiers de la bibliotheque
CREATE POLICY "Library Public Read" 
ON storage.objects FOR SELECT
USING (bucket_id = 'library');

-- Autoriser l'upload de fichiers aux admins/membres connectes
CREATE POLICY "Library Auth Upload" 
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'library');

-- Autoriser la modification
CREATE POLICY "Library Auth Update" 
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'library');

-- Autoriser la suppression
CREATE POLICY "Library Auth Delete" 
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'library');
