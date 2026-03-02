import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function fixImportedUsers() {
    console.log("Fixing access_level for ALL imported kids profiles...");

    try {
        const { data: profilesToFix, error: fetchErr } = await supabaseAdmin
            .from('profiles')
            .select('id, access_level, has_kids_access')
            .eq('has_kids_access', true);

        if (fetchErr) throw fetchErr;

        console.log(`Found ${profilesToFix.length} profiles with kids access.`);

        let fixed = 0;
        for (const p of profilesToFix) {
            // Force access_level to 'kid' if it's explicitly 'kid'
            if (p.access_level !== 'kid') {
                const { error: updateErr } = await supabaseAdmin
                    .from('profiles')
                    .update({ access_level: 'kid' })
                    .eq('id', p.id);

                if (!updateErr) {
                    fixed++;
                } else {
                    console.error(`Failed to update profile ${p.id}:`, updateErr);
                }
            }
        }

        console.log(`Successfully fixed ${fixed} profiles (set access_level to 'kid').`);

    } catch (e) {
        console.error("Error during fix:", e);
    }
}

fixImportedUsers();
