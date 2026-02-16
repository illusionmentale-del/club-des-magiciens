import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MagicCard from "@/components/MagicCard";
import MagicParticles from "@/components/MagicParticles";

export default async function KidsAccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans selection:bg-purple-500/30 overflow-hidden relative">

            {/* Ambient Background Lights */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Header / Hero - MATCHING DASHBOARD STYLE STRICTLY */}
            <header className="mb-16 max-w-7xl mx-auto relative z-10 pt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-1 bg-blue-600"></div>
                            <span className="text-blue-500 text-xs font-bold tracking-[0.2em] uppercase">Mon Profil</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-2">
                            Identité<br />Secrète
                        </h1>
                        <p className="text-xl text-slate-400 font-light flex items-center gap-2">
                            Gère tes informations d'apprenti magicien.
                        </p>
                    </div>
                </div>
            </header>

            <div className="relative z-10 w-full max-w-4xl mx-auto">
                <MagicCard user={user} profile={profile} isKid={true} />
            </div>
        </div>
    );
}
