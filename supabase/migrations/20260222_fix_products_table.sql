-- 1. Ajouter les colonnes manquantes à la table products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'eur';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Insérer l'Abonnement Mensuel
INSERT INTO public.products (title, description, space, type, price, currency, stripe_price_id, is_active)
VALUES (
  'Abonnement Mensuel', 
  'Sans engagement. Nouveau contenu chaque semaine.', 
  'kids', 
  'subscription', 
  '1499', -- Ou '14.99' si ta colonne est toujours en texte
  'eur', 
  'price_1QxMensuelTestId', -- A CHANGER APRES AVOIR CREE LE PRIX STRIPE
  true
);

-- 3. Insérer l'Abonnement Annuel
INSERT INTO public.products (title, description, space, type, price, currency, stripe_price_id, is_active)
VALUES (
  'Abonnement Annuel', 
  '2 mois offerts. Cadeaux exclusifs.', 
  'kids', 
  'subscription', 
  '14990', -- Ou '149.90' si ta colonne est toujours en texte
  'eur', 
  'price_1QxAnnuelTestId', -- A CHANGER APRES AVOIR CREE LE PRIX STRIPE
  true
);
