import { Metadata } from "next";
import { Star, Sparkles } from "lucide-react";
import VIPAdultForm from "./VIPAdultForm";
import Link from "next/link";
import Image from "next/image";

// CRITICAL: Block indexing
export const metadata: Metadata = {
    title: "Accès Privé | L'Atelier des Magiciens",
    robots: "noindex, nofollow",
};

export default function VIPAdultRequestPage() {
    return (
        <div className="min-h-screen bg-brand-bg flex flex-col relative font-sans selection:bg-brand-blue/30">
            {/* Background Ambience - Sleek Dark Premium */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 blur-[120px] rounded-full mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue/10 blur-[100px] rounded-full mix-blend-screen -translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Header */}
            <header className="w-full p-6 relative z-10 flex justify-center">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center bg-black border border-white/10 rounded-xl overflow-hidden group-hover:border-brand-blue/50 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Image src="/images/logo.png" alt="L'Atelier Logo" width={32} height={32} className="object-contain filter invert opacity-90" />
                    </div>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center relative p-4 mb-12 mt-4 z-10">
                <div className="max-w-md w-full relative bg-[#0a0a0a] border border-white/10 rounded-[24px] p-8 md:p-10 shadow-2xl overflow-hidden">
                    
                    {/* VIP Pass Card Graphic (Apple Style) */}
                    <div className="flex justify-center mb-10 relative perspective-1000">
                        <div className="relative w-full max-w-[280px] aspect-[1.586/1] bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl flex flex-col justify-between p-5 overflow-hidden group">
                            {/* Reflection sheen */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                            
                            {/* Top header */}
                            <div className="flex justify-between items-start relative z-10">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">L'Atelier</span>
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md shadow-sm border border-white/5">
                                    <Star className="w-3 h-3 text-white/80" />
                                </div>
                            </div>
                            
                            {/* Bottom content */}
                            <div className="relative z-10 flex flex-col text-left">
                                <span className="text-xl font-medium tracking-tight text-white/90">Invité Prestige</span>
                                <span className="text-[10px] tracking-widest text-gray-500 uppercase mt-1">Accès offert</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center mb-6 relative">
                        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 bg-white/5 rounded-full text-white/80 text-[10px] font-medium tracking-[0.2em] uppercase backdrop-blur-xl shadow-sm mb-4 cursor-default">
                            <Star className="w-3 h-3 text-white/70" />
                            Accès Privilège
                        </div>
                        
                        <h1 className="relative z-10 text-4xl md:text-5xl font-bold tracking-tighter text-white leading-[1.1]">
                            Atelier des <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-400">Magiciens</span>
                        </h1>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8 text-[11px] font-medium text-gray-400">
                        <div className="flex items-center gap-1.5"><span className="text-brand-blue">✓</span> Masterclass exclusives</div>
                        <div className="flex items-center gap-1.5"><span className="text-brand-blue">✓</span> Secrets professionnels</div>
                        <div className="flex items-center gap-1.5"><span className="text-brand-blue">✓</span> Sans abonnement</div>
                    </div>

                    <VIPAdultForm />
                </div>
            </main>
        </div>
    );
}
