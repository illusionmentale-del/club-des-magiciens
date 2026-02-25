const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const email = "jeremymarouani@gmail.com";
  console.log(`Testing link generation for ${email}...`);
  
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
          redirectTo: `https://clubdespetitsmagiciens.fr/dashboard`
      }
  });
  
  if (linkError) {
    console.error("Link Error:", linkError);
  } else {
    console.log("Link Data:", linkData);
  }
}
check();
