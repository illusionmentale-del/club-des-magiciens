import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const { data: profile } = await supabaseAdmin.from('profiles').select('email').limit(1).single();
    if (profile && profile.email) {
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email: profile.email });
        console.log("Link:", data?.properties?.action_link, "Error:", error);
    }
}
run();
