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
        <section className="bg-[#1c1c1e] border border-white/5 rounded-[32px] p-8 mt-8 shadow-xl hover:shadow-2xl hover:border-white/10 transition-all duration-500 ease-[0.16,1,0.3,1]">
            <h3 className="text-sm font-semibold text-[#86868b] uppercase tracking-widest mb-6 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-brand-gold" />
                Derniers Succès
            </h3>

            <div className="space-y-4">
                {recentValids.slice(0, 3).map((progress) => (
                    <div key={progress.item_id} className="flex items-center gap-4 bg-[#2c2c2e]/30 p-4 rounded-[20px] border border-white/5 hover:bg-[#2c2c2e]/50 transition-colors">
                        <div className="w-10 h-10 rounded-[12px] bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-[15px] font-medium text-[#f5f5f7] line-clamp-1">{progress.library_items?.title || "Mission Secrète"}</p>
                            <p className="text-[10px] text-[#86868b] mt-1 font-light tracking-wide">
                                Validé le {new Date(progress.completed_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                ))}
                
                {completedQuests && completedQuests.slice(0, 3).map((q: any) => (
                    <div key={Math.random()} className="flex items-center gap-4 bg-[#2c2c2e]/30 p-4 rounded-[20px] border border-brand-gold/10 hover:bg-[#2c2c2e]/50 transition-colors">
                        <div className="w-10 h-10 rounded-[12px] bg-brand-gold/10 flex items-center justify-center shrink-0 border border-brand-gold/20">
                            <Trophy className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[15px] font-medium text-[#f5f5f7] line-clamp-1">{q.gamification_quests?.title || "Quête Accompli"}</p>
                            <p className="text-[10px] text-brand-gold font-medium uppercase tracking-widest mt-1">
                                + {q.gamification_quests?.reward_xp} XP / Éclats
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
