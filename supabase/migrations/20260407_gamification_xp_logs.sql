-- 1. Create the secure XP Ledger Table
CREATE TABLE IF NOT EXISTS public.user_xp_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(255) NOT NULL,
    xp_awarded INTEGER NOT NULL,
    reference_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, action_type, reference_id)
);

-- 2. Secure it with Row Level Security
ALTER TABLE public.user_xp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own XP logs" 
    ON public.user_xp_logs FOR SELECT 
    USING (auth.uid() = user_id);

-- Explicitly allow service role bypass (always enabled by default but good for clarity)
-- Note: NO insert/update POLICY is created for users. ONLY the server can insert.

-- 3. Create the automatic profile updater function
CREATE OR REPLACE FUNCTION update_user_xp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET xp = (
        SELECT COALESCE(SUM(xp_awarded), 0)
        FROM public.user_xp_logs
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach the trigger
DROP TRIGGER IF EXISTS trigger_update_xp ON public.user_xp_logs;
CREATE TRIGGER trigger_update_xp
AFTER INSERT OR UPDATE OR DELETE ON public.user_xp_logs
FOR EACH ROW
EXECUTE FUNCTION update_user_xp();

-- 5. Migration of existing XP (Optional safety step to avoid reverting current progress)
-- This reads the current 'xp' from profiles and inserts a 'legacy_balance' log
INSERT INTO public.user_xp_logs (user_id, action_type, xp_awarded, reference_id)
SELECT id, 'legacy_balance', xp, 'initial_migration'
FROM public.profiles
WHERE xp > 0
ON CONFLICT (user_id, action_type, reference_id) DO NOTHING;
