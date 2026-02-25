import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    console.log("Data:", data, "Error:", error);
}
run();
