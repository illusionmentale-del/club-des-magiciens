import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
    const { data: users } = await supabase
        .from('profiles')
        .select('email, role, access_level, has_kids_access')
        .eq('access_level', 'kid')
        .order('created_at', { ascending: false })
        .limit(10);
        
    console.log("Les 10 derniers inscrits (access_level='kid') :");
    console.table(users);
}
check();
