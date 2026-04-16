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
    console.log("Fetching matching users from Supabase Auth & Profiles...");
    
    // Auth users
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
        console.error("Failed to list users:", authError);
        return;
    }
    
    const usersToDelete = users.filter(u => targetEmails.includes(u.email));
    console.log(`Found ${usersToDelete.length} auth users matching the emails.`);
    
    for (const user of usersToDelete) {
        const userId = user.id;
        console.log(`\nProcessing Auth User: ${user.email} (${userId})`);
        
        // Wipe dependencies
        await supabaseAdmin.from('push_subscriptions').delete().eq('user_id', userId);
        await supabaseAdmin.from('user_xp_logs').delete().eq('user_id', userId);
        await supabaseAdmin.from('unlocked_skins').delete().eq('user_id', userId);
        await supabaseAdmin.from('purchases').delete().eq('user_id', userId);
        await supabaseAdmin.from('user_purchases').delete().eq('user_id', userId);
        await supabaseAdmin.from('subscriptions').delete().eq('user_id', userId);
        await supabaseAdmin.from('user_badges').delete().eq('user_id', userId);
        await supabaseAdmin.from('user_progress').delete().eq('user_id', userId);
        await supabaseAdmin.from('kids_video_progress').delete().eq('user_id', userId);
        await supabaseAdmin.from('user_library_progress').delete().eq('user_id', userId);
        await supabaseAdmin.from('course_likes').delete().eq('user_id', userId);
        await supabaseAdmin.from('course_comments').delete().eq('user_id', userId);
        await supabaseAdmin.from('event_reminders').delete().eq('user_id', userId);
        await supabaseAdmin.from('kids_analytics').delete().eq('user_id', userId);
        await supabaseAdmin.from('live_messages').delete().eq('user_id', userId);
        
        // Wipe Profile
        const { error: profileDelError } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
        if (profileDelError) console.error("Profile deletion failed:", profileDelError);
        
        // Delete Auth
        const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (delError) {
            console.error("Auth Admin Delete Error for", user.email, ":", JSON.stringify(delError, null, 2));
        } else {
            console.log("Successfully deleted auth user:", user.email);
        }
    }
    
    // Also check for orphaned profiles!
    const { data: orphanedProfiles } = await supabaseAdmin.from('profiles').select('id, email').in('email', targetEmails);
    const orphans = orphanedProfiles || [];
    console.log(`\nFound ${orphans.length} matching profiles (some may be soft-deleted ghosts).`);
    
    for (const p of orphans) {
        console.log(`Checking ghost profile: ${p.email} (${p.id})`);
        // If it was already deleted from Auth, let's just make sure dependents are wiped
        await supabaseAdmin.from('push_subscriptions').delete().eq('user_id', p.id);
        await supabaseAdmin.from('user_xp_logs').delete().eq('user_id', p.id);
        await supabaseAdmin.from('unlocked_skins').delete().eq('user_id', p.id);
        await supabaseAdmin.from('purchases').delete().eq('user_id', p.id);
        await supabaseAdmin.from('user_badges').delete().eq('user_id', p.id);
        await supabaseAdmin.from('user_progress').delete().eq('user_id', p.id);
        await supabaseAdmin.from('kids_video_progress').delete().eq('user_id', p.id);
        const { error: pDelError } = await supabaseAdmin.from('profiles').delete().eq('id', p.id);
        if (pDelError) console.error("Could not delete orphan profile:", pDelError);
        else console.log("Profile explicitly requested to delete (might just soft delete).");
    }
}
run();
