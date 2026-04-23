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
    
    console.log(`Found ${allUsers.length} total users.`);
    const targetUser = allUsers.find(u => u.email && u.email.includes("illusionmental"));
    if (targetUser) {
        console.log("Found target user:", targetUser.email, targetUser.id);
        
        // 2. Update XP to 1,000,000
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ xp: 1000000 })
            .eq('id', targetUser.id);
            
        if (profileError) {
            console.error("Profile update error:", profileError);
        } else {
            console.log("XP updated to 1,000,000");
        }
        
        // 3. Get all skins
        const { data: skins } = await supabase.from('avatar_skins').select('id');
        
        // 4. Unlock all skins
        const unlocks = skins.map(skin => ({
            user_id: targetUser.id,
            skin_id: skin.id
        }));
        
        const { error: unlockError } = await supabase
            .from('user_unlocked_skins')
            .upsert(unlocks, { onConflict: 'user_id, skin_id' });
            
        if (unlockError) {
            console.error("Unlock error:", unlockError);
        } else {
            console.log(`Unlocked ${skins.length} skins for user.`);
        }
    } else {
        console.log("Could not find illusionmental@gmail.com");
    }
}
run();
