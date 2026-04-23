import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "./AccountForm";
import MagicCard from "@/components/MagicCard";
import BackButton from "@/components/BackButton";
import MagicParticles from "@/components/MagicParticles";
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
        <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans relative overflow-hidden flex flex-col items-center justify-center">

            <div className="relative z-10 w-full max-w-4xl mx-auto">
                <div className="absolute -top-12 left-0">
                    <BackButton />
                </div>
                {isSettingsView ? (
                    <div className="relative group mt-8">
                        <div className="relative bg-black border border-white/10 rounded-none p-6 md:p-8 shadow-2xl">
                            <h2 className="text-2xl font-serif uppercase tracking-widest text-white mb-8 text-center">Mes Paramètres</h2>
                            <div className="max-w-2xl mx-auto">
                                <AccountForm user={user} profile={profile} theme="dark" isKidProfile={false} />

                                {/* Section Notifications */}
                                <div className="mt-12 space-y-6 border-t border-white/10 pt-8">
                                    <h2 className="text-xl font-serif uppercase tracking-widest text-magic-royal text-center mb-6">Préférences de Communication</h2>
                                    <NotificationPreferences profile={profile} space="adults" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <MagicCard user={user} profile={profile} />
                )}
            </div>
        </div>
    );
}
