const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const email = 'cnftwm2thf@privaterelay.appleid.com';
    console.log(`Checking email: ${email}`);

    // Check Profile
    const { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
    console.log("Profile:", profile ? profile.id : (pErr ? pErr.message : "Not found"));

    if (profile) {
        // Check Purchases
        const { data: purchases, error: puErr } = await supabase.from('user_purchases').select('*').eq('user_id', profile.id);
        console.log("Purchases:", purchases?.length || 0, "found.");
    }

    // Check Auth Users
    const { data: { users }, error: uErr } = await supabase.auth.admin.listUsers();
    if (users) {
        const found = users.find(u => u.email === email);
        console.log("Auth user found:", found ? "Yes, ID: " + found.id : "No");
    }
}
check();
