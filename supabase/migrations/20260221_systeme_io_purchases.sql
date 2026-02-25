-- 1. Add fields to user_purchases to support library_items and systeme.io
ALTER TABLE public.user_purchases 
ADD COLUMN IF NOT EXISTS library_item_id UUID REFERENCES public.library_items(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS systeme_io_order_id TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Add Unique constraint for user_id and library_item_id to prevent duplicate unlocked content
ALTER TABLE public.user_purchases
ADD CONSTRAINT user_purchases_user_id_library_item_id_key UNIQUE (user_id, library_item_id);

-- 3. Add fields to library_items for the shop
ALTER TABLE public.library_items
ADD COLUMN IF NOT EXISTS sales_page_url TEXT,
ADD COLUMN IF NOT EXISTS price_label TEXT;
