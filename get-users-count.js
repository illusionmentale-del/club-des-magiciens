require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function getUsers() {
    const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    console.log("Total users:", count);
}
getUsers();
