import { CheckCircle, Trophy } from "lucide-react";

type LibraryProgress = {
    item_id: string;
    completed_at: string;
    library_items: {
        title: string;
    } | null; // Join result
};

export default function KidsAchievements({ recentValids }: { recentValids: any[] }) {
    if (!recentValids || recentValids.length === 0) return null;

    return (
        <section className="bg-brand-card/30 border border-brand-border/50 rounded-2xl p-6 mt-8">
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
            </div>
        </section>
    );
}
