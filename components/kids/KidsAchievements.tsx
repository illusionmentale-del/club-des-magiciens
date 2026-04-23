import { CheckCircle, Trophy } from "lucide-react";

type LibraryProgress = {
    item_id: string;
    completed_at: string;
    library_items: {
        title: string;
    } | null; // Join result
};

export default function KidsAchievements({ recentValids, completedQuests }: { recentValids: any[], completedQuests?: any[] }) {
    if (!recentValids?.length && !completedQuests?.length) return null;

    return (
        <section className="bg-[#100b1a] border border-white/10 rounded-2xl p-6 mt-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-gold" />
                Derniers Succès
            </h3>

            <div className="space-y-3">
                {recentValids.slice(0, 3).map((progress) => (
                    <div key={progress.item_id} className="flex items-center gap-3 bg-brand-bg/50 p-3 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white line-clamp-1">{progress.library_items?.title || "Mission Secrète"}</p>
                            <p className="text-[10px] text-brand-text-muted uppercase tracking-wide">
                                Validé le {new Date(progress.completed_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                ))}
                
                {completedQuests && completedQuests.slice(0, 3).map((q: any) => (
                    <div key={Math.random()} className="flex items-center gap-3 bg-brand-bg/50 p-3 rounded-xl border border-green-500/20">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                            <Trophy className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white line-clamp-1">{q.gamification_quests?.title || "Quête Accompli"}</p>
                            <p className="text-[10px] text-green-400 font-bold uppercase tracking-wide">
                                + {q.gamification_quests?.reward_xp} XP / Éclats
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
