import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Users/jeremymarouani/Downloads/Club des Magiciens/club-des-magiciens/.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase.from('user_unlocked_skins').select('*').limit(1);
    console.log(error ? error : data);
}
run().catch(console.error);
