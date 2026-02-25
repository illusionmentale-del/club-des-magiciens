import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data: kidsProfiles, error } = await supabase
        .from("profiles")
        .select("email, role")
        .eq("role", "kid")
        .not("email", "is", null);

    console.log("Error:", error);
    console.log("Kids Profiles found:", kidsProfiles?.length);
    console.log("Sample:", JSON.stringify(kidsProfiles?.slice(0, 3) || [], null, 2));

    if (kidsProfiles && kidsProfiles.length > 0) {
        const bccList = kidsProfiles.map(p => p.email).filter(Boolean) as string[];
        console.log("BCC List length:", bccList.length);
    }
}
test();
