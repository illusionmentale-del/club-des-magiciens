-- 1. On ajoute une colonne pour repérer nos abonnés annuels
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_annual_subscriber BOOLEAN DEFAULT false;

-- 2. Activation de pg_cron (nécessite d'être un superuser Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3. Création de la fonction qui va distribuer les +100 XP
CREATE OR REPLACE FUNCTION public.distribute_monthly_annual_xp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    annual_user RECORD;
    safe_reference TEXT;
BEGIN
    -- On boucle sur tous les profils avec abonnement actif ET formule annuelle
    FOR annual_user IN 
        SELECT id FROM public.profiles 
        WHERE subscription_status = 'active' AND is_annual_subscriber = true
    LOOP
        safe_reference := 'annual_drip_' || to_char(now(), 'YYYY_MM') || '_' || annual_user.id::TEXT;
        
        -- Insertion sécurisée (les doublons sont ignorés grâce à la contrainte unique si existante)
        BEGIN
            INSERT INTO public.user_xp_logs (user_id, action_type, xp_awarded, reference_id)
            VALUES (annual_user.id, 'annual_drip_monthly', 100, safe_reference);
            
            RAISE NOTICE '100 XP attribués à %', annual_user.id;
        EXCEPTION WHEN unique_violation THEN
            -- Ignorer silencieusement si la personne a déjà eu ses points ce mois-ci
            RAISE NOTICE 'Points déjà reçus pour %', annual_user.id;
        END;
    END LOOP;
END;
$$;

-- 4. Planification du job tous les 1er du mois à Minuit
SELECT cron.schedule(
    'distribute-annual-xp-monthly', 
    '0 0 1 * *', -- Minuit le 1er du mois
    'SELECT public.distribute_monthly_annual_xp();'
);
