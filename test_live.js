require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function createLive() {
  const { data: liveData } = await supabaseAdmin.from('lives').insert({
      title: 'Test Live Technique',
      status: 'en_cours',
      platform_id: 'TestTechRoom123',
      platform: 'jitsi',
      audience: 'adults'
  }).select().single();
  console.log("Created Live ID:", liveData.id);
}
createLive();
