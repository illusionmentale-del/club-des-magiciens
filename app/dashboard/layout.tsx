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
        // STRICT SEPARATION: Check if kid
        const { data: profile } = await supabase.from('profiles').select('access_level').eq('id', user.id).single();
        if (profile?.access_level === 'kid') {
            redirect("/kids");
        }
    }

    let isAdmin = false;
    let socialLinks = {
        youtube: "https://youtube.com/@LeMagicienPOV",
        instagram: "https://instagram.com/LeMagicienPOV",
        facebook: "https://facebook.com/LeMagicienPOV",
        tiktok: "https://tiktok.com/@LeMagicienPOV"
    };
    let siteLogo = "/logo.png";

    if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        isAdmin = profile?.role === 'admin';

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
            <Sidebar isAdmin={isAdmin} socialLinks={socialLinks} logoUrl={siteLogo} />
            <div className="flex-1 flex flex-col md:pl-0">
                <MobileNav isAdmin={isAdmin} />
                <main className="flex-1 overflow-y-auto bg-magic-bg p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
