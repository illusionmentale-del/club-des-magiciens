const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: profile } = await supabase.from('profiles').select('id, email').eq('email', 'jeremymarouani@gmail.com').single();
  if (profile) {
    const { data: purchases } = await supabase.from('user_purchases').select('*').eq('user_id', profile.id);
    console.log("Purchases for jeremymarouani@gmail.com:", purchases?.length);
    console.log(purchases?.[purchases.length - 1]); // the latest one
  }
}
check();
