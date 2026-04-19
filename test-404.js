const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data: user } = await supabaseAdmin.from('profiles').select('*').eq('full_name', 'Lisandro').single();
  // We don't have exact user ID, let's just search for the videos "anneaux" and "pastille"
  
  const { data: items } = await supabaseAdmin
    .from('library_items')
    .select('id, title, video_url')
    .or(`title.ilike.%anneau%,title.ilike.%pastille%`);
    
  console.log("=== Found Secret Videos in DB ===");
  console.log(items);

  // For each one, what would the param be?
  for (const item of items || []) {
      const paramId = item.id;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paramId);
      let query = supabaseAdmin.from('library_items').select('id, title, video_url');
      if (isUuid) {
        query = query.or(`video_url.eq.${paramId},id.eq.${paramId}`);
      } else {
        query = query.eq('video_url', paramId);
      }
      const { data: match, error } = await query.single();
      console.log(`Test for param ${paramId}:`, match ? "FOUND" : "NOT FOUND", error);
  }
}
test();
