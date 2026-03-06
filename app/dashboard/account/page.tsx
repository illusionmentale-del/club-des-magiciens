import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "./AccountForm";
import MagicCard from "@/components/MagicCard";
import MagicParticles from "@/components/MagicParticles";
import { PushOptInButton } from "@/components/PushOptInButton";

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
        <div className="min-h-screen bg-magic-bg text-white p-4 md:p-8 font-sans relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 z-0">
                <MagicParticles count={50} color="rgba(234, 179, 8, 0.3)" />
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8">
                {isSettingsView ? (
                    <div className="relative group mt-8">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-royal to-blue-500 rounded-3xl opacity-0 blur-lg group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
                        <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-8 text-center">Mes Paramètres</h2>
                            <div className="max-w-2xl mx-auto">
                                <AccountForm user={user} profile={profile} theme="dark" isKidProfile={false} />

                                {/* Section Notifications */}
                                <div className="mt-12 space-y-6 border-t border-white/10 pt-8">
                                    <h2 className="text-xl font-black uppercase tracking-widest text-brand-royal text-center">Préférences d'alertes</h2>
                                    <PushOptInButton />
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
