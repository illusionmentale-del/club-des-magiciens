-- Update profiles table
alter table public.profiles
add column if not exists stripe_customer_id text,
add column if not exists subscription_status subscription_status;

-- Add index for performance
create index if not exists idx_profiles_stripe_customer on public.profiles(stripe_customer_id);

-- Update courses table
alter table public.courses
add column if not exists is_primary boolean default false,
add column if not exists product_id uuid references public.products(id) on delete set null;

-- This allows linking a course to a specific product (Upsell),
-- If product_id is NULL and isn't primary, it might be just included content.
