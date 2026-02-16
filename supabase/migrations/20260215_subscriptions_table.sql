-- Create subscriptions table
create type subscription_status as enum ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused');

create table if not exists public.subscriptions (
  id text primary key, -- Stripe Subscription ID
  user_id uuid references public.profiles(id) on delete cascade not null,
  status subscription_status not null,
  metadata jsonb,
  price_id text, -- Stripe Price ID reference
  quantity integer,
  cancel_at_period_end boolean,
  created wth time zone default now(),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  ended_at timestamp with time zone,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone
);

-- RLS
alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Admins can view all subscriptions"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only service role (webhooks) should insert/update subscriptions mainly, 
-- but admins might need manual override.
create policy "Admins can manage subscriptions"
  on public.subscriptions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
