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
        <section className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-6 mt-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 opacity-80">
                <Trophy className="w-4 h-4 text-slate-400" />
                Visionnés Récemment
            </h3>

            <div className="space-y-3">
                {recentValids.slice(0, 3).map((progress) => (
                    <div key={progress.course_id} className="flex items-start gap-3 bg-[#111] p-3 rounded-xl border border-white/5 group hover:border-magic-gold/20 transition-colors">
                        <div className="mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-magic-gold/70 group-hover:text-magic-gold transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                                {progress.courses?.title || "Formation terminée"}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                                Le {new Date(progress.completed_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
