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
('Magicien', 50),
('Illusionniste', 150)
ON CONFLICT DO NOTHING;
