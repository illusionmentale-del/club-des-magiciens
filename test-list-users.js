const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  console.log("Total users fetched by default:", users.length);
  const foundUser = users.find(u => u.email === 'jeremymarouani@gmail.com');
  console.log("Did it find jeremymarouani@gmail.com?", foundUser ? 'YES' : 'NO');
  const foundUser2 = users.find(u => u.email === 'illusionmentale@gmail.com');
  console.log("Did it find illusionmentale@gmail.com?", foundUser2 ? 'YES' : 'NO');
}
check();
