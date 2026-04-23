import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    let allUsers = [];
    let page = 1;
    let hasMore = true;
    
    while(hasMore) {
        const { data: { users }, error } = await supabase.auth.admin.listUsers({ page: page, perPage: 100 });
        if (error) break;
        if (users.length === 0) {
            hasMore = false;
        } else {
            allUsers = allUsers.concat(users);
            page++;
        }
    }
    
    const targetUser = allUsers.find(u => u.email && u.email.includes("illusionmental"));
    if (targetUser) {
        console.log("Found target user:", targetUser.email, targetUser.id);
        
        // Check existing logs to avoid duplicate mega-boost
        const { data: logs } = await supabase.from('user_xp_logs').select('*').eq('user_id', targetUser.id).eq('action_type', 'admin_boost');
        if (logs && logs.length > 0) {
            console.log("Boost already applied");
        } else {
            const { error: logError } = await supabase
                .from('user_xp_logs')
                .insert({
                    user_id: targetUser.id,
                    xp_awarded: 1000000,
                    action_type: 'admin_boost',
                    reference_id: 'admin_boost_1M'
                });
                
            if (logError) {
                console.error("XP Log insert error:", logError);
            } else {
                console.log("XP Log inserted successfully: +1,000,000 XP");
            }
        }
    } else {
        console.log("Could not find illusionmental@gmail.com");
    }
}
run();
