import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

    if (user) {
        const { data: profile } = await supabase.from("profiles").select("role, has_kids_access").eq("id", user.id).single();
        isAdmin = profile?.role === 'admin';
        hasKidsAccess = profile?.has_kids_access || false;

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
        <div className="flex h-screen bg-magic-bg overflow-hidden">
            <Sidebar isAdmin={isAdmin} socialLinks={socialLinks} logoUrl={siteLogo} hasKidsAccess={hasKidsAccess} />
            <div className="flex-1 flex flex-col md:pl-0">
                <MobileNav isAdmin={isAdmin} hasKidsAccess={hasKidsAccess} />
                <main className="flex-1 overflow-y-auto bg-magic-bg p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
