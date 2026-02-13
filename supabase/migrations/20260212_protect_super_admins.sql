-- Create a function that prevents modification of protected users
CREATE OR REPLACE FUNCTION protect_super_admins()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the modified row is a Super Admin
    IF OLD.username IN ('LeMagicienPOV', 'AdminVente', 'AdminContact') THEN
        -- Allow updates only if the role remains 'admin' (e.g. updating city is fine, but demoting is not)
        IF TG_OP = 'UPDATE' AND NEW.role != 'admin' THEN
            RAISE EXCEPTION 'Action interdite : Vous ne pouvez pas rétrograder un Super Admin.';
        END IF;

        -- Prevent deletion entirely
        IF TG_OP = 'DELETE' THEN
            RAISE EXCEPTION 'Action interdite : Vous ne pouvez pas supprimer un Super Admin.';
        END IF;
        
        -- Prevent changing username to escape protection
        IF TG_OP = 'UPDATE' AND OLD.username != NEW.username THEN
             RAISE EXCEPTION 'Action interdite : Vous ne pouvez pas changer le pseudo d un Super Admin.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the profiles table
DROP TRIGGER IF EXISTS trigger_protect_super_admins ON public.profiles;

CREATE TRIGGER trigger_protect_super_admins
BEFORE UPDATE OR DELETE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION protect_super_admins();
