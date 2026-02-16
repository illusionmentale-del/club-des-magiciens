import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MagicCard from "@/components/MagicCard";
import MagicParticles from "@/components/MagicParticles";
import AccountForm from "@/app/dashboard/account/AccountForm"; // Reusing form for settings
import { Settings, Trophy, Shield } from "lucide-react";

export default async function KidsAccountPage({
    searchParams,
}: {
    searchParams: { view?: string };
}) {
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

    const isSettingsView = searchParams.view === 'settings';

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans selection:bg-brand-purple/30 overflow-hidden relative">

            {/* Ambient Background Lights */}
            <div className={`absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] ${isSettingsView ? 'bg-brand-blue/10' : 'bg-brand-purple/10'} blur-[150px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000`}></div>

            {/* Header / Hero */}
            <header className="mb-12 max-w-7xl mx-auto relative z-10 pt-4 md:pt-8 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-brand-text-muted text-xs font-bold uppercase tracking-widest mb-4">
                    {isSettingsView ? <Settings className="w-4 h-4" /> : <Trophy className="w-4 h-4 text-brand-purple" />}
                    {isSettingsView ? "Paramètres" : "Mon Parcours"}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-2">
                    {isSettingsView ? "Mon Compte" : "Identité Secrète"}
                </h1>
                <p className="text-lg text-brand-text-muted font-light max-w-2xl mx-auto md:mx-0">
                    {isSettingsView
                        ? "Gère tes informations personnelles et tes préférences."
                        : "Voici ta carte de magicien officiel. Montre tes progrès !"}
                </p>
            </header>

            <div className="relative z-10 w-full max-w-4xl mx-auto">
                {isSettingsView ? (
                    <div className="bg-brand-card border border-brand-border rounded-3xl p-6 md:p-8 shadow-2xl">
                        <div className="max-w-xl mx-auto">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-brand-blue" />
                                Informations Personnelles
                            </h2>
                            <AccountForm user={user} profile={profile} theme="dark" />

                            {/* Additional settings could go here (e.g. Subscription status) */}
                            <div className="mt-8 pt-8 border-t border-white/10 text-center">
                                <p className="text-xs text-brand-text-muted">
                                    Membre du Club depuis le {new Date(user.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <MagicCard user={user} profile={profile} isKid={true} />
                )}
            </div>
        </div>
    );
}
