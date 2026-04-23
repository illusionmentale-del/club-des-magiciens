import { Metadata } from "next";
import { Star } from "lucide-react";
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
        <div className="min-h-screen bg-black flex flex-col relative font-sans selection:bg-magic-royal/30">
            {/* Background Ambience - Sleek Dark Premium */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-magic-royal/5 blur-[120px] rounded-full mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-800/10 blur-[100px] rounded-full mix-blend-screen -translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Header */}
            <header className="w-full p-6 relative z-10 flex justify-center">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center bg-black border border-white/10 rounded-xl overflow-hidden group-hover:border-magic-royal/50 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Image src="/images/logo.png" alt="L'Atelier Logo" width={32} height={32} className="object-contain filter invert opacity-90" />
                    </div>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center relative p-4 mb-12 mt-4 z-10">
                <div className="max-w-md w-full relative bg-[#0a0a0a] border border-white/10 rounded-none p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
                    
                    {/* VIP Pass Card Graphic */}
                    <div className="flex justify-center mb-8 relative">
                        <div className="relative w-full max-w-[240px] aspect-[1.6/1] bg-gradient-to-br from-gray-900 to-black rounded-lg border border-magic-royal/30 shadow-[0_15px_40px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center overflow-hidden group">
                            {/* Inner glows */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-magic-royal/20 blur-[30px] group-hover:bg-magic-royal/30 transition-colors duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 blur-[40px]"></div>
                            
                            <div className="w-12 h-12 bg-black border border-magic-royal/50 rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] relative z-10">
                                <Star className="w-5 h-5 text-magic-royal" />
                            </div>
                            
                            <span className="text-[11px] uppercase tracking-[0.3em] text-gray-300 font-bold relative z-10">Invité Prestique</span>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-magic-royal mt-1 relative z-10">L'Atelier des Magiciens</span>
                            
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-magic-royal/50 to-transparent"></div>
                        </div>
                    </div>
                    
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-serif text-white mb-4 tracking-tight">Accès Privilège</h1>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                            Remplissez ce formulaire pour recevoir votre accès gratuit aux formations fondamentales de l'Atelier.
                        </p>
                    </div>

                    <VIPAdultForm />
                </div>
            </main>
        </div>
    );
}
