-- 1. Create Purchase/Access tracking table
CREATE TABLE IF NOT EXISTS public.user_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL, 
    library_item_id UUID REFERENCES public.library_items(id) ON DELETE CASCADE,
    systeme_io_order_id TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Constraints
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_purchases_user_id_library_item_id_key') THEN
    ALTER TABLE public.user_purchases ADD CONSTRAINT user_purchases_user_id_library_item_id_key UNIQUE (user_id, library_item_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_purchases_user_id_course_id_key') THEN
    ALTER TABLE public.user_purchases ADD CONSTRAINT user_purchases_user_id_course_id_key UNIQUE (user_id, course_id);
  END IF;
END $$;

-- 3. RLS
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_purchases;
CREATE POLICY "Users can view their own purchases" ON public.user_purchases
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage purchases" ON public.user_purchases;
CREATE POLICY "Admins can manage purchases" ON public.user_purchases
    FOR ALL USING (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

-- 4. Reload the API Cache
NOTIFY pgrst, 'reload schema';
