const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey
            },
            body: JSON.stringify({
                query: 'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url_kids text;'
            })
        });
        const text = await response.text();
        console.log('Result:', text);
        
        // Also ensure schema cache is refreshed in case Supabase is stubborn
        const reloadResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey
            },
            body: JSON.stringify({
                query: 'NOTIFY pgrst, "reload schema";'
            })
        });
        console.log('Reload Result:', await reloadResponse.text());
        
    } catch(e) { console.error(e) }
}
run();
