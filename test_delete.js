import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
    // get a test user, e.g. email containing "test"
    const { data: users, error: uErr } = await supabaseAdmin.from('profiles').select('*').ilike('email', '%test%');
    console.log("Found test users:", users?.length);
    if (!users || users.length === 0) return;
    
    const userId = users[0].id;
    console.log("Trying to delete user:", users[0].email, "ID:", userId);

    // 1. Delete dependent
    console.log("Deleting dependents...");
    await supabaseAdmin.from('push_subscriptions').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_xp_logs').delete().eq('user_id', userId);
    await supabaseAdmin.from('unlocked_skins').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_achievements').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_video_progress').delete().eq('user_id', userId);
    await supabaseAdmin.from('purchases').delete().eq('user_id', userId);

    const { error: profileDelError } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
    if (profileDelError) {
        console.error("Profile Delete Error:", profileDelError);
    } else {
        console.log("Profile explicitly deleted!");
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
        console.error("Auth Admin Delete Error:", error);
    } else {
        console.log("User successfully deleted from auth!");
    }
}
run();
