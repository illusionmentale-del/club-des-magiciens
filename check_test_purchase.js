const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log("Checking recent profiles (last 30 minutes)...");
  
  const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  
  const { data: profiles, error: profileErr } = await supabase
    .from('profiles')
    .select('id, email, created_at, access_level, has_adults_access, has_kids_access')
    .gte('created_at', thirtyMinsAgo)
    .order('created_at', { ascending: false });

  if (profileErr) {
    console.error("Error fetching profiles:", profileErr);
    return;
  }

  if (profiles && profiles.length > 0) {
    console.log(`Found ${profiles.length} new profile(s):`);
    for (const p of profiles) {
      console.log(`\n- Email: ${p.email}`);
      console.log(`  ID: ${p.id}`);
      console.log(`  Created: ${p.created_at}`);
      console.log(`  Access: Adults=${p.has_adults_access}, Kids=${p.has_kids_access}`);
      
      // Check purchases for this user
      const { data: purchases } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', p.id);
        
      console.log(`  Purchases logged: ${purchases ? purchases.length : 0}`);
    }
  } else {
    console.log("No new profiles found in the last 30 minutes.");
  }
}

check();
