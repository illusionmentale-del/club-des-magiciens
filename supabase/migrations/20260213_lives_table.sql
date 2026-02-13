-- Table des Lives
CREATE TABLE IF NOT EXISTS public.lives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'programmé', -- 'programmé', 'en_cours', 'terminé'
    platform TEXT DEFAULT 'jitsi', -- 'jitsi', 'vimeo' (pour replay)
    platform_id TEXT, -- Nom de la salle Jitsi ou ID Vimeo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sécurité (RLS)
ALTER TABLE public.lives ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les lives
CREATE POLICY "Public lives view" ON public.lives FOR SELECT USING (true);

-- Seul l'admin peut gérer
CREATE POLICY "Admin lives manage" ON public.lives FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Données de démo
INSERT INTO public.lives (title, start_date, status, platform_id) 
VALUES ('Bienvenue au Club', now() + interval '1 day', 'programmé', 'ClubMagiciens-Bienvenue');
