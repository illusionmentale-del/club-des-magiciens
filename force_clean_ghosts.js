import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
    const { data: ghosts, error: fetchErr } = await supabaseAdmin.from('profiles').select('id, email, deleted_at').not('deleted_at', 'is', null);
    if (!ghosts || ghosts.length === 0) {
        console.log("No soft-deleted users found.");
        return;
    }
    console.log(`Found ${ghosts.length} soft-deleted users. Testing hard auth deletion...`);
    
    // Test the first one
    const ghost = ghosts[0];
    console.log(`Trying to delete ghost from auth: ${ghost.email} (${ghost.id})`);
    
    const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(ghost.id);
    if (delError) {
        console.error("EXACT DB ERROR:", JSON.stringify(delError, null, 2));
    } else {
        console.log("Deleted successfully! The ghost was cleared.");
    }
}
run();
