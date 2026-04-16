CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table des configurations des Quêtes (Admin)
CREATE TABLE IF NOT EXISTS public.gamification_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL, -- ex: 'videos_watched', 'lifetime_xp'
    trigger_value INTEGER NOT NULL, -- la cible à atteindre (ex: 5 pour '5 videos_watched')
    reward_xp INTEGER DEFAULT 0, -- combien ça rapporte d'Éclats/XP à la réussite
    reward_item_id UUID REFERENCES public.library_items(id) ON DELETE SET NULL, -- Un secret gratuit offert (optionnel)
    icon_url TEXT, -- URL de l'icône du succès
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.gamification_quests ENABLE ROW LEVEL SECURITY;

-- 1.A. Policies
CREATE POLICY "Les quêtes sont visibles par tous"
ON public.gamification_quests FOR SELECT USING (true);
-- L'admin pourra insérer via le SDK en mode bypass (service_role)

-- 2. Table du suivi de progression de l'utilisateur (Historique)
CREATE TABLE IF NOT EXISTS public.user_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_id UUID REFERENCES public.gamification_quests(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, quest_id)
);

ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

-- 2.A. Policies
CREATE POLICY "Les utilisateurs voient leurs propres quêtes"
ON public.user_quests FOR SELECT USING (auth.uid() = user_id);
