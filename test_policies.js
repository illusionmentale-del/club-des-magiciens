import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById("0995a582-fc53-4ea6-a241-9c8f1fffca67");
    console.log("Got user");
    
    // Attempt to select as that user bypassing admin
    // Actually, getting RLS policies is easier:
    const { data: p } = await supabaseAdmin.rpc('get_policies', { table_name: 'library_items' }).catch(() => ({data: null}));
    console.log(p);
}
run();
