import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MagicCard from "@/components/MagicCard";
import AccountForm from "@/app/dashboard/account/AccountForm"; // Reusing form for settings
import { Settings, Trophy, Shield, Star, Bell, ShoppingBag } from "lucide-react";
import BackButton from "@/components/BackButton";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import KidsIdentityForm from "@/components/kids/KidsIdentityForm";

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
        .select("*, avatar_skins(image_url)")
        .eq("id", user.id)
        .single();

    const isSettingsView = sParams.view === 'settings';

    // Calculate Lifetime XP (Total accumulated positive XP for the Rank logic)
    let lifetimeXP = profile?.xp || 0;
    try {
        const { data: xpLogs } = await supabase.from('user_xp_logs').select('xp_awarded').eq('user_id', user.id);
        if (xpLogs) {
            // Lifetime XP never goes down
            lifetimeXP = xpLogs.reduce((acc, log) => acc + (log.xp_awarded > 0 ? log.xp_awarded : 0), 0);
        }
    } catch (e) {
        console.error("Could not fetch lifetime XP", e);
    }

    // Enforce gamification base avatar, completely ignore 'avatar_url_kids'
    let computedAvatarUrl = "/avatars/avatar_base_student.png";
    if (profile?.equipped_skin_id && profile?.avatar_skins?.image_url) {
        computedAvatarUrl = profile.avatar_skins.image_url;
    }

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
                        <div className="mb-4">
                            <BackButton className="md:hidden" />
                        </div>
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-brand-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            {isSettingsView ? "Mes " : "Ma "}
                            <span className="text-brand-purple">
                                {isSettingsView ? "Paramètres" : "Carte d'Apprenti"}
                            </span>
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            {isSettingsView
                                ? "Gère tes informations personnelles et tes préférences."
                                : "Voici ta carte de magicien officiel. Montre tes progrès !"}
                        </p>
                    </div>

                    {!isSettingsView && (
                        <div className="mt-4 md:mt-0 w-full md:w-auto">
                            <a 
                                href="/kids/achievements" 
                                className="flex items-center justify-center md:justify-start gap-2 px-6 py-3 bg-brand-purple/20 border border-brand-purple/50 text-brand-purple font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] rounded-xl hover:bg-brand-purple hover:text-white transition-all duration-300 text-sm uppercase tracking-widest hover:scale-105 active:scale-95"
                            >
                                <Trophy className="w-5 h-5" />
                                Salle des Trophées
                            </a>
                        </div>
                    )}
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

                                    {/* Section Notifications */}
                                    <div className="mt-12 space-y-6">
                                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-brand-blue" />
                                            Préférences de Communication
                                        </h2>
                                        <NotificationPreferences profile={profile} />
                                    </div>

                                    {/* Additional settings could go here (e.g. Subscription status) */}
                                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                                        <p className="text-xs text-brand-text-muted">
                                            Membre du Club depuis le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <MagicCard user={user} profile={profile} isKid={true} lifetimeXP={lifetimeXP} avatarUrl={computedAvatarUrl} />
                            
                            {/* Solde et Bouton pour dépenser */}
                            <div className="mt-8 mb-4 w-full max-w-[400px] flex flex-col items-center">
                                <p className="mb-3 text-sm font-bold text-brand-gold animate-in fade-in zoom-in duration-500">
                                    Solde actuel : <span className="text-lg text-white">{profile?.xp || 0}</span> Poussières d'étoiles 🌟
                                </p>
                                <a 
                                    href="/kids/shop"
                                    className="w-full px-4 py-4 bg-gradient-to-r from-brand-gold to-yellow-500 hover:scale-[1.02] text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(250,204,21,0.4)] flex justify-center items-center gap-3 text-center"
                                >
                                    <ShoppingBag className="w-5 h-5 shrink-0" />
                                    <span>Dépenser mes Poussières d'étoiles</span>
                                </a>
                            </div>

                            <KidsIdentityForm profile={profile} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
