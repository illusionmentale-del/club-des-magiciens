-- 1. Table des Actualités (News/Events)
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT DEFAULT 'info', -- 'info', 'event', 'new_course'
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), -- Date affichée
    link_url TEXT, -- Lien optionnel (ex: vers un cours)
    link_text TEXT, -- Texte du lien (ex: "Voir le cours")
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table des Paramètres Globaux (Settings)
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY, -- ex: 'featured_video'
    value TEXT, -- ex: 'https://youtube.com...'
    label TEXT -- Description pour l'admin
);

-- 3. Sécurité (RLS)
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- News: Tout le monde peut lire, seul l'Admin peut modifier
CREATE POLICY "Public news view" ON public.news FOR SELECT USING (true);
CREATE POLICY "Admin news manage" ON public.news FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Settings: Tout le monde peut lire, seul l'Admin peut modifier
CREATE POLICY "Public settings view" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admin settings manage" ON public.settings FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 4. Données initiales (Seed)
INSERT INTO public.settings (key, value, label) VALUES
('featured_video', 'https://www.youtube.com/embed/5K17iK1vF6s', 'ID Youtube Vidéo à la Une'),
('shop_link', 'https://paypal.com', 'Lien de la Boutique'),
('welcome_message', 'Bienvenue dans le QG du Club !', 'Message d''accueil Dashboard')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.news (title, content, type, link_text, link_url) VALUES
('Bienvenue sur la V2', 'Le nouveau Dashboard est en ligne. Profitez de votre espace.', 'info', null, null),
('Prochain Live', 'Rendez-vous Samedi pour un live exclusif.', 'event', 'Rejoindre', '/dashboard/live');
