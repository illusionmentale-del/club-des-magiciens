const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data: profiles, error } = await supabase.from('profiles').select('id, username, email, role, is_kid, access_level, created_at');
    if (error) {
        console.error(error);
        return;
    }
    console.log("ALL PROFILES:");
    profiles.forEach(p => console.dir(p));
}
main();
