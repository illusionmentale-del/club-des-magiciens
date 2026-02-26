import { createClient } from "@/lib/supabase/server";
import { Sparkles } from "lucide-react";
import SettingsForm from "./SettingsForm";
import AdultHomeConfig from "./AdultHomeConfig";

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const { data: settings } = await supabase.from("settings").select("*");

    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    return (
        <div className="space-y-12">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-magic-gold/10 rounded-xl flex items-center justify-center border border-magic-gold/30">
                        <Sparkles className="w-6 h-6 text-magic-gold" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Réglages du Dashboard</h1>
                        <p className="text-slate-400 text-sm uppercase tracking-widest font-bold opacity-60">Personnalisez l'expérience client</p>
                    </div>
                </div>
            </div>

            <AdultHomeConfig initialSettings={settingsMap} />

            <div className="pt-8 border-t border-white/10 mt-12">
                <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Réglages Publics (Site vitrine)</h2>
                <SettingsForm settings={settingsMap} />
            </div>
        </div>
    );
}
