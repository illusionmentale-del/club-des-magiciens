import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const { data: prog } = await supabaseAdmin.from('kids_video_progress').select('*').order('updated_at', { ascending: false }).limit(2);
    console.log(prog);
}
run();
