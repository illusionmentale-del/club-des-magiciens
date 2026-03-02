const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function checkUserDependencies() {
    const userId = 'c24921c3-2a44-437c-8c28-abe82bd95a41';
    console.log(`Checking dependencies for user ${userId}...`);

    // Check profiles (Should be handled by ON DELETE CASCADE usually, but let's check)
    const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('id', userId);
    console.log(`Profiles: ${profile?.length || 0}`);

    // Check user_purchases
    const { data: purchases } = await supabaseAdmin.from('user_purchases').select('id').eq('user_id', userId);
    console.log(`Purchases: ${purchases?.length || 0}`);

    // Check newsletter_subscribers (if any)

    // Check live_messages
    const { data: messages } = await supabaseAdmin.from('live_messages').select('id').eq('user_id', userId);
    console.log(`Live Messages: ${messages?.length || 0}`);

    // Check comments (we have a comments table somewhere, maybe `comments` or `video_comments` ? Let's check `comments`)
    const { data: comments, error: cErr } = await supabaseAdmin.from('comments').select('id').eq('user_id', userId);
    if (cErr) console.log("Comments table error:", cErr.message);
    else console.log(`Comments: ${comments?.length || 0}`);

    // Check user_progress
    const { data: progress, error: pErr } = await supabaseAdmin.from('user_progress').select('id').eq('user_id', userId);
    if (pErr) console.log("User Progress table error:", pErr.message);
    else console.log(`User Progress: ${progress?.length || 0}`);

    // Check event_reminders
    const { data: reminders, error: rErr } = await supabaseAdmin.from('event_reminders').select('id').eq('user_id', userId);
    if (rErr) console.log("Event Reminders table error:", rErr.message);
    else console.log(`Event Reminders: ${reminders?.length || 0}`);

    // Check user_badges
    const { data: badges, error: bErr } = await supabaseAdmin.from('user_badges').select('id').eq('user_id', userId);
    if (bErr) console.log("User Badges table error:", bErr.message);
    else console.log(`User Badges: ${badges?.length || 0}`);
}

checkUserDependencies();
