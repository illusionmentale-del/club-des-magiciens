import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProgramLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: setting } = await supabase.from("settings").select("value").eq("key", "enable_kids_program").single();

    // If setting exists and is explicitly "false", block access
    if (setting && setting.value === "false") {
        redirect("/kids");
    }

    return <>{children}</>;
}
