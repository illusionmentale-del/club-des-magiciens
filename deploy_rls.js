const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const sql = fs.readFileSync('supabase/migrations/20260418_protect_profiles_rls.sql', 'utf8');
    // Using a simple RPC or executing it if we have unhandled SQL runner. Wait, we usually use run_sql.js if it exists, or just REST API.
    // Let's try rpc 'exec_sql' if it exists.
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { query: sql }).catch(() => ({data: null, error: { message: "No exec_sql function" }}));
    if(error && error.message.includes("No exec_sql")) {
        console.log("No exec_sql, trying to create it first...");
    } else {
        console.log("Result:", data, error);
    }
}
run();
