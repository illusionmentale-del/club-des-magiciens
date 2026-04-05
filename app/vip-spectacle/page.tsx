import { Metadata } from "next";
import { Sparkles } from "lucide-react";
import VIPForm from "./VIPForm";

// CRITICAL: Block indexing
export const metadata: Metadata = {
    title: "Accès Magique Privé",
    robots: "noindex, nofollow",
};

export default function VIPRequestPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center relative p-4 mb-20 mt-10">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="max-w-md w-full relative z-10 bg-brand-card/80 backdrop-blur-xl border border-brand-purple/30 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple">
                        <Sparkles className="w-8 h-8" />
                    </div>
                </div>
                
                <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Accès Magique Offert</h1>
                <p className="text-brand-text-muted text-center mb-8 text-sm">
                    Demande ton accès au Club des Petits Magiciens suite à notre rencontre.<br/><br/>
                    <span className="text-white/80 font-medium">Pour rappel, cet accès te sera offert à vie et ne demande aucune coordonnée bancaire.</span>
                </p>

                <VIPForm />
            </div>
        </div>
    );
}
