import Link from "next/link";
import Image from "next/image";
import { Sparkles, PartyPopper } from "lucide-react";

type KidsProgressionProps = {
    validatedCount: number;
    totalItemsToMax?: number;
    userGrade: string;
    currentLevel: number;
    totalXP?: number;
    nextGrade?: string | null;
    nextThreshold?: number | null;
};

export default function KidsProgression({
    userGrade = "Apprenti",
    totalXP = 0,
    nextGrade,
    nextThreshold
}: KidsProgressionProps) {

    let progressPercentage = 100;
    if (nextThreshold && nextThreshold > 0) {
        progressPercentage = Math.min((totalXP / nextThreshold) * 100, 100);
    }

    return (
        <section className="bg-brand-card border border-brand-border rounded-2xl p-6 sticky top-8 shadow-xl relative overflow-hidden">
            {/* Background Magic Runes effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-[50px] pointer-events-none"></div>

            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4 flex items-center gap-2 relative z-10">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                Ton Évolution (XP)
            </h3>

            <div className="text-center mb-6 relative z-10 flex flex-col items-center">
                {/* 3D Shield */}
                <div className="relative w-24 h-24 mb-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-500">
                    <Image src="/achievements/magic_shield.png" alt="Emblème de Grade" fill className="object-contain" priority />
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-xs font-bold uppercase tracking-widest mb-3 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    Grade Actuel: {userGrade}
                </div>

                {/* XP with Stardust */}
                <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 relative drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                        <Image src="/achievements/stardust.png" alt="Poussière d'étoile" fill className="object-contain" />
                    </div>
                    <div className="text-4xl font-black text-white group-hover:scale-110 transition-transform tracking-tight">
                        {totalXP} <span className="text-lg text-brand-text-muted font-medium">{nextThreshold ? `/ ${nextThreshold}` : ''}</span>
                    </div>
                </div>
                <div className="text-[10px] font-bold text-brand-text-muted mt-1 uppercase tracking-widest">Poussières d'étoiles récoltées</div>
            </div>

            {nextThreshold && (
                <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-400">
                        <span>{userGrade}</span>
                        <span className="text-brand-gold">{nextGrade}</span>
                    </div>
                    <div className="relative h-3 w-full bg-brand-bg rounded-full overflow-hidden shadow-inner">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple to-brand-gold rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/30 to-transparent animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-brand-text-muted mt-2">Plus que <span className="text-white font-bold">{nextThreshold - totalXP} poussières</span> avant le grade de {nextGrade} !</p>
                </div>
            )}

            {!nextThreshold && (
                <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4 flex gap-3 items-start mb-6">
                    <PartyPopper className="w-5 h-5 text-brand-gold shrink-0 mt-0.5 animate-bounce-slow" />
                    <p className="text-sm text-brand-gold leading-relaxed font-bold">
                        Incroyable ! Tu as atteint le grade ultime de la Magie !
                    </p>
                </div>
            )}

            {nextThreshold && (
                <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-xl p-4 flex gap-3 items-start mb-6">
                    <Sparkles className="w-5 h-5 text-brand-purple shrink-0 mt-0.5 animate-bounce-slow" />
                    <p className="text-sm text-brand-text leading-relaxed">
                        Chaque nouvelle vidéo ou achat t'approche du sommet.
                    </p>
                </div>
            )}

            <Link href="/kids/achievements" className="block w-full text-center py-2 text-xs font-bold text-brand-text-muted hover:text-white transition-colors uppercase tracking-widest border border-white/10 rounded-lg hover:bg-white/5 hover:border-brand-purple/30">
                Savoir comment gagner des poussières
            </Link>
        </section>
    );
}
