-- Exécute ce script dans le Supabase SQL Editor pour ajouter les deux colonnes

ALTER TABLE public.library_items 
ADD COLUMN IF NOT EXISTS public_slug text UNIQUE;

ALTER TABLE public.library_items 
ADD COLUMN IF NOT EXISTS public_description text;
