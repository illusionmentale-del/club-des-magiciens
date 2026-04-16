import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const { data: progress } = await supabaseAdmin.from('library_progress').select('*').limit(1);
    if (progress && progress.length) console.log("library_progress columns:", Object.keys(progress[0]));
    
    const { data: videoProgress } = await supabaseAdmin.from('kids_video_progress').select('*').limit(1);
    if (videoProgress && videoProgress.length) console.log("kids_video_progress columns:", Object.keys(videoProgress[0]));
    else console.log("kids_video_progress table exists but maybe empty or doesn't exist");
}
run();
