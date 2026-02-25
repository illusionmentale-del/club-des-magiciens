const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: profile } = await supabase.from('profiles').select('*').eq('email', 'jeremymarouani@gmail.com').single();
  console.log("Profile jeremymarouani@gmail.com role:", profile.role, "access_level:", profile.access_level, "deleted_at:", profile.deleted_at);

  const { data: profile2 } = await supabase.from('profiles').select('*').eq('email', 'illusionmentale@gmail.com').single();
  console.log("Profile illusionmentale role:", profile2.role, "access_level:", profile2.access_level, "deleted_at:", profile2.deleted_at);
}
check();
