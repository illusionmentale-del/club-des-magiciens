const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkRecent() {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    // Check recent profiles
    const { data: profiles } = await supabase.from('profiles').select('id, email, full_name, created_at, updated_at').gte('updated_at', fifteenMinsAgo);
    console.log("Recent Profiles Updated:", profiles?.length);
    console.log(profiles);

    // Check recent purchases
    const { data: purchases } = await supabase.from('user_purchases').select('*').gte('created_at', fifteenMinsAgo);
    console.log("Recent Purchases:", purchases?.length);
}
checkRecent();
