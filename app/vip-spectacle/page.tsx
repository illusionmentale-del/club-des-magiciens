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
        <div className="min-h-[100dvh] bg-brand-bg flex items-center justify-center relative p-4 mb-20 mt-10">
            {/* Background Ambience */}
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-brand-purple/5 blur-[150px] rounded-full pointer-events-none fixed mix-blend-screen"></div>
            <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-brand-purple/10 blur-[120px] rounded-full pointer-events-none fixed mix-blend-screen"></div>

            <div className="max-w-md w-full relative z-10 bg-[#0a0a0a] border border-white/10 rounded-[24px] p-8 shadow-2xl">
                {/* Virtual VIP Card (Apple Style) */}
                <div className="flex justify-center mb-10 relative perspective-1000">
                    <div className="relative w-full max-w-[280px] aspect-[1.586/1] bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl flex flex-col justify-between p-5 overflow-hidden group">
                        {/* Reflection sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                        
                        {/* Top header */}
                        <div className="flex justify-between items-start relative z-10">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">Le Club</span>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md shadow-sm border border-white/5">
                                <Sparkles className="w-3 h-3 text-white/80" />
                            </div>
                        </div>
                        
                        {/* Bottom content */}
                        <div className="relative z-10 flex flex-col text-left">
                            <span className="text-xl font-medium tracking-tight text-white/90">Pass Magique</span>
                            <span className="text-[10px] tracking-widest text-gray-500 uppercase mt-1">Accès offert</span>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mb-6 relative">
                    <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 bg-white/5 rounded-full text-white/80 text-[10px] font-medium tracking-[0.2em] uppercase backdrop-blur-xl shadow-sm mb-4 cursor-default">
                        <Sparkles className="w-3 h-3 text-white/70" />
                        Pass Magique Offert
                    </div>
                    
                    <h1 className="relative z-10 text-4xl md:text-5xl font-bold tracking-tighter text-white leading-[1.1]">
                        Club des Petits <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-400">Magiciens</span>
                    </h1>
                </div>
                
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8 text-[11px] font-medium text-brand-text-muted">
                    <div className="flex items-center gap-1.5"><span className="text-brand-purple">✓</span> Vidéos en illimité</div>
                    <div className="flex items-center gap-1.5"><span className="text-brand-purple">✓</span> Magie pas-à-pas</div>
                    <div className="flex items-center gap-1.5"><span className="text-brand-purple">✓</span> Sans abonnement</div>
                </div>

                <VIPForm />
            </div>
        </div>
    );
}
