-- MISE À JOUR DES PRIX STRIPE LIVE
-- Exécute ce script dans l'éditeur SQL de Supabase

-- 1. On renomme la colonne pour être cohérent avec le code
ALTER TABLE public.products 
RENAME COLUMN audience TO space;

-- 2. On met à jour l'abonnement Kids (Apprenti Magicien) avec ton tarif
UPDATE public.products 
SET stripe_price_id = 'price_1T3F6F2IgBxZVIpbyUWe7umS'
WHERE space = 'kids' AND type = 'subscription';
