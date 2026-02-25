import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MagicCard from "@/components/MagicCard";
import AccountForm from "@/app/dashboard/account/AccountForm"; // Reusing form for settings
import { Settings, Trophy, Shield, Star } from "lucide-react";

export default async function KidsAccountPage({
    searchParams,
}: {
    searchParams: Promise<{ view?: string }>;
}) {
    const sParams = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const isSettingsView = sParams.view === 'settings';

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans selection:bg-brand-purple/30 overflow-hidden relative">

            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-brand-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Mes <span className="text-brand-purple">Informations</span>
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            {isSettingsView
                                ? "Gère tes informations personnelles et tes préférences."
                                : "Voici ta carte de magicien officiel. Montre tes progrès !"}
                        </p>
                    </div>
                </header>

                <div className="relative z-10 w-full">
                    {isSettingsView ? (
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-0 blur-lg group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
                            <div className="relative bg-brand-card border border-brand-border rounded-3xl p-6 md:p-8 shadow-2xl">
                                <div className="max-w-xl mx-auto">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-brand-blue" />
                                        Informations Personnelles
                                    </h2>
                                    <AccountForm user={user} profile={profile} theme="dark" isKidProfile={true} />

                                    {/* Additional settings could go here (e.g. Subscription status) */}
                                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                                        <p className="text-xs text-brand-text-muted">
                                            Membre du Club depuis le {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <MagicCard user={user} profile={profile} isKid={true} />
                    )}
                </div>
            </div>
        </div>
    );
}
