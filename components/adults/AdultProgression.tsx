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
        <section className="bg-gradient-to-br from-[#111] to-black border border-white/10 hover:border-magic-gold/20 transition-colors rounded-2xl p-6 sticky top-8 shadow-2xl relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-magic-gold/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-magic-gold/10 transition-colors"></div>

            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3 relative z-10">
                <Award className="w-5 h-5 text-magic-gold" />
                Progression Globale
            </h3>

            <div className="text-center mb-6 relative z-10">
                <div className="text-4xl font-black text-white mb-2 font-serif group-hover:text-magic-gold transition-colors duration-500">
                    {validatedCount} <span className="text-lg text-slate-500 font-sans font-medium">/ {totalCourses}</span>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Formations Validées</div>
            </div>

            <div className="relative h-2.5 w-full bg-black/50 border border-white/5 rounded-full overflow-hidden mb-6 shadow-inner z-10">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-magic-gold rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                >
                    <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/30 to-transparent animate-pulse"></div>
                </div>
            </div>

            <div className="bg-magic-gold/5 border border-magic-gold/10 rounded-xl p-4 flex gap-3 items-start mb-6 relative z-10">
                <Zap className="w-4 h-4 text-magic-gold shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300 font-light leading-relaxed">
                    Votre parcours s'enrichit. Continuez à visionner les modules pour débloquer de nouveaux secrets.
                </p>
            </div>

            <Link href="/dashboard/program" className="block w-full text-center py-3 text-xs font-bold text-black uppercase tracking-widest bg-magic-gold hover:bg-yellow-400 rounded-xl transition-all shadow-[0_0_15px_rgba(238,195,67,0.1)] hover:shadow-[0_0_25px_rgba(238,195,67,0.3)] hover:-translate-y-0.5 relative z-10">
                Reprendre ma session
            </Link>
        </section>
    );
}
