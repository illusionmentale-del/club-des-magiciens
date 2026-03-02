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

async function checkImportedUsers() {
    console.log("Checking recently created users in Auth & Profiles tables...");

    try {
        // 1. Get 10 most recent Auth users
        console.log("\n--- Top 10 Most Recent Auth Users ---");
        const { data: { users }, error: authAuthError } = await supabaseAdmin.auth.admin.listUsers();
        if (authAuthError) throw authAuthError;

        const recentAuthUsers = users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

        recentAuthUsers.forEach(u => {
            console.log(`- ${u.email} (ID: ${u.id}) - Created At: ${new Date(u.created_at).toLocaleString()}`);
        });

        console.log("\n--- Validating corresponding Profiles ---");
        // 2. See if these precise users are in the profiles table and have has_kids_access
        for (const u of recentAuthUsers) {
            const { data: profile, error: profileErr } = await supabaseAdmin
                .from('profiles')
                .select('*')
                .eq('id', u.id)
                .single();

            if (profileErr) {
                console.log(`- Profile MISSING for user ${u.email}`);
            } else {
                console.log(`- Profile FOUND for ${u.email}: has_kids_access=${profile.has_kids_access}, name=${profile.full_name}`);
            }
        }

    } catch (e) {
        console.error("Error during check:", e);
    }
}

checkImportedUsers();

