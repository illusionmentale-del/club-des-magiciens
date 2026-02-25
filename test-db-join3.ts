import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// Create client without typing so it doesn't fail compilation
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: rawComments, error } = await supabase
        .from("course_comments")
        .select(`
            id,
            content,
            course_id,
            created_at,
            profiles (
                id,
                full_name,
                role,
                email
            )
        `)
        .eq("is_read", false)
        .order("created_at", { ascending: false });

  console.log("Raw Comments query result:", JSON.stringify(rawComments, null, 2));
  console.log("Error object:", JSON.stringify(error, null, 2));
}
test();
