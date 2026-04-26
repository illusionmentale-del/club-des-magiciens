import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MagicCard from "@/components/MagicCard";
import AccountForm from "@/app/dashboard/account/AccountForm"; // Reusing form for settings
import { Settings, Trophy, Shield, Star, Bell, ShoppingBag } from "lucide-react";
import BackButton from "@/components/BackButton";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import KidsIdentityForm from "@/components/kids/KidsIdentityForm";
import QuickSkinSelector from "@/components/kids/QuickSkinSelector";
import { FadeInUp } from "@/components/adults/MotionWrapper";

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

    // Fetch unlocked skins for the Quick Selector
    const { data: unlockedSkinsData } = await supabase
        .from("user_unlocked_skins")
        .select("skin_id")
        .eq("user_id", user.id);
    const unlockedSkinIds = unlockedSkinsData?.map(s => s.skin_id) || [];

    const { data: skins } = await supabase.from("avatar_skins").select("*");
    const availableSkins = skins?.filter(s => s.is_default || unlockedSkinIds.includes(s.id)) || [];

    return (
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 pb-32 font-sans selection:bg-brand-purple/30 overflow-hidden relative">

            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-0 left-0 w-full md:w-1/2 h-[50vh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/10 via-[#000000]/0 to-[#000000]/0 pointer-events-none z-0"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <FadeInUp delay={0.1}>
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                        <div className="flex-1">
                            <div className="mb-6">
                                <BackButton className="md:hidden" />
                            </div>
                            <div className="flex items-center gap-2 text-brand-purple mb-2">
                                <Star className="w-5 h-5 fill-current animate-pulse text-brand-purple" />
                                <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
                                {isSettingsView ? "Mes " : "Ma "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-indigo-500">
                                    {isSettingsView ? "Paramètres" : "Carte d'Apprenti"}
                                </span>
                            </h1>
                            <p className="text-[#86868b] mt-3 text-lg md:text-xl font-light">
                                {isSettingsView
                                    ? "Gère tes informations personnelles et tes préférences."
                                    : "Voici ta carte de magicien officiel. Montre tes progrès !"}
                            </p>
                        </div>

                        {!isSettingsView && (
                            <div className="mt-6 md:mt-0 w-full md:w-auto">
                                <a 
                                    href="/kids/achievements" 
                                    className="flex items-center justify-center md:justify-start gap-3 px-8 py-4 bg-[#1c1c1e] border border-brand-purple/50 text-white font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] rounded-full hover:bg-brand-purple transition-all duration-300 text-sm uppercase tracking-widest hover:scale-105 active:scale-95"
                                >
                                    <Trophy className="w-5 h-5 text-brand-purple" />
                                    Salle des Trophées
                                </a>
                            </div>
                        )}
                    </header>
                </FadeInUp>

                <FadeInUp delay={0.2}>
                    <div className="relative z-10 w-full">
                        {isSettingsView ? (
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-[32px] opacity-0 blur-xl group-hover:opacity-20 transition duration-1000 pointer-events-none"></div>
                                <div className="relative bg-[#1c1c1e] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-xl">
                                    <div className="max-w-xl mx-auto">
                                        <h2 className="text-xl font-semibold text-[#f5f5f7] mb-8 flex items-center gap-3">
                                            <Shield className="w-6 h-6 text-brand-blue" />
                                            Informations Personnelles
                                        </h2>
                                        <AccountForm user={user} profile={profile} theme="dark" isKidProfile={true} />

                                        {/* Section Notifications */}
                                        <div className="mt-16 space-y-8">
                                            <h2 className="text-xl font-semibold text-[#f5f5f7] mb-4 flex items-center gap-3">
                                                <Bell className="w-6 h-6 text-brand-blue" />
                                                Préférences de Communication
                                            </h2>
                                            <NotificationPreferences profile={profile} space="kids" />
                                        </div>

                                        {/* Additional settings could go here (e.g. Subscription status) */}
                                        <div className="mt-12 pt-12 border-t border-white/5 text-center">
                                            <p className="text-xs font-light text-[#86868b] uppercase tracking-widest">
                                                Membre du Club depuis le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <MagicCard user={user} profile={profile} isKid={true} lifetimeXP={lifetimeXP} avatarUrl={computedAvatarUrl} />
                                
                                <div className="mt-12 w-full max-w-[600px]">
                                    <QuickSkinSelector skins={availableSkins} equippedSkinId={profile?.equipped_skin_id} />
                                </div>

                                {/* Solde et Bouton pour dépenser */}
                                <div className="mt-12 mb-8 w-full max-w-[400px] flex flex-col items-center">
                                    <p className="mb-4 text-sm font-bold text-brand-purple uppercase tracking-widest">
                                        Solde actuel : <span className="text-2xl text-white font-black mx-2">{profile?.xp || 0}</span> Poussières d'étoiles 🌟
                                    </p>
                                    <a 
                                        href="/kids/shop"
                                        className="w-full px-6 py-5 bg-brand-purple hover:bg-indigo-500 text-black font-semibold uppercase tracking-widest rounded-full transition-all shadow-xl hover:shadow-brand-purple/30 hover:scale-105 flex justify-center items-center gap-3 text-sm"
                                    >
                                        <ShoppingBag className="w-5 h-5 shrink-0" />
                                        <span>Dépenser mes Poussières</span>
                                    </a>
                                </div>

                                <div className="w-full max-w-[600px]">
                                    <KidsIdentityForm profile={profile} />
                                </div>
                            </div>
                        )}
                    </div>
                </FadeInUp>
            </div>
        </div>
    );
}
