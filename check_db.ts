import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function main() {
    const { data: cols, error: colError } = await supabase.from('products').select('*').limit(0);
    console.log("Error querying products:", colError);
    if (!colError) {
        console.log("No error, so table config is valid for a generic select.");
    }
}
main();
