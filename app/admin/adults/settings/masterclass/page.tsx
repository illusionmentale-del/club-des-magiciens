import { createClient } from "@/lib/supabase/server";
import { Sparkles } from "lucide-react";
import AdultMasterclassConfig from "./AdultMasterclassConfig";

export default async function AdultMasterclassSettingsPage() {
    const supabase = await createClient();

    // 1. Fetch current settings
    const { data: settings } = await supabase.from("settings").select("*");
    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    // 2. Fetch all adult library items for the selectors
    const { data: libraryItems } = await supabase
        .from("library_items")
        .select("id, title, thumbnail_url")
        .eq("audience", "adults")
        .order("title");

    // 3. Fetch courses for the Hub Formations
    const { data: courses } = await supabase
        .from("courses")
        .select("id, title, status")
        .eq("audience", "adults")
        .order("title");

    return (
        <div className="space-y-10 selection:bg-white/30">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#1c1c1e] rounded-xl flex items-center justify-center border border-white/5 shadow-md">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Page Mes Formations</h1>
                        <p className="text-[#86868b] text-sm uppercase tracking-widest font-bold opacity-60">Personnalisez la page globale des formations adultes</p>
                    </div>
                </div>
            </div>

            <AdultMasterclassConfig
                initialSettings={settingsMap}
                libraryItems={libraryItems || []}
                courses={courses || []}
            />
        </div>
    )
}
