import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { enforceDeviceLimit } from "@/lib/deviceLimit";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login if not authenticated (though middleware usually handles this)
        // redirect("/login");
    } else {
        // STRICT DEVICE SHARING LIMIT
        await enforceDeviceLimit(user.id);

        // STRICT SEPARATION: Check if user has adult access
        const { data: profile } = await supabase.from('profiles').select('has_adults_access').eq('id', user.id).single();
        if (!profile?.has_adults_access) {
            redirect("/kids");
        }
    }

    let isAdmin = false;
    let hasKidsAccess = false;
    let socialLinks = {
        youtube: "https://youtube.com/@LeMagicienPOV",
        instagram: "https://instagram.com/LeMagicienPOV",
        facebook: "https://facebook.com/LeMagicienPOV",
        tiktok: "https://tiktok.com/@LeMagicienPOV"
    };
    let siteLogo = "/logo.png";

    let toggles = {
        enable_adults_program: true,
        enable_adults_masterclass: true,
        enable_adults_account: true,
        enable_adults_catalog: true,
    };

    let currentXP = 0;
    let lifetimeXP = 0;
    let magicLevel = "Initié";
    let avatarUrl = "";
    let userName = "";
    let uiLabelsMap: Record<string, string> = {
        nav_actu: "L'Actu du Club",
        nav_videos: "Mes Vidéos",
        nav_formations: "Mes Formations",
        nav_boutique: "La Boutique",
        nav_settings: "Mes Paramètres",
        page_dashboard_title: "Le QG de la Magie",
        page_videos_title: "Les Vidéos",
        page_formations_title: "Mes Formations",
        page_formations_subtitle: "Apprentissage Structuré"
    };

    if (user) {
        const { data: profile } = await supabase.from("profiles").select("role, has_kids_access, full_name, username, avatar_skins(image_url)").eq("id", user.id).single();
        isAdmin = profile?.role === 'admin';
        hasKidsAccess = profile?.has_kids_access || false;

        // Fetch XP Balance
        try {
            const { data: xpLogs } = await supabase.from('user_xp_logs').select('xp_awarded').eq('user_id', user.id);
            if (xpLogs) {
                currentXP = xpLogs.reduce((acc, log) => acc + log.xp_awarded, 0);
                lifetimeXP = xpLogs.reduce((acc, log) => acc + (log.xp_awarded > 0 ? log.xp_awarded : 0), 0);
            }
        } catch (e) {
            console.error("Layout could not fetch XP", e);
        }

        // Determine Adult Magic Levels
        if (lifetimeXP >= 150) magicLevel = "Illusionniste Confirmé";
        else if (lifetimeXP >= 50) magicLevel = "Praticien";
        else magicLevel = "Initié";

        userName = profile?.username || profile?.full_name || "Élève";

        if (profile?.avatar_skins && !Array.isArray(profile.avatar_skins) && typeof profile.avatar_skins === 'object') {
             avatarUrl = (profile.avatar_skins as any).image_url || "";
        }

        const { data: settings } = await supabase.from("settings").select("*");

        const settingsMap = settings?.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>) || {};

        toggles = {
            enable_adults_program: settingsMap["enable_adults_program"] !== "false",
            enable_adults_masterclass: settingsMap["enable_adults_masterclass"] !== "false",
            enable_adults_account: settingsMap["enable_adults_account"] !== "false",
            enable_adults_catalog: settingsMap["enable_adults_catalog"] !== "false",
        };

        socialLinks = {
            youtube: settingsMap["social_youtube"] || "https://youtube.com/@LeMagicienPOV",
            instagram: settingsMap["social_instagram"] || "https://instagram.com/LeMagicienPOV",
            facebook: settingsMap["social_facebook"] || "https://facebook.com/LeMagicienPOV",
            tiktok: settingsMap["social_tiktok"] || "https://tiktok.com/@LeMagicienPOV"
        };

        siteLogo = settingsMap["site_logo"] || "/logo.png";

        if (settingsMap["adult_ui_labels"]) {
            try {
                uiLabelsMap = { ...uiLabelsMap, ...JSON.parse(settingsMap["adult_ui_labels"]) };
            } catch (e) {
                console.error("Failed to parse adult_ui_labels in layout", e);
            }
        }
    }

    return (
        <div className="flex h-screen bg-magic-bg overflow-hidden">
            <Sidebar isAdmin={isAdmin} socialLinks={socialLinks} logoUrl={siteLogo} hasKidsAccess={hasKidsAccess} toggles={toggles} xpBalance={currentXP} lifetimeXP={lifetimeXP} magicLevel={magicLevel} avatarUrl={avatarUrl} userName={userName} uiLabels={uiLabelsMap} />
            <div className="flex-1 flex flex-col md:pl-0">
                <MobileNav isAdmin={isAdmin} hasKidsAccess={hasKidsAccess} toggles={toggles} xpBalance={currentXP} lifetimeXP={lifetimeXP} magicLevel={magicLevel} avatarUrl={avatarUrl} userName={userName} uiLabels={uiLabelsMap} />
                <main className="flex-1 overflow-y-auto bg-magic-bg p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
