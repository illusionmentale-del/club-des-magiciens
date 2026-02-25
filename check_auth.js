const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if(users) {
        const found = users.find(u => u.email === 'encodeur-chrome-4r@icloud.com');
        console.log("Auth user found:", found ? "Yes" : "No");
    }
}
check();
