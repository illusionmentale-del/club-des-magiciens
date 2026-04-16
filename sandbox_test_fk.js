import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
    const email = "testing_delete_fk_" + Date.now() + "@example.com";
    
    console.log("Creating user:", email);
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: "Password123!",
        email_confirm: true,
        user_metadata: { full_name: "Test User" }
    });
    
    if (createError) {
        console.error("Create User Error:", createError);
        return;
    }
    
    const userId = newUser.user.id;
    console.log("User created with ID:", userId);
    
    // Profiles row is created automatically by a trigger. Let's wait a sec for it.
    await new Promise(r => setTimeout(r, 2000));
    
    // Now let's try to delete just via Auth Admin and see the FK violation!
    console.log("Attempting to delete via Auth Admin WITHOUT cleaning dependents...");
    const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (delError) {
        console.error("Auth Admin Delete Error:", JSON.stringify(delError, null, 2));
    } else {
        console.log("Success deleting directly!");
    }
}
run();
