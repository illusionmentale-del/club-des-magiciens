import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    // 1. Get all users
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error("Auth error:", authError);
        return;
    }
    
    const user = users.find(u => u.email && u.email.includes("illusionmental"));
    if (!user) {
        console.log("All emails:");
        console.log(users.map(u => u.email));
        return;
    }
    
    console.log("Found user ID:", user.id);
    
    // 2. Update XP to 1,000,000
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ xp: 1000000 })
        .eq('id', user.id);
        
    if (profileError) {
        console.error("Profile update error:", profileError);
    } else {
        console.log("XP updated to 1,000,000");
    }
    
    // 3. Get all skins
    const { data: skins } = await supabase.from('avatar_skins').select('id');
    
    // 4. Unlock all skins
    const unlocks = skins.map(skin => ({
        user_id: user.id,
        skin_id: skin.id
    }));
    
    // Upsert or insert ignore (insert with on conflict)
    const { error: unlockError } = await supabase
        .from('user_unlocked_skins')
        .upsert(unlocks, { onConflict: 'user_id, skin_id' });
        
    if (unlockError) {
        console.error("Unlock error:", unlockError);
    } else {
        console.log(`Unlocked ${skins.length} skins for user.`);
    }
}
run();
