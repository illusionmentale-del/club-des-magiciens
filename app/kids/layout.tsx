import KidsSidebar from "@/components/KidsSidebar";
import KidsMobileNav from "@/components/KidsMobileNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function KidsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    } else {
        // STRICT SEPARATION: Check if adult
        const { data: profile } = await supabase.from('profiles').select('access_level').eq('id', user.id).single();
        if (profile?.access_level !== 'kid') {
            // redirect("/dashboard"); // Optional: Strict enforcement
        }
    }

    let socialLinks = {
        youtube: "https://youtube.com/@LeMagicienPOV",
        instagram: "https://instagram.com/LeMagicienPOV",
        facebook: "https://facebook.com/LeMagicienPOV",
        tiktok: "https://tiktok.com/@LeMagicienPOV"
    };
    let siteLogo = "/logo.png";

    let isLoading = true; // Not used but good for structure if we add loading state
    let isAdmin = false;

    if (user) {
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
    }

    return (
        <div className="flex h-screen bg-[#050507] overflow-hidden text-white font-sans">
            <KidsSidebar socialLinks={socialLinks} logoUrl={siteLogo} isAdmin={isAdmin} />
            <div className="flex-1 flex flex-col md:pl-0">
                <KidsMobileNav logoUrl={siteLogo} />
                <main className="flex-1 overflow-y-auto bg-[#050507] p-4 md:p-8 text-white">
                    {children}
                </main>
            </div>
        </div>
    );
}
