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

    return (
        <div className="space-y-10 selection:bg-brand-royal/30">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-brand-royal/10 rounded-xl flex items-center justify-center border border-brand-royal/20">
                        <Sparkles className="w-6 h-6 text-brand-royal" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Paramètres Les Ateliers</h1>
                        <p className="text-brand-text-muted text-sm uppercase tracking-widest font-bold opacity-60">Personnalisez la page globale des Ateliers adulte</p>
                    </div>
                </div>
            </div>

            <AdultMasterclassConfig
                initialSettings={settingsMap}
                libraryItems={libraryItems || []}
            />
        </div>
    )
}
