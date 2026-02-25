import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-purple/30 pb-20">
            {/* Minimalist Header for legal text */}
            <header className="py-6 px-4 md:px-8 border-b border-white/5 bg-brand-card/30 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-brand-text-muted hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Retour au site</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center">
                            <Scale className="w-4 h-4 text-brand-purple" />
                        </div>
                        <span className="font-black uppercase tracking-widest text-sm">Espace Légal</span>
                    </div>
                </div>
            </header>

            {/* Content Container */}
            <main className="max-w-4xl mx-auto pt-12 px-4 md:px-8">
                {children}
            </main>
        </div>
    );
}
