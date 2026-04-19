import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const { data: legal, error: errLegal } = await supabaseAdmin.rpc('exec_sql', { query: `
        SELECT relname, relrowsecurity 
        FROM pg_class 
        WHERE relname IN ('legal_pages', 'products');
    ` }).catch(() => ({data: null, error: { message: "No exec_sql function" }}));
    console.log("exec_sql result:", legal, errLegal);
}
run();
