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

    if (user) {
        const { data: settings } = await supabase.from("settings").select("*");

        const settingsMap = settings?.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>) || {};

        socialLinks = {
            youtube: settingsMap["social_youtube"] || "https://youtube.com/@LeMagicienPOV",
            instagram: settingsMap["social_instagram"] || "https://instagram.com/LeMagicienPOV",
            facebook: settingsMap["social_facebook"] || "https://facebook.com/LeMagicienPOV",
            tiktok: settingsMap["social_tiktok"] || "https://tiktok.com/@LeMagicienPOV"
        };

        siteLogo = settingsMap["site_logo"] || "/logo.png";
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
            <KidsSidebar socialLinks={socialLinks} logoUrl={siteLogo} />
            <div className="flex-1 flex flex-col md:pl-0">
                <KidsMobileNav />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 text-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
