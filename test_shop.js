const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data } = await supabase
      .from('library_items')
      .select('title, sales_page_url')
      .eq('audience', 'kids')
      .not('sales_page_url', 'is', null);
  console.log("Items in Shop:", data);
}
check();
