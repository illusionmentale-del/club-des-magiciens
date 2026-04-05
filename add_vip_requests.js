const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS public.vip_requests (
                id uuid default gen_random_uuid() primary key,
                child_name text not null,
                parent_email text not null,
                context text not null,
                status text default 'en_attente' check (status in ('en_attente', 'approuve', 'rejete')),
                created_at timestamp with time zone default timezone('utc'::text, now()) not null
            );

            -- Enable RLS
            ALTER TABLE public.vip_requests ENABLE ROW LEVEL SECURITY;

            -- Drop policies if exist to re-add them
            DROP POLICY IF EXISTS "VIP Requests are viewable by admins" ON public.vip_requests;
            DROP POLICY IF EXISTS "Anyone can insert a VIP request" ON public.vip_requests;
            DROP POLICY IF EXISTS "Admins can update VIP requests" ON public.vip_requests;

            -- Admins can view
            CREATE POLICY "VIP Requests are viewable by admins" ON public.vip_requests
                FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));

            -- Public can insert
            CREATE POLICY "Anyone can insert a VIP request" ON public.vip_requests
                FOR INSERT WITH CHECK (true);

            -- Admins can update status
            CREATE POLICY "Admins can update VIP requests" ON public.vip_requests
                FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() IN (SELECT id FROM public.profiles WHERE is_admin = true));
        `;

        console.log("Applying VIP Requests Schema...");
        
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey
            },
            body: JSON.stringify({ query: sql })
        });
        
        const text = await response.text();
        console.log('Result:', text || 'Success (No output means it succeeded without returning rows)');
    } catch(e) {
        console.error("Error executing script:", e);
    }
}

run();
