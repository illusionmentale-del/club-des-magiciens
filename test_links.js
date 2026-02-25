require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function getLinks() {
  const { data: admins } = await supabaseAdmin.from('profiles').select('id').eq('role', 'admin').limit(1);
  const { data: kids } = await supabaseAdmin.from('profiles').select('id').eq('access_level', 'kid').limit(1);
  
  const adminId = admins[0].id;
  const kidId = kids[0].id;
  
  const { data: adminUser } = await supabaseAdmin.auth.admin.getUserById(adminId);
  const { data: kidUser } = await supabaseAdmin.auth.admin.getUserById(kidId);
  
  const { data: adminLink } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: adminUser.user.email
  });
  
  const { data: kidLink } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: kidUser.user.email
  });
  
  console.log("Admin Link:", adminLink.properties.action_link);
  console.log("Kid Link:", kidLink.properties.action_link);
  
  // Also get the active live ID
  const { data: live } = await supabaseAdmin.from('lives').select('id').eq('status', 'en_cours').limit(1);
  if (live && live.length > 0) {
      console.log("Active Live ID:", live[0].id);
  } else {
      console.log("No active live found.");
  }
}
getLinks();
