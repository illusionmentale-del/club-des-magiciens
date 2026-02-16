-- 1. Create Purchase/Access tracking table
CREATE TABLE IF NOT EXISTS public.user_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL, -- Optional link to product
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- 2. Add Sales Page URL to Courses (for locked items)
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "sales_page_url" text;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "price_label" text; -- ex: "47€" or "Inclus dans le Club"

-- 3. RLS for user_purchases
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases" ON public.user_purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage purchases" ON public.user_purchases
    FOR ALL USING (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
