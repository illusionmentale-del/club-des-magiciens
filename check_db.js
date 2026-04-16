import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').limit(1);
    if (profile && profile.length) console.log("Profile columns:", Object.keys(profile[0]));
    
    // Check if we have any stats/activity table
    const { data: dbInfo, error } = await supabaseAdmin.rpc('get_schema_info').catch(() => null)
    // fallback if no rpc: just list tables directly using postgres schema
}
run();
