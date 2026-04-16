import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
    const { data } = await supabaseAdmin.from('profiles').select('email, full_name, role, access_level, has_kids_access, has_adults_access').in('email', ['celine.boree@orange.fr', 'anais.duval24@sfr.fr', 'cissouherve@gmail.com']);
    console.log(JSON.stringify(data, null, 2));
}
run();
