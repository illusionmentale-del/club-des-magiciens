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
                    
                    {/* VIP Pass Card Graphic */}
                    <div className="flex justify-center mb-8 relative">
                        <div className="relative w-full max-w-[240px] aspect-[1.6/1] bg-gradient-to-br from-gray-900 to-black rounded-xl border border-brand-blue/30 shadow-[0_15px_40px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center overflow-hidden group hover:border-brand-blue/50 transition-all duration-500">
                            {/* Inner glows */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/20 blur-[30px] group-hover:bg-brand-blue/30 transition-colors duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 blur-[40px]"></div>
                            
                            <div className="w-12 h-12 bg-black border border-brand-blue/50 rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(59,130,246,0.3)] relative z-10">
                                <Star className="w-5 h-5 text-brand-blue" />
                            </div>
                            
                            <span className="text-[11px] uppercase tracking-[0.3em] text-gray-300 font-bold relative z-10">Invité Prestique</span>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-brand-blue mt-1 relative z-10">L'Atelier des Magiciens</span>
                            
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent"></div>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-black text-white text-center mb-4 tracking-tight">Accès Privilège</h1>
                    
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
