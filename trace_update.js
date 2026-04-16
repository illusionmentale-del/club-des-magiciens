import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
    const userId = "4346bc0f-9772-49bb-a366-3bd1f32d52df"; // Clémence
    
    // Simulating updateUserAccess logic
    const access_level = 'kid';
    const is_kid = true;
    
    console.log("Updating profile for:", userId);
    
    const { error } = await supabaseAdmin.from("profiles").update({ 
        access_level, 
        has_kids_access: is_kid,
        has_adults_access: !is_kid
    }).eq("id", userId);
    
    if (error) {
        console.error("DB ERROR: ", error);
    } else {
        console.log("SUCCESS!");
    }
}
run();
