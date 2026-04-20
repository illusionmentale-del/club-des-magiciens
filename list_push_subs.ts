import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: subs } = await supabase.from('push_subscriptions').select('user_id, platform');
  
  if (!subs || subs.length === 0) {
    console.log("No subscriptions found.");
    return;
  }

  const uniqueUserIds = [...new Set(subs.map(s => s.user_id))];
  
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, email, role').in('id', uniqueUserIds);
  
  console.log(`Total unique subscriptions: ${subs.length}`);
  console.log(`Total unique users: ${uniqueUserIds.length}`);
  
  const matched = subs.map(s => {
    const p = profiles?.find(pr => pr.id === s.user_id);
    return {
      name: p ? p.full_name : 'Unknown',
      email: p ? p.email : 'Unknown',
      role: p ? p.role : 'Unknown',
      platform: s.platform
    };
  });
  
  console.table(matched);
}

check();
