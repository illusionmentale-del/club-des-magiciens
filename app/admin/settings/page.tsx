import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const { data: settings } = await supabase.from("settings").select("*");

    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    return <SettingsForm settings={settingsMap} />;
}
