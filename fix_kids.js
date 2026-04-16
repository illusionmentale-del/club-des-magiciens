import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const emails = [
    'idierstephanie@gmail.com', // Clémence
    'ragot.cindy25@gmail.com',  // Mahonn
    'celine.boree@orange.fr',   // Nolan
    'anais.duval24@sfr.fr',     // Linoa
    'cissouherve@gmail.com'     // Lisandro
];

async function run() {
    console.log("Fixing access_level for kids...");
    const { error } = await supabaseAdmin.from('profiles').update({
        access_level: 'kid',
        has_kids_access: true,
        has_adults_access: false
    }).in('email', emails);
    
    if (error) console.error("Error:", error);
    else console.log("Success updating 5 users to kids!");
}
run();
