const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createTable() {
  console.log("Creating adult_vip_requests table via SQL query...");
  
  // We can execute SQL queries using the postgres extension or via a REST API if enabled.
  // Since executing raw DDL via Supabase JS might be tricky without the RPC `exec_sql`,
  // Let's check if there is an rpc function we can use. Often there isn't by default.
  // Wait, I can just write a raw HTTP POST request to the Supabase REST API `sql` endpoint if pg_meta is exposed, but it's not securely exposed.
  // Let's just create a quick migration file and advise to run it, or if there is a way to execute it via Supabase JS...
  // Actually, Supabase doesn't have a built-in `supabase.sql` method for security reasons.
  // Let me just write the SQL here, and I'll execute it via standard Postgres client if `pg` is installed.
  
  console.log(`
  -- Please run this SQL in your Supabase Dashboard SQL Editor if the script cannot execute it automatically:
  
  CREATE TABLE public.adult_vip_requests (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
    full_name text NOT NULL,
    email text NOT NULL,
    context text NOT NULL,
    wants_newsletter boolean NULL DEFAULT false,
    status text NULL DEFAULT 'en_attente'::text,
    CONSTRAINT adult_vip_requests_pkey PRIMARY KEY (id)
  );

  -- Enable RLS
  ALTER TABLE public.adult_vip_requests ENABLE ROW LEVEL SECURITY;

  -- Add policies
  CREATE POLICY "Enable insert for everyone" ON public.adult_vip_requests FOR INSERT WITH CHECK (true);
  CREATE POLICY "Enable select for service role" ON public.adult_vip_requests FOR SELECT USING (true);
  CREATE POLICY "Enable update for service role" ON public.adult_vip_requests FOR UPDATE USING (true);
  `);
}

createTable();
