-- Create products table
create type product_type as enum ('subscription', 'pack', 'course', 'coaching');
create type space_type as enum ('kids', 'adults');

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  space space_type not null,
  type product_type not null,
  title text not null,
  description text,
  price integer not null, -- in cents
  currency text default 'eur',
  stripe_price_id text, -- ID from Stripe
  metadata jsonb default '{}'::jsonb, -- benefits, prerequisites
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table public.products enable row level security;

create policy "Public can view active products"
  on public.products for select
  using (is_active = true);

create policy "Admins can manage products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
