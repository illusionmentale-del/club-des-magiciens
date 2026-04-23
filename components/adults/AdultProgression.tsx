import Link from "next/link";
import { Award, Zap } from "lucide-react";

type AdultProgressionProps = {
    validatedCount: number;
    totalCourses: number;
};

export default function AdultProgression({
    validatedCount,
    totalCourses,
}: AdultProgressionProps) {

    const progressPercentage = totalCourses > 0 ? Math.min((validatedCount / totalCourses) * 100, 100) : 0;

    return (
        <section className="bg-transparent border border-white/10 hover:border-magic-royal/30 transition-colors duration-500 rounded-sm p-6 md:p-8 sticky top-8 relative overflow-hidden group">
            <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-8 flex items-center gap-3 relative z-10">
                <Award className="w-6 h-6 text-magic-royal drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                Progression Globale
            </h3>

            <div className="text-center mb-8 relative z-10">
                <div className="text-5xl font-serif font-bold text-white mb-2 transition-all duration-500 group-hover:text-magic-royal drop-shadow-sm">
                    {validatedCount} <span className="text-xl text-slate-500 font-sans font-medium">/ {totalCourses}</span>
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Vidéos Visionnées</div>
            </div>

            <div className="relative h-1 w-full bg-white/10 rounded-none overflow-hidden mb-8 z-10">
                <div
                    className="absolute top-0 left-0 h-full bg-magic-royal transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                    style={{ width: `${progressPercentage}%` }}
                >
                </div>
            </div>

            <div className="border-l border-magic-royal/50 pl-4 py-2 flex gap-3 items-start mb-8 relative z-10 transition-colors duration-500">
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                    Votre parcours s'enrichit. Continuez à visionner les modules pour débloquer de nouveaux secrets.
                </p>
            </div>

            <Link href="/dashboard/library" className="block w-full text-center py-4 text-xs font-bold text-black uppercase tracking-widest bg-magic-royal hover:bg-yellow-500 rounded-sm transition-all relative z-10 shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)]">
                Reprendre ma session
            </Link>
        </section>
    );
}
