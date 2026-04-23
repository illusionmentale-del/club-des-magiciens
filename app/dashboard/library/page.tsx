import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Play, Star, CheckCircle, Trophy, BookOpen } from "lucide-react";
import BackButton from "@/components/BackButton";

export default async function AdultLibraryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile || (!profile.has_adults_access && profile.role !== 'admin')) {
        redirect("/kids");
    }

    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7) + 1;

    // 2. Fetch All Items
    const { data: unlockedItems } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "adults")
        .is('sales_page_url', null)
        .lte("week_number", currentWeek)
        .order("week_number", { ascending: false });

    // 3. Fetch Settings for labels
    const { data: settings } = await supabase.from("settings").select("*");
    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    let uiLabelsMap: Record<string, string> = {
        page_videos_title: "Les Vidéos"
    };

    if (settingsMap["adult_ui_labels"]) {
        try {
            uiLabelsMap = { ...uiLabelsMap, ...JSON.parse(settingsMap["adult_ui_labels"]) };
        } catch (e) {
            console.error("Failed to parse adult_ui_labels", e);
        }
    }

    // Group items by week
    const weeksData: Record<number, any[]> = {};
    if (unlockedItems) {
        unlockedItems.forEach(item => {
            if (!item.week_number) return;
            if (!weeksData[item.week_number]) weeksData[item.week_number] = [];
            weeksData[item.week_number].push(item);
        });
    }

    // Generate List of Weeks
    const displayWeeks = [];
    const SHOW_FUTURE_WEEKS = 4;

    // Affiche les semaines dans l'ordre chronologique (1..N)
    const targetWeek = currentWeek + SHOW_FUTURE_WEEKS;
    for (let i = 1; i <= targetWeek; i++) {
        displayWeeks.push(i);
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-32 font-sans overflow-hidden relative selection:bg-magic-royal/30">

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10">
                <BackButton />
                {/* Header (Homogenized with Home) */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 mb-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-magic-royal mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-magic-royal" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le QG de la Magie</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight mt-4">
                            {uiLabelsMap.page_videos_title || "Les Vidéos"}
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            Retrouvez ici votre parcours d'apprentissage de la magie.
                        </p>
                    </div>

                    {/* Resume Button */}
                    {(weeksData[currentWeek] && weeksData[currentWeek].length > 0) && (
                        <Link 
                            href={`/watch/${weeksData[currentWeek][0].id}`}
                            className="border border-magic-royal text-magic-royal hover:bg-magic-royal hover:text-black px-8 py-4 rounded-none font-serif uppercase tracking-widest text-sm transition-all flex items-center gap-3 w-full md:w-auto mt-6 md:mt-0 justify-center group"
                        >
                            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Reprendre ma formation
                        </Link>
                    )}
                </header>

                {/* Missions List */}
                <div className="space-y-6">
                    {displayWeeks.map(week => {
                        const isLocked = week > currentWeek;
                        const isCurrent = week === currentWeek;
                        const isCompleted = week < currentWeek;

                        const items = weeksData[week] || [];
                        const mainItem = items.find(i => i.is_main) || items[0];

                        return (
                            <div key={week} className="relative group">

                                <div
                                    className={`
                                    relative p-6 rounded-none border transition-all duration-300
                                    ${isLocked
                                            ? 'bg-black border-white/5 opacity-60'
                                            : isCurrent
                                                ? 'bg-black border-magic-royal shadow-2xl z-10'
                                                : 'bg-black border border-white/10 hover:border-magic-royal/50'
                                        }
                                `}
                                >
                                    {/* Status Indicator */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                        w-10 h-10 flex items-center justify-center font-bold text-sm border
                                        ${isLocked ? 'bg-black border-white/10 text-slate-400' : ''}
                                        ${isCurrent ? 'bg-magic-royal/10 border-magic-royal text-magic-royal shadow-lg' : ''}
                                        ${isCompleted ? 'bg-black text-white border-white/20' : ''}
                                    `}>
                                                {isLocked && <Lock className="w-4 h-4" />}
                                                {isCurrent && <Star className="w-5 h-5 fill-current animate-pulse" />}
                                                {isCompleted && <CheckCircle className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h2 className={`font-serif tracking-tight text-xl ${isLocked ? 'text-slate-500' : 'text-white'}`}>
                                                    Semaine {week}
                                                </h2>
                                                {isCurrent && <span className="text-[10px] text-magic-royal font-bold uppercase tracking-widest">En cours</span>}
                                                {isCompleted && <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Terminée</span>}
                                                {isLocked && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">À venir</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Preview */}
                                    {!isLocked ? (
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Thumbnail */}
                                            <div className="sm:w-1/3 aspect-video relative overflow-hidden bg-black border border-white/10">
                                                {mainItem?.thumbnail_url ? (
                                                    <Image src={mainItem.thumbnail_url} alt="" fill className="object-cover opacity-80" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-brand-surface"><Play className="w-8 h-8 text-white/20" /></div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h3 className="text-xl font-serif text-white mb-2">{mainItem?.title || "Mission Mystère"}</h3>
                                                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                                    {mainItem?.description || "Le secret n'a pas encore été révélé..."}
                                                </p>

                                                <div className="flex gap-2 mt-auto">
                                                    <Link
                                                        href={mainItem ? `/watch/${mainItem.id}` : '#'}
                                                        className={`
                                                    flex-1 items-center justify-center gap-2 px-4 py-2 text-xs font-serif uppercase tracking-widest transition-colors flex border
                                                    ${isCurrent ? 'border-magic-royal text-magic-royal hover:bg-magic-royal hover:text-black' : 'bg-black border-white/10 hover:border-white/30 text-white'}
                                                `}
                                                    >
                                                        <Play className="w-4 h-4" />
                                                        Voir
                                                    </Link>
                                                    {isCurrent && (
                                                        <div className="px-3 py-2 border border-magic-royal/20 text-magic-royal">
                                                            <Trophy className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-brand-bg/30 rounded-lg border border-dashed border-white/10 flex items-center justify-center gap-2 text-slate-400">
                                            <Lock className="w-4 h-4" />
                                            <span className="text-sm font-mono uppercase">Contenu Classifié</span>
                                        </div>
                                    )}

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
