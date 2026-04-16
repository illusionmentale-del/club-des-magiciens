import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

async function run() {
    const userId = "0995a582-fc53-4ea6-a241-9c8f1fffca67";
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    console.log("User Fetch:", userError ? userError : user?.user?.email);
    
    if (user && user.user && user.user.email) {
        try {
            const { data, error } = await supabaseAdmin.auth.admin.generateLink({
                type: 'magiclink',
                email: user.user.email,
                options: {
                    redirectTo: 'https://club-des-magiciens.vercel.app/kids/dashboard'
                }
            });
            console.log("Link Result:", data?.properties?.action_link, "Error:", error);
        } catch (e) {
            console.error("Link Crash:", e);
        }
    }
}
run();
