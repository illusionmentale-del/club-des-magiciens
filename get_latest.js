const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkLatest() {
    console.log("--- Latest 5 Profiles ---");
    const { data: profiles } = await supabase.from('profiles').select('id, email, full_name, created_at').order('created_at', { ascending: false }).limit(5);
    console.log(profiles);

    console.log("\n--- Latest 5 Purchases ---");
    const { data: purchases } = await supabase.from('user_purchases').select('*').order('created_at', { ascending: false }).limit(5);
    console.log(purchases);
}
checkLatest();
