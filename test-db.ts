import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from("course_comments")
    .select("id, content, course_id, is_read, user_id, created_at, kid_notified")
    .order("created_at", { ascending: false })
    .limit(5);

  console.log("Recent comments:", JSON.stringify(data, null, 2));
  console.log("Error:", error);
}
test();
