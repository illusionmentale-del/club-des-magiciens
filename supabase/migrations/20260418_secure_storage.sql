-- =========================================================================================
-- MIGRATION DE SÉCURITÉ CRITIQUE : VERROUILLAGE DES BUCKETS DE FICHIERS (STORAGE)
-- =========================================================================================

-- ---------------------------------------
-- 1. SECURISATION DU DOSSIER : 'avatars'
-- ---------------------------------------
-- On détruit les anciennes règles passoires
DROP POLICY IF EXISTS "Avatar Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Auth Delete" ON storage.objects;

-- On crée les nouvelles règles : seul le PROPRIÉTAIRE peut modifier ou supprimer !
CREATE POLICY "Avatar Auth Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid() = owner );

CREATE POLICY "Avatar Auth Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- ---------------------------------------
-- 2. SECURISATION DU DOSSIER : 'assets'
-- ---------------------------------------
-- On détruit les anciennes règles qui laissaient n'importe qui supprimer le site
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

-- On exige une vérification croisée avec la table Profile pour valider le titre "admin"
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'assets' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'assets' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'assets' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
