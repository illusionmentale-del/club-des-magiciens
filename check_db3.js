import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const { data: dbInfo, error } = await supabaseAdmin.from('kids_video_progress').select('*');
    if (error) console.log("Error finding table:", error.message);
    else if (dbInfo.length === 0) {
        // use postgres introspection 
        const { data: columns } = await supabaseAdmin.rpc('get_schema_info').catch(() => ({data: null}));
        if (!columns) {
            const { data: q } = await supabaseAdmin.from('kids_video_progress').insert({user_id: 'bad'}).select('*');
            console.log(q);
        }
    } else {
        console.log("columns:", Object.keys(dbInfo[0]));
    }
}
run();
