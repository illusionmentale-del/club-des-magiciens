import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    const { data: item } = await supabase
        .from('library_items')
        .select('*')
        .ilike('title', '%pastille%');
        
    console.log(JSON.stringify(item, null, 2));
}

check();
