const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
      .from('library_items')
      .select('title, video_url')
      .eq('public_slug', 'lapastillevoyageuse')
      .single();
  
  if (error || !data) {
      console.log("DB Error or not found:", error);
      return;
  }
  
  console.log("DB Trick Info:", data);
}
check();
