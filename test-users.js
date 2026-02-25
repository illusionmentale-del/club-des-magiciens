const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) console.error(error);
  
  // Sort by created at descending
  const sorted = users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  console.log("LAST 5 USERS CREATED:");
  sorted.slice(0, 5).forEach(u => console.log(`Email: ${u.email} | Created: ${u.created_at} | ID: ${u.id} | Name: ${u.user_metadata?.full_name}`));

  const recent = sorted[0];
  if(recent) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', recent.id).single();
    console.log("\nLATEST PROFILE ENTRY:", profile);
  }
}
check();
