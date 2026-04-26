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
                    <div className="relative w-full max-w-[280px] aspect-[1.586/1] bg-gradient-to-br from-[#f5f5f7] via-[#e5e5ea] to-[#d1d1d6] rounded-2xl border border-white/50 shadow-2xl flex flex-col justify-between p-5 overflow-hidden group">
                        {/* Reflection sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                        
                        {/* Top header */}
                        <div className="flex justify-between items-start relative z-10">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-semibold">Le Club</span>
                            <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center backdrop-blur-md shadow-sm border border-black/5">
                                <svg className="w-3 h-3 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Bottom content */}
                        <div className="relative z-10 flex flex-col text-left">
                            <span className="text-xl font-bold tracking-tight text-black/80">Pass Magique</span>
                            <span className="text-[10px] tracking-widest text-gray-500 uppercase mt-1">Accès à vie</span>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mb-6 relative">
                    <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 bg-white/5 rounded-full text-white/80 text-[10px] font-medium tracking-[0.2em] uppercase backdrop-blur-xl shadow-sm mb-4 cursor-default">
                        <Sparkles className="w-3 h-3 text-white/70" />
                        Pass Magique Offert
                    </div>
                    
                    <h1 className="relative z-10 text-4xl md:text-5xl font-bold tracking-tighter text-white leading-[1.1]">
                        Accès <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-400">Privilège</span> 🎁
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
