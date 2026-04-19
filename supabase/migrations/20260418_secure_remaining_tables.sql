-- Audit 18: Fallback Security for all manually created Gamification and Push Tables
-- If these tables were created on the Supabase Dashboard, they might not have RLS enabled.
-- -----------------------------------------------------------------------------------------

-- 1. PUSH SUBSCRIPTIONS
ALTER TABLE IF EXISTS public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can manage their own push subscriptions"
ON public.push_subscriptions
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view and delete all push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Admins can view and delete all push subscriptions"
ON public.push_subscriptions
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

DROP POLICY IF EXISTS "Admins can delete all push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Admins can delete all push subscriptions"
ON public.push_subscriptions
FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);


-- 2. AVATAR SKINS
ALTER TABLE IF EXISTS public.avatar_skins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view avatar skins" ON public.avatar_skins;
CREATE POLICY "Anyone can view avatar skins"
ON public.avatar_skins
FOR SELECT USING (true);


-- 3. USER UNLOCKED SKINS
ALTER TABLE IF EXISTS public.user_unlocked_skins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own unlocked skins" ON public.user_unlocked_skins;
CREATE POLICY "Users can view their own unlocked skins"
ON public.user_unlocked_skins
FOR SELECT USING (auth.uid() = user_id);

-- Note: No INSERT/UPDATE policy for users. Unlock MUST happen via Server Actions bypassing RLS.

-- 4. USER XP LOGS (Verify lock)
ALTER TABLE IF EXISTS public.user_xp_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own xp logs" ON public.user_xp_logs;
CREATE POLICY "Users can view their own xp logs" 
ON public.user_xp_logs
FOR SELECT USING (auth.uid() = user_id);

-- Note: No INSERT policy for users. XP MUST happen via gamification triggers or Server Actions.

-- 5. PRODUCTS
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT USING (true);

-- Admin policies for products (if missing)
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
