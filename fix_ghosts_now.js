import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const targetEmails = [
    "x7qnr8vpmk@privaterelay.appleid.com",
    "66.titanesque_ainee@icloud.com",
    "minima02_emaux@icloud.com",
    "nruqy46vjm@privaterelay.appleid.com",
    "admin@atelierdesmagiciens.fr",
    "info@atelierdesmagiciens.fr",
    "boutique@atelierdesmagiciens.fr"
];

async function run() {
    console.log("Forcing soft-delete on existing ghost profiles...");
    const { data: ghosts } = await supabaseAdmin.from('profiles').select('id, email').in('email', targetEmails);
    
    for (const g of ghosts || []) {
        console.log("Soft deleting:", g.email);
        await supabaseAdmin.from('profiles').update({ deleted_at: new Date().toISOString() }).eq('id', g.id);
        
        // Also ensure auth is cleanly deleted just in case it wasn't
        await supabaseAdmin.auth.admin.deleteUser(g.id);
    }
    console.log("Done!");
}
run();
