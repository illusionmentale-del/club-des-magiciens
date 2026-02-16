import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Play, Star, CheckCircle, Trophy, BookOpen } from "lucide-react";

export default async function KidsProgramPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Calculate Current Week
    const { data: profile } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", user.id)
        .single();

    if (!profile) return null;

    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7) + 1;

    // 2. Fetch All Items
    const { data: unlockedItems } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "kids")
        .lte("week_number", currentWeek)
        .order("week_number", { ascending: false });

    // Group items by week
    const weeksData: Record<number, any[]> = {};
    if (unlockedItems) {
        unlockedItems.forEach(item => {
            if (!item.week_number) return;
            if (!weeksData[item.week_number]) weeksData[item.week_number] = [];
            weeksData[item.week_number].push(item);
        });
    }

    // Generate List of Weeks (1 to CurrentWeek + future preview)
    const displayWeeks = [];
    const SHOW_FUTURE_WEEKS = 4;
    for (let i = currentWeek + SHOW_FUTURE_WEEKS; i >= 1; i--) {
        displayWeeks.push(i);
    }

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans overflow-hidden relative selection:bg-brand-purple/30">

            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-blue/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Header */}
            <header className="max-w-4xl mx-auto mb-12 pt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest mb-4">
                    <BookOpen className="w-4 h-4" />
                    Archives du Club
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                    Les Missions
                </h1>
                <p className="text-brand-text-muted">Retrouve ici tous les secrets que tu as débloqués.</p>
            </header>

            {/* Missions List */}
            <div className="max-w-3xl mx-auto space-y-6">
                {displayWeeks.map(week => {
                    const isLocked = week > currentWeek;
                    const isCurrent = week === currentWeek;
                    const isCompleted = week < currentWeek;

                    const items = weeksData[week] || [];
                    const mainItem = items.find(i => i.is_main) || items[0];

                    return (
                        <div
                            key={week}
                            className={`
                                relative p-6 rounded-2xl border transition-all duration-300
                                ${isLocked
                                    ? 'bg-brand-bg/50 border-white/5 opacity-60'
                                    : isCurrent
                                        ? 'bg-brand-card border-brand-purple shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-[1.02] z-10'
                                        : 'bg-brand-surface border-brand-border hover:bg-brand-card'
                                }
                            `}
                        >
                            {/* Status Indicator */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                        ${isLocked ? 'bg-brand-bg border border-white/10 text-brand-text-muted' : ''}
                                        ${isCurrent ? 'bg-brand-purple text-white shadow-lg' : ''}
                                        ${isCompleted ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' : ''}
                                    `}>
                                        {isLocked && <Lock className="w-4 h-4" />}
                                        {isCurrent && <Star className="w-5 h-5 fill-current animate-pulse" />}
                                        {isCompleted && <CheckCircle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h2 className={`font-bold uppercase tracking-tight text-lg ${isLocked ? 'text-brand-text-muted' : 'text-white'}`}>
                                            Semaine {week}
                                        </h2>
                                        {isCurrent && <span className="text-[10px] text-brand-purple font-bold uppercase tracking-widest">En cours</span>}
                                        {isCompleted && <span className="text-[10px] text-brand-green font-bold uppercase tracking-widest">Terminée</span>}
                                        {isLocked && <span className="text-[10px] text-brand-text-muted font-bold uppercase tracking-widest">À venir</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Content Preview */}
                            {!isLocked ? (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Thumbnail */}
                                    <div className="sm:w-1/3 aspect-video relative rounded-lg overflow-hidden bg-black border border-white/10">
                                        {mainItem?.thumbnail_url ? (
                                            <Image src={mainItem.thumbnail_url} alt="" fill className="object-cover opacity-80" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-brand-surface"><Play className="w-8 h-8 text-white/20" /></div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-xl font-bold text-white mb-2">{mainItem?.title || "Mission Mystère"}</h3>
                                        <p className="text-sm text-brand-text-muted line-clamp-2 mb-4">
                                            {mainItem?.description || "Le secret n'a pas encore été révélé..."}
                                        </p>

                                        <div className="flex gap-2 mt-auto">
                                            <Link
                                                href={mainItem ? `/watch/${mainItem.id}` : '#'}
                                                className={`
                                                    flex-1 items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors flex
                                                    ${isCurrent ? 'bg-brand-purple text-white hover:bg-brand-purple/90' : 'bg-brand-surface/50 border border-brand-border hover:bg-white/10 text-white'}
                                                `}
                                            >
                                                <Play className="w-4 h-4" />
                                                Voir
                                            </Link>
                                            {isCurrent && (
                                                <div className="px-3 py-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold">
                                                    <Trophy className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-brand-bg/30 rounded-lg border border-dashed border-white/10 flex items-center justify-center gap-2 text-brand-text-muted">
                                    <Lock className="w-4 h-4" />
                                    <span className="text-sm font-mono uppercase">Contenu Classifié</span>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
