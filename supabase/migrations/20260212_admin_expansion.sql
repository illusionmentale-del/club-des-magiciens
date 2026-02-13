-- 1. Table Boutique (Produits)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT, -- ex: "47€", "Gratuit"
    image_url TEXT, -- URL de l'image (hébergée ailleurs ou Supabase Storage)
    link_url TEXT, -- Lien vers le paiement (Systeme.io, PayPal)
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table Instagram (Feed Manuel)
CREATE TABLE IF NOT EXISTS public.instagram_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL, -- Screenshot ou photo
    link_url TEXT, -- Lien vers le post réel
    caption TEXT, -- Légende (optionnel)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Sécurité (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- Policies Products
CREATE POLICY "Public products view" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin products manage" ON public.products FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Policies Instagram
CREATE POLICY "Public video view" ON public.instagram_posts FOR SELECT USING (true); -- Copy paste error in name but functional
CREATE POLICY "Admin instagram manage" ON public.instagram_posts FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 4. Initial Settings Keys (Seed for new texts)
INSERT INTO public.settings (key, value, label) VALUES
('dashboard_title', 'Le QG du Club ✨', 'Titre Principal du Dashboard'),
('news_title', 'Quoi de neuf ?', 'Titre de la section News'),
('instagram_title', 'Sur Instagram', 'Titre de la section Instagram')
ON CONFLICT (key) DO NOTHING;
