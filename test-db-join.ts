import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: comments, error: commentsError } = await supabase
    .from("course_comments")
    .select("id, user_id, content, is_read, course_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (comments && comments.length > 0) {
      const userIds = comments.map(c => c.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, role, email, full_name")
        .in("id", userIds);
        
      const merged = comments.map(c => ({
          ...c,
          profiles: profiles?.find(p => p.id === c.user_id)
      }));
      console.log("Joined manually:", JSON.stringify(merged, null, 2));
  } else {
      console.log("No comments found.");
  }
}
test();
