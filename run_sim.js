import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Resend } from 'resend';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
    const userId = "b77cfe9c-ff52-477f-b423-062861538b0c"; // We know this dummy is in DB still
    
    console.log("Cleaning known tables...");
    await supabaseAdmin.from('push_subscriptions').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_xp_logs').delete().eq('user_id', userId);
    await supabaseAdmin.from('unlocked_skins').delete().eq('user_id', userId);
    await supabaseAdmin.from('purchases').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_badges').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_progress').delete().eq('user_id', userId);
    await supabaseAdmin.from('kids_video_progress').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_library_progress').delete().eq('user_id', userId);
    await supabaseAdmin.from('course_likes').delete().eq('user_id', userId);
    await supabaseAdmin.from('course_comments').delete().eq('user_id', userId);
    await supabaseAdmin.from('event_reminders').delete().eq('user_id', userId);
    await supabaseAdmin.from('kids_analytics').delete().eq('user_id', userId);
    
    // Explicitly deleting from profiles
    const { error: profileDelError } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
    if (profileDelError) console.error("Profile Del Error:", profileDelError);
    
    console.log("Calling Auth Admin Delete...");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
        console.error("Auth Delete ERROR:", error);
    } else {
        console.log("Auth Delete SUCCESS");
    }
}
run();
