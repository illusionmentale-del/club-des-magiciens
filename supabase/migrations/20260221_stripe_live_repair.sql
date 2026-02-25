-- SCRIPT DE RÉPARATION ET MISE À JOUR STRIPE LIVE
-- Ce script vérifie l'existence de chaque colonne avant de modifier pour éviter les erreurs.

-- 1. S'assurer que le type ENUM existe pour les produits
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
        CREATE TYPE product_type AS ENUM ('subscription', 'pack', 'course', 'coaching');
    END IF;
END $$;

-- 2. Réparation de la structure de la table
DO $$ 
BEGIN
    -- Renommer audience en space si nécessaire
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='audience') THEN
        ALTER TABLE public.products RENAME COLUMN audience TO space;
    END IF;

    -- Ajouter la colonne 'type' si elle manque
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='type') THEN
        ALTER TABLE public.products ADD COLUMN type product_type DEFAULT 'subscription';
    END IF;

    -- Ajouter la colonne 'stripe_price_id' si elle manque
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stripe_price_id') THEN
        ALTER TABLE public.products ADD COLUMN stripe_price_id TEXT;
    END IF;
END $$;

-- 3. Mise à jour finale de l'ID de prix pour l'abonnement Kids
UPDATE public.products 
SET stripe_price_id = 'price_1T3F6F2IgBxZVIpbyUWe7umS',
    type = 'subscription'
WHERE (space = 'kids') AND (title ILIKE '%Apprenti%' OR title ILIKE '%Kids%');
