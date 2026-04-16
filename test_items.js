import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const purchaseIds = [ '02419cb1-f197-48c6-8a9d-4c13a52d7d45', 'b028a995-b48c-4c63-86c7-1106abecfdc6' ];
    const { data: items } = await supabaseAdmin.from('library_items').select('id, title, is_published, audience').in('id', purchaseIds);
    console.log(items);
}
run();
