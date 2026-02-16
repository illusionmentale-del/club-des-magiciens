import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "./AccountForm";
import MagicCard from "@/components/MagicCard";
import MagicParticles from "@/components/MagicParticles";

export default async function AccountPage() {
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
                {/* Header is now integrated or minimized as card is the Hero */}
                <MagicCard user={user} profile={profile} />
            </div>
        </div>
    );
}
