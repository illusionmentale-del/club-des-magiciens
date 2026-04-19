-- Add stripe_price_id to library_items to support dynamic Stripe Checkout Sessions
ALTER TABLE public.library_items
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
