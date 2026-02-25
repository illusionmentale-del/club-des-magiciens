const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    console.log("Checking email: encodeur-chrome-4r@icloud.com");
    
    // Check Profile
    const { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('email', 'encodeur-chrome-4r@icloud.com').maybeSingle();
    console.log("Profile:", profile || (pErr ? pErr.message : "Not found"));

    if (profile) {
        // Check Purchases
        const { data: purchases, error: puErr } = await supabase.from('user_purchases').select('*').eq('user_id', profile.id);
        console.log("Purchases:", purchases?.length || 0, "found.");
    }
}
check();
