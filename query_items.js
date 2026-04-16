import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    // Check what elements are in library_items that are considered boutique.
    const { data } = await supabaseAdmin.from('library_items').select('id, title, xp_price, price_label, week_number').not('xp_price', 'is', null);
    console.log("With XP price:", data);

    const { data: data2 } = await supabaseAdmin.from('library_items').select('id, title, xp_price, price_label, week_number').not('price_label', 'is', null);
    console.log("With Price Label:", data2);
}
run();
