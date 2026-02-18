import Link from "next/link";
import { Map, PartyPopper } from "lucide-react";

type LibraryItem = {
    id: string;
    title: string;
};

type KidsProgressionProps = {
    validatedCount: number;
    totalItemsToMax?: number;
    userGrade: string;
    currentLevel: number;
};

export default function KidsProgression({
    validatedCount,
    totalItemsToMax = 50,
    userGrade = "Apprenti",
    currentLevel = 0
}: KidsProgressionProps) {

    const progressPercentage = Math.min((validatedCount / totalItemsToMax) * 100, 100);

    return (
        <section className="bg-brand-card border border-brand-border rounded-2xl p-6 sticky top-8 shadow-xl">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-brand-purple" />
                Ta Progression
            </h3>

            <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-xs font-bold uppercase tracking-widest mb-2">
                    Grade Actuel: {userGrade} (Niv. {currentLevel})
                </div>
                <div className="text-4xl font-black text-white mb-1 group-hover:scale-110 transition-transform">
                    {validatedCount} <span className="text-lg text-brand-text-muted font-medium">/ {totalItemsToMax}</span>
                </div>
                <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">Ateliers Validés</div>
            </div>

            <div className="relative h-3 w-full bg-brand-bg rounded-full overflow-hidden mb-4 shadow-inner">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                >
                    <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/30 to-transparent animate-pulse"></div>
                </div>
            </div>

            <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-xl p-4 flex gap-3 items-start mb-6">
                <PartyPopper className="w-5 h-5 text-brand-purple shrink-0 mt-0.5 animate-bounce-slow" />
                <p className="text-sm text-brand-text leading-relaxed">
                    "Continue comme ça ! Chaque semaine te rapproche du grade de Grand Magicien."
                </p>
            </div>

            <Link href="/kids/account" className="block w-full text-center py-2 text-xs font-bold text-brand-text-muted hover:text-white transition-colors uppercase tracking-widest border border-white/10 rounded-lg hover:bg-white/5 hover:border-brand-purple/30">
                Voir mon parcours complet
            </Link>
        </section>
    );
}
