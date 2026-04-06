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
  const videoId = data.video_url;
  
  // Try Kids Library
  const resKids = await fetch(`https://video.bunnycdn.com/library/603266/videos/${videoId}`, {
      headers: { "AccessKey": process.env.BUNNY_KIDS_API_KEY, "Accept": "application/json" }
  });
  console.log("Kids Library 603266 Match:", resKids.status === 200);

  // Try Generic/Boutique Library if he has keys for it? I don't have its AccessKey...
  // Try Adults Library just in case
  const resAdults = await fetch(`https://video.bunnycdn.com/library/603289/videos/${videoId}`, {
      headers: { "AccessKey": process.env.BUNNY_ADULTS_API_KEY, "Accept": "application/json" }
  });
  console.log("Adults Library 603289 Match:", resAdults.status === 200);
}

check();
