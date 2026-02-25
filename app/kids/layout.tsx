import KidsSidebar from "@/components/KidsSidebar";
import KidsMobileNav from "@/components/KidsMobileNav";
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

    let hasUnreadReplies = false;

    if (user) {
        // ... existing admin and settings fetch ...
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        isAdmin = profile?.role === 'admin';

        const { data: settings } = await supabase.from("settings").select("*");

        const settingsMap = settings?.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>) || {};

        const getSetting = (key: string, defaultVal: string) => {
            return settingsMap[`kid_${key}`] || settingsMap[key] || defaultVal;
        };

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
    }

    return (
        <div className="flex h-screen bg-brand-bg overflow-hidden text-brand-text font-sans">
            <Suspense fallback={<div className="w-64 bg-magic-card hidden md:block" />}>
                <KidsSidebar socialLinks={socialLinks} logoUrl={siteLogo} isAdmin={isAdmin} hasUnreadReplies={hasUnreadReplies} />
            </Suspense>
            <div className="flex-1 flex flex-col md:pl-0">
                <Suspense fallback={<div className="h-16 bg-magic-card md:hidden" />}>
                    <KidsMobileNav logoUrl={siteLogo} isAdmin={isAdmin} />
                </Suspense>
                <main className="flex-1 overflow-y-auto bg-brand-bg p-4 md:p-8 text-brand-text">
                    {children}
                </main>
            </div>
        </div>
    );
}
