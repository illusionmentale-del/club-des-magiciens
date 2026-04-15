import KidsSidebar from "@/components/KidsSidebar";
import KidsMobileNav from "@/components/KidsMobileNav";
import KidsLayoutClient from "@/components/KidsLayoutClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function KidsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // STRICT SEPARATION: Check if user has kids access or an active 24h trial
    const { data: profileCheck } = await supabase.from('profiles').select('has_kids_access, kids_trial_expires_at').eq('id', user.id).single();
    
    let hasAccess = false;
    if (profileCheck?.has_kids_access) {
        hasAccess = true;
    } else if (profileCheck?.kids_trial_expires_at) {
        const expiry = new Date(profileCheck.kids_trial_expires_at);
        if (expiry > new Date()) {
            hasAccess = true;
        }
    }

    if (!hasAccess) {
        redirect("/tarifs/kids");
    }

    // SILENT TRACKING: Record the last kid login
    // We execute this asynchronously so it doesn't block the page load
    supabase.from('profiles').update({ last_kids_login: new Date().toISOString() }).eq('id', user.id).then();

    let socialLinks = {
        youtube: "https://youtube.com/@LeMagicienPOV",
        instagram: "https://instagram.com/LeMagicienPOV",
        facebook: "https://facebook.com/LeMagicienPOV",
        tiktok: "https://tiktok.com/@LeMagicienPOV"
    };
    let siteLogo = "/logo.png";

    let isAdmin = false;
    let hasAdultsAccess = false;

    let hasUnreadReplies = false;

    let enableProgram = true;
    let enableMasterclass = true;
    let enableAccount = true;
    let enableShop = true;
    let currentXP = 0;
    let lifetimeXP = 0;
    let magicLevel = "Apprenti";
    let avatarUrl = "";
    let userName = "";

    if (user) {
        // ... existing admin and settings fetch ...
        const { data: profile } = await supabase.from('profiles').select('role, has_adults_access, magic_level, full_name, username, avatar_skins(image_url)').eq('id', user.id).single();
        isAdmin = profile?.role === 'admin';
        hasAdultsAccess = profile?.has_adults_access || false;
        const isLegendary = (lifetimeXP || 0) >= 150;
        const isHolo = (lifetimeXP || 0) >= 50 && (lifetimeXP || 0) < 150;
        
        if (isLegendary) magicLevel = "Magicien Légendaire";
        else if (isHolo) magicLevel = "Holo-Magicien";
        else magicLevel = "Apprenti Magicien";
        
        // Priority to pseudo (username), then full name, then fallback
        userName = profile?.username || profile?.full_name || "Jeune Magicien";
        
        // Handle avatar skin
        if (profile?.avatar_skins && !Array.isArray(profile.avatar_skins) && typeof profile.avatar_skins === 'object') {
             avatarUrl = (profile.avatar_skins as any).image_url || "";
        }

        const { data: settings } = await supabase.from("settings").select("*");

        const settingsMap = settings?.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>) || {};

        const getSetting = (key: string, defaultVal: string) => {
            return settingsMap[`kid_${key}`] || settingsMap[key] || defaultVal;
        };

        enableProgram = settingsMap["enable_kids_program"] !== "false";
        enableMasterclass = settingsMap["enable_kids_masterclass"] !== "false";
        enableAccount = settingsMap["enable_kids_account"] !== "false";
        enableShop = settingsMap["enable_kids_shop"] !== "false";

        socialLinks = {
            youtube: getSetting("social_youtube", "https://youtube.com/@LeMagicienPOV"),
            instagram: getSetting("social_instagram", "https://instagram.com/LeMagicienPOV"),
            facebook: getSetting("social_facebook", "https://facebook.com/LeMagicienPOV"),
            tiktok: getSetting("social_tiktok", "https://tiktok.com/@LeMagicienPOV")
        };

        siteLogo = getSetting("site_logo", "/logo.png");

        // Check for unread replies from Jérémy for the kid's notification badge
        if (!isAdmin) {
            const { count } = await supabase
                .from("course_comments")
                .select("id", { count: "exact", head: true })
                .eq("target_user_id", user.id)
                .eq("kid_notified", false);

            hasUnreadReplies = (count || 0) > 0;
        }

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
    }

    // Check if user has active purchases to show the "Mes Achats" link
    let hasPurchases = false;
    if (user) {
        const { count } = await supabase
            .from("user_purchases")
            .select('*', { count: 'exact', head: true })
            .eq("user_id", user.id)
            .eq("status", "active");
        hasPurchases = (count || 0) > 0;
    }

    return (
        <KidsLayoutClient
            sidebar={
                <Suspense fallback={<div className="w-64 bg-magic-card hidden md:block" />}>
                    <KidsSidebar socialLinks={socialLinks} logoUrl={siteLogo} isAdmin={isAdmin} hasPurchases={hasPurchases} hasUnreadReplies={hasUnreadReplies} hasAdultsAccess={hasAdultsAccess} enableProgram={enableProgram} enableMasterclass={enableMasterclass} enableAccount={enableAccount} enableShop={enableShop} xpBalance={currentXP} lifetimeXP={lifetimeXP} magicLevel={magicLevel} avatarUrl={avatarUrl} userName={userName} />
                </Suspense>
            }
            mobileNav={
                <Suspense fallback={<div className="h-16 bg-magic-card md:hidden" />}>
                    <KidsMobileNav logoUrl={siteLogo} isAdmin={isAdmin} hasPurchases={hasPurchases} hasUnreadReplies={hasUnreadReplies} enableProgram={enableProgram} enableMasterclass={enableMasterclass} enableAccount={enableAccount} enableShop={enableShop} xpBalance={currentXP} lifetimeXP={lifetimeXP} magicLevel={magicLevel} avatarUrl={avatarUrl} userName={userName} />
                </Suspense>
            }
        >
            {children}
        </KidsLayoutClient>
    );
}
