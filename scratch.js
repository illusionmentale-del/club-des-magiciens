const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('legal_pages').select('slug, content').eq('slug', 'mentions-legales').single();
  if (error) { console.error(error); return; }
  console.log(data.content);
}
check();
