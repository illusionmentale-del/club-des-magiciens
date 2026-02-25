import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkCols() {
    const cols = ['id', 'space', 'type', 'title', 'description', 'price', 'currency', 'stripe_price_id', 'metadata', 'is_active', 'image_url', 'link_url'];

    console.log("Checking columns on remote DB...");
    for (const col of cols) {
        const { error } = await supabase.from('products').select(col).limit(0);
        if (error) {
            console.log(`❌ Column missing: ${col}`);
        } else {
            console.log(`✅ Column exists: ${col}`);
        }
    }
}

checkCols();
