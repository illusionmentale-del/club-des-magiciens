const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data, error } = await supabase.from('user_purchases').select('*').order('created_at', { ascending: false }).limit(5);
    console.log("Purchases:", data);
    if(error) console.log("Error:", error);
}
check();
