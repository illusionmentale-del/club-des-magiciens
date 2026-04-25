import Link from "next/link";
import Image from "next/image";
import { Sparkles, PartyPopper } from "lucide-react";
import MagicAvatar from "@/components/kids/MagicAvatar";

type KidsProgressionProps = {
    validatedCount: number;
    totalItemsToMax?: number;
    userGrade: string;
    currentLevel: number;
    totalXP?: number;
    nextGrade?: string | null;
    nextThreshold?: number | null;
    avatarUrl?: string;
};

export default function KidsProgression({
    userGrade = "Apprenti",
    totalXP = 0,
    nextGrade,
    nextThreshold,
    avatarUrl = ""
}: KidsProgressionProps) {

    let progressPercentage = 100;
    if (nextThreshold && nextThreshold > 0) {
        progressPercentage = Math.min((totalXP / nextThreshold) * 100, 100);
    }

    return (
        <section className="bg-[#1c1c1e] border border-white/5 rounded-[32px] p-8 sticky top-8 shadow-xl relative overflow-hidden group hover:shadow-2xl hover:border-white/10 transition-all duration-500">
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-purple/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <h3 className="text-sm font-semibold text-[#86868b] uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                Ton Évolution (XP)
            </h3>

            <div className="text-center mb-8 relative z-10 flex flex-col items-center">
                {/* 3D Shield / Dynamic Avatar */}
                <div className="mb-6">
                    <MagicAvatar imageUrl={avatarUrl} levelName={userGrade} size="lg" className="drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] group-hover:scale-105 transition-all duration-500 ease-[0.16,1,0.3,1]" />
                </div>

                <div className="inline-block px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-widest mb-4 shadow-sm">
                    Grade Actuel: {userGrade}
                </div>

                {/* XP with Stardust */}
                <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 relative drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                        <Image src="/achievements/stardust.png" alt="Poussière d'étoile" fill className="object-contain" />
                    </div>
                    <div className="text-4xl font-semibold tracking-tight text-[#f5f5f7] transition-transform duration-500">
                        {totalXP} <span className="text-xl text-[#86868b] font-light">{nextThreshold ? `/ ${nextThreshold}` : ''}</span>
                    </div>
                </div>
                <div className="text-[10px] font-medium text-[#86868b] mt-2 uppercase tracking-widest">Poussières d'étoiles</div>
            </div>

            {nextThreshold && (
                <div className="mb-6 relative z-10">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-[#86868b]">
                        <span>{userGrade}</span>
                        <span className="text-brand-gold">{nextGrade}</span>
                    </div>
                    <div className="relative h-2 w-full bg-[#000000] rounded-full overflow-hidden shadow-inner border border-white/5">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple to-brand-gold rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/30 to-transparent animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-[#86868b] mt-3">Plus que <span className="text-white font-semibold">{nextThreshold - totalXP} poussières</span> avant le grade de {nextGrade} !</p>
                </div>
            )}

            {!nextThreshold && (
                <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-[16px] p-5 flex gap-4 items-start mb-6 relative z-10">
                    <PartyPopper className="w-5 h-5 text-brand-gold shrink-0 mt-0.5 animate-bounce-slow" />
                    <p className="text-sm text-brand-gold leading-relaxed font-semibold">
                        Incroyable ! Tu as atteint le grade ultime de la Magie !
                    </p>
                </div>
            )}

            {nextThreshold && (
                <div className="bg-[#2c2c2e]/50 border border-white/5 rounded-[16px] p-5 flex gap-4 items-start mb-6 relative z-10">
                    <Sparkles className="w-5 h-5 text-brand-purple shrink-0 mt-0.5 animate-bounce-slow" />
                    <p className="text-sm text-[#86868b] leading-relaxed font-light">
                        Chaque nouvelle vidéo ou achat t'approche du sommet.
                    </p>
                </div>
            )}

            <Link href="/kids/achievements" className="block w-full text-center py-4 text-xs font-semibold text-[#86868b] hover:text-[#f5f5f7] transition-all uppercase tracking-widest border border-white/5 rounded-full bg-[#2c2c2e]/30 hover:bg-[#2c2c2e]/80 hover:border-white/10 relative z-10">
                Gagner des poussières
            </Link>
        </section>
    );
}
