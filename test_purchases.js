import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const userId = "0995a582-fc53-4ea6-a241-9c8f1fffca67";
    const { data: purchases } = await supabaseAdmin.from('user_purchases').select('library_item_id').eq('user_id', userId).eq('status', 'active');
    console.log("Purchases:", purchases);
    
    if (purchases && purchases.length > 0) {
        const purchaseIds = purchases.map(p => p.library_item_id);
        const { data: items, error } = await supabaseAdmin.from('library_items').select('id, title, is_published, audience, published_at').in('id', purchaseIds);
        console.log("Items from Admin:", items);
    }
}
run();
