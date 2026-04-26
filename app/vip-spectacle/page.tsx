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
                {/* Virtual VIP Card */}
                <div className="flex justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-brand-purple/20 blur-xl rounded-full"></div>
                    <div className="relative w-48 h-28 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-500/40 shadow-[0_10px_40px_rgba(234,179,8,0.15)] flex flex-col items-center justify-center overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-purple/30 blur-[30px]"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-yellow-500/20 blur-[30px]"></div>
                        <div className="w-10 h-10 bg-gradient-to-tr from-yellow-600 to-yellow-300 rounded-full flex items-center justify-center mb-1 shadow-lg shadow-yellow-500/30">
                            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-500/90 font-bold">Pass à vie</span>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
                    </div>
                </div>
                
                <h1 className="text-3xl font-black text-white text-center mb-4 tracking-tight">Accès Magique Offert</h1>
                
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
