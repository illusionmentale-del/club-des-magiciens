CREATE TABLE IF NOT EXISTS public.vip_requests (
    id uuid default gen_random_uuid() primary key,
    child_name text not null,
    parent_email text not null,
    context text not null,
    status text default 'en_attente' check (status in ('en_attente', 'approuve', 'rejete')),
    wants_newsletter boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.vip_requests ENABLE ROW LEVEL SECURITY;

-- Admins can view
CREATE POLICY "VIP Requests are viewable by admins" ON public.vip_requests
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));

-- Public can insert
CREATE POLICY "Anyone can insert a VIP request" ON public.vip_requests
    FOR INSERT WITH CHECK (true);

-- Admins can update status
CREATE POLICY "Admins can update VIP requests" ON public.vip_requests
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));
