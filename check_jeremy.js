const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: profile } = await supabase.from('profiles').select('*').eq('email', 'jeremymarouani@gmail.com').maybeSingle();
    console.log("Profile:", profile ? profile.id : "Not found");
    if (profile) {
        const { data: purchases } = await supabase.from('user_purchases').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
        console.log("Purchases for jeremymarouani@gmail.com:", purchases?.length);
        if (purchases && purchases.length > 0) {
            console.log("Latest purchase created at:", purchases[0].created_at, "Item:", purchases[0].library_item_id);
        }
    }
}
check();
