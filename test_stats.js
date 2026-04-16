require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const { data: items } = await supabase.from('library_items').select('week_number, type').eq('audience', 'kids');
    
    const { data: skins } = await supabase.from('avatar_skins').select('price_xp');
    
    // Count items per week
    const weeks = {};
    items.forEach(i => {
        weeks[i.week_number] = (weeks[i.week_number] || 0) + 1;
    });

    console.log("Items per week:", Object.keys(weeks).length, "weeks total");
    console.log(weeks);

    console.log("Skins prices:", skins.map(s => s.price_xp));

}
run();
