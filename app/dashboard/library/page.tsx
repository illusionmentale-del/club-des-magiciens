import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Play, Star, CheckCircle, Trophy } from "lucide-react";
import BackButton from "@/components/BackButton";
import { FadeInUp, BentoHoverEffect } from "@/components/adults/MotionWrapper";

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

    const targetWeek = currentWeek + SHOW_FUTURE_WEEKS;
    for (let i = 1; i <= targetWeek; i++) {
        displayWeeks.push(i);
    }

    return (
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 pb-32 font-sans overflow-hidden relative selection:bg-brand-purple/30">
            {/* Ambient Background Lights (Kids Theme) */}
            <div className="absolute top-0 left-0 w-full md:w-1/2 h-[50vh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/10 via-[#000000]/0 to-[#000000]/0 pointer-events-none z-0"></div>
            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10">
                <BackButton />
                {/* Header */}
                <FadeInUp delay={0.1}>
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 mb-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-[#86868b] mb-2">
                                <Star className="w-5 h-5 text-[#f5f5f7]" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Le QG de la Magie</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#f5f5f7] mt-4">
                                {uiLabelsMap.page_videos_title || "Les Vidéos"}
                            </h1>
                            <p className="text-[#86868b] mt-3 text-xl font-light">
                                Retrouvez ici votre parcours d'apprentissage de la magie.
                            </p>
                        </div>

                        {/* Resume Button */}
                        {(weeksData[currentWeek] && weeksData[currentWeek].length > 0) && (
                            <Link 
                                href={`/watch/${weeksData[currentWeek][0].id}`}
                                className="bg-brand-purple text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] px-8 py-4 rounded-full font-medium transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-3 w-full md:w-auto mt-6 md:mt-0 justify-center group"
                            >
                                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                Reprendre ma formation
                            </Link>
                        )}
                    </header>
                </FadeInUp>

                {/* Missions List */}
                <div className="space-y-6">
                    {displayWeeks.map((week, index) => {
                        const isLocked = week > currentWeek;
                        const isCurrent = week === currentWeek;
                        const isCompleted = week < currentWeek;

                        const items = weeksData[week] || [];
                        const mainItem = items.find(i => i.is_main) || items[0];

                        return (
                            <FadeInUp delay={0.2 + (index * 0.05)} key={week}>
                                <div className="relative group">

                                    <div
                                        className={`
                                        relative p-6 md:p-8 rounded-[32px] border transition-all duration-300
                                        ${isLocked
                                                ? 'bg-[#000000] border-white/5 opacity-60'
                                                : isCurrent
                                                    ? 'bg-[#1c1c1e] border-white/20 shadow-2xl z-10'
                                                    : 'bg-[#1c1c1e] border-transparent hover:border-brand-purple/30'
                                            }
                                    `}
                                    >
                                        {/* Status Indicator */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`
                                            w-12 h-12 flex items-center justify-center font-bold text-lg rounded-full border
                                            ${isLocked ? 'bg-[#1c1c1e] border-white/5 text-[#86868b]' : ''}
                                            ${isCurrent ? 'bg-white text-black border-transparent shadow-lg' : ''}
                                            ${isCompleted ? 'bg-[#2c2c2e] text-[#f5f5f7] border-white/10' : ''}
                                        `}>
                                                    {isLocked && <Lock className="w-5 h-5" />}
                                                    {isCurrent && <Star className="w-6 h-6 fill-current animate-pulse" />}
                                                    {isCompleted && <CheckCircle className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h2 className={`font-semibold tracking-tight text-2xl ${isLocked ? 'text-[#86868b]' : 'text-[#f5f5f7]'}`}>
                                                        Semaine {week}
                                                    </h2>
                                                    {isCurrent && <span className="text-[10px] text-black bg-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest mt-1 inline-block">En cours</span>}
                                                    {isCompleted && <span className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mt-1 inline-block">Terminée</span>}
                                                    {isLocked && <span className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mt-1 inline-block">À venir</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Preview */}
                                        {!isLocked ? (
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Thumbnail */}
                                                <BentoHoverEffect className="md:w-1/3">
                                                    <div className="w-full aspect-video relative overflow-hidden rounded-[24px] bg-black border border-white/5 shadow-md">
                                                        {mainItem?.thumbnail_url ? (
                                                            <Image src={mainItem.thumbnail_url} alt="" fill className="object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-[0.16,1,0.3,1]" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-[#2c2c2e]"><Play className="w-10 h-10 text-[#86868b]" /></div>
                                                        )}
                                                    </div>
                                                </BentoHoverEffect>

                                                {/* Info */}
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">{mainItem?.title || "Mission Mystère"}</h3>
                                                    <p className="text-base text-[#86868b] font-light leading-relaxed line-clamp-2 mb-6">
                                                        {mainItem?.description || "Le secret n'a pas encore été révélé..."}
                                                    </p>

                                                    <div className="flex gap-3 mt-auto">
                                                        <Link
                                                            href={mainItem ? `/watch/${mainItem.id}` : '#'}
                                                            className={`
                                                        flex-1 items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all flex border
                                                        ${isCurrent ? 'bg-brand-purple text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] shadow-md' : 'bg-transparent border-white/10 hover:border-white/30 text-[#f5f5f7] hover:bg-white/5'}
                                                    `}
                                                        >
                                                            <Play className="w-4 h-4 fill-current" />
                                                            Voir le contenu
                                                        </Link>
                                                        {isCurrent && (
                                                            <div className="px-4 py-3 rounded-full border border-white/20 text-[#f5f5f7] bg-white/5 flex items-center justify-center">
                                                                <Trophy className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-[#1c1c1e] rounded-[24px] border border-dashed border-white/10 flex items-center justify-center gap-3 text-[#86868b]">
                                                <Lock className="w-5 h-5" />
                                                <span className="text-sm font-medium tracking-wide uppercase">Contenu Classifié</span>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </FadeInUp>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
