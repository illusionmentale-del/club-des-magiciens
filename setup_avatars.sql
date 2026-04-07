-- Activer l'extension UUID si ce n'est pas fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table Catalogue des Skins
CREATE TABLE IF NOT EXISTS public.avatar_skins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    price_xp INTEGER NOT NULL DEFAULT 0,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.avatar_skins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skins visibles par tous" ON public.avatar_skins FOR SELECT USING (true);


-- 2. Table de l'Armoire de l'Utiisateur (Skins possédés)
CREATE TABLE IF NOT EXISTS public.user_unlocked_skins (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skin_id UUID NOT NULL REFERENCES public.avatar_skins(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, skin_id)
);

ALTER TABLE public.user_unlocked_skins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les enfants voient leurs propres skins" ON public.user_unlocked_skins FOR SELECT USING (auth.uid() = user_id);


-- 3. Ajout de la colonne "Skin équipé" dans le profil
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS equipped_skin_id UUID REFERENCES public.avatar_skins(id) ON DELETE SET NULL;


-- Insertion d'un Avatar de Base (Le petit Sorcier par défaut)
INSERT INTO public.avatar_skins (name, image_url, price_xp, is_default)
VALUES (
    'Élève Normal', 
    'https://api.dicebear.com/7.x/bottts/svg?seed=Magicien', 
    0, 
    true
);
