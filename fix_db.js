const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fix() {
  await supabase.from('library_items').update({ video_url: 'https://player.mediadelivery.net/play/631687/4ffb5798-7e2d-4c1c-8437-fb0546310468' }).eq('title', 'La Pastille Voyageuse');
  console.log("Restored full URL so auto-detect can work");
}
fix();
