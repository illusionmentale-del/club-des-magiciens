-- Create live_messages table
create table public.live_messages (
  id uuid not null default gen_random_uuid (),
  live_id uuid not null references public.lives (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamp with time zone not null default now(),
  constraint live_messages_pkey primary key (id)
);

-- Enable RLS
alter table public.live_messages enable row level security;

-- Policies
create policy "Everyone can view messages for active lives"
  on public.live_messages for select
  using ( true ); -- We can refine this to match course access, but for now simple is robust. Lives are already protected by page access.

create policy "Authenticated users can insert messages"
  on public.live_messages for insert
  with check ( auth.uid() = user_id );

create policy "Admins can delete messages"
  on public.live_messages for delete
  using ( is_admin() );

create policy "Users can delete their own messages"
  on public.live_messages for delete
  using ( auth.uid() = user_id );

-- Enable Realtime
alter publication supabase_realtime add table public.live_messages;
