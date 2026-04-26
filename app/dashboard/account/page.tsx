import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "./AccountForm";
import MagicCard from "@/components/MagicCard";
import BackButton from "@/components/BackButton";
import { FadeInUp } from "@/components/adults/MotionWrapper";
import { NotificationPreferences } from "@/components/NotificationPreferences";

export default async function AccountPage({
    searchParams,
}: {
    searchParams: Promise<{ view?: string }>;
}) {
    const sParams = await searchParams;
    const isSettingsView = sParams.view === 'settings';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 font-sans relative overflow-hidden flex flex-col items-center justify-center">
            {/* Ambient Background Lights (Kids Theme) */}
            <div className="absolute top-0 left-0 w-full md:w-1/2 h-[50vh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/10 via-[#000000]/0 to-[#000000]/0 pointer-events-none z-0"></div>
            <div className="relative z-10 w-full max-w-4xl mx-auto">
                <div className="absolute -top-12 left-0">
                    <BackButton />
                </div>
                {isSettingsView ? (
                    <FadeInUp delay={0.1}>
                        <div className="relative group mt-8 w-full">
                            <div className="relative p-4 md:p-8">
                                <h2 className="text-4xl font-semibold tracking-tight text-[#f5f5f7] mb-12 text-center">Mes Paramètres</h2>
                                <div className="max-w-3xl mx-auto space-y-12">
                                    <AccountForm user={user} profile={profile} theme="dark" isKidProfile={false} />

                                    {/* Section Notifications */}
                                    <div className="mt-16 space-y-8 border-t border-white/5 pt-12">
                                        <h2 className="text-xl font-semibold tracking-tight text-[#86868b] text-center mb-6">Préférences de Communication</h2>
                                        <NotificationPreferences profile={profile} space="adults" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                ) : (
                    <FadeInUp delay={0.1}>
                        <MagicCard user={user} profile={profile} />
                    </FadeInUp>
                )}
            </div>
        </div>
    );
}
