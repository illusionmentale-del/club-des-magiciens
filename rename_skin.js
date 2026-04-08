require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from("avatar_skins")
    .update({ name: "Apprenti (1ère année)" })
    .eq("name", "Élève Normal");
  console.log("Updated avatar_skins", data, error);
}
run();
