-- =========================================================================================
-- MIGRATION DE SÉCURITÉ CRITIQUE : PROTECTION DES COLONNES SENSIBLES SUR PROFILES
-- =========================================================================================
-- Empêche l'escalade de privilèges via l'API publique (les utilisateurs modifiant leur propre RLS)

CREATE OR REPLACE FUNCTION protect_profile_columns()
RETURNS TRIGGER AS $$
BEGIN
    -- On vérifie l'identité de l'appelant via le token JWT Supabase.
    -- Les utilisateurs passant par le navigateur ou l'API publique sont reconnus comme 'authenticated' ou 'anon'.
    -- Les appels internes (via le code serveur avec la Service Key) sont reconnus comme 'service_role' (ou NULL en direct).
    IF current_setting('request.jwt.claim.role', true) IN ('authenticated', 'anon') THEN
        
        -- Réinitialisation de Force : si un hackeur envoie un nouveau 'role' via le front-end,
        -- on l'écrase immédiatement avec l'ancienne valeur avant sauvegarde en DB.
        NEW.role := OLD.role;
        NEW.is_admin := OLD.is_admin;
        NEW.access_level := OLD.access_level;
        NEW.has_adults_access := OLD.has_adults_access;
        NEW.has_kids_access := OLD.has_kids_access;
        
        -- Protection Physique & Gamification
        NEW.xp := OLD.xp;
        NEW.magic_level := OLD.magic_level;
        NEW.subscription_status := OLD.subscription_status;
        NEW.kids_trial_expires_at := OLD.kids_trial_expires_at;
        NEW.stripe_customer_id := OLD.stripe_customer_id;
        NEW.deleted_at := OLD.deleted_at;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- On supprime l'ancien trigger s'il existait lors de nos tests
DROP TRIGGER IF EXISTS protect_profile_columns_trigger ON public.profiles;

-- On fixe le nouveau chien de garde sur la porte des modifications
CREATE TRIGGER protect_profile_columns_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION protect_profile_columns();
