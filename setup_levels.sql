CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Table des Niveaux/Grades (Admin)
CREATE TABLE IF NOT EXISTS public.gamification_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    xp_threshold INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.gamification_levels ENABLE ROW LEVEL SECURITY;

-- 3.A. Policies
CREATE POLICY "Les niveaux sont visibles par tous"
ON public.gamification_levels FOR SELECT USING (true);

-- 3.B. Insertion des niveaux par défaut pour ne rien casser
INSERT INTO public.gamification_levels (name, xp_threshold) VALUES
('Apprenti', 0),
('Curieux de la Magie', 150),
('Chercheur de Secrets', 300),
('Manipulateur d''Ombres', 600),
('Magicien Initié', 1000),
('As de la Dextérité', 1800),
('Créateur d''Illusions', 3000),
('Maître du Détournement', 5000),
('Illusionniste', 8000),
('Prodige de la Magie', 12000),
('Expert des Mystères', 18000),
('Gardien des Secrets', 25000),
('Sorcier Suprême', 40000)
ON CONFLICT DO NOTHING;
