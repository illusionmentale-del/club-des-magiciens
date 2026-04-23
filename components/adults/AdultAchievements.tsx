import { CheckCircle2, Trophy } from "lucide-react";

type LibraryProgress = {
    course_id: string;
    completed_at: string;
    courses: {
        title: string;
    } | null;
};

export default function AdultAchievements({ recentValids }: { recentValids: any[] }) {
    if (!recentValids || recentValids.length === 0) return null;

    return (
        <section className="bg-transparent border-t border-white/10 p-6 mt-8 relative overflow-hidden group">
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-[0.15em] mb-6 flex items-center gap-3 opacity-90 relative z-10">
                <Trophy className="w-5 h-5 text-magic-royal" />
                Visionnés Récemment
            </h3>

            <div className="space-y-4 mb-8 relative z-10">
                {recentValids.slice(0, 3).map((progress) => (
                    <div key={progress.course_id} className="flex items-start gap-4 bg-transparent p-4 border-b border-white/5 hover:bg-white/[0.02] hover:border-magic-royal/30 transition-all duration-300 group/item">
                        <div className="mt-1">
                            <CheckCircle2 className="w-5 h-5 text-magic-royal/50 group-hover/item:text-magic-royal transition-all duration-300" />
                        </div>
                        <div>
                            <p className="text-sm font-serif font-bold text-slate-300 line-clamp-1 group-hover/item:text-white transition-colors duration-300">
                                {progress.courses?.title || "Formation terminée"}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1.5 font-light">
                                Le {new Date(progress.completed_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <a href="/dashboard/achievements" className="w-full relative z-10 flex items-center justify-center gap-2 py-3.5 px-4 rounded-sm border border-white/10 hover:border-magic-royal hover:text-magic-royal bg-transparent transition-all duration-300 text-xs font-bold text-slate-300 uppercase tracking-[0.15em]">
                <Trophy className="w-4 h-4 text-magic-royal" />
                Mon Journal Magique
            </a>
        </section>
    );
}
