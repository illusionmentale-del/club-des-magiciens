import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Play, Star, CheckCircle, Trophy, BookOpen, GraduationCap, Search, ArrowRight } from "lucide-react";
import SearchInput from "@/components/kids/SearchInput";
import { FadeInUp } from "@/components/adults/MotionWrapper";

export default async function KidsProgramPage({ searchParams }: { searchParams: Promise<{ q?: string, type?: string }> }) {
    const sParams = await searchParams;
    const query = sParams.q?.toLowerCase() || "";
    const typeFilter = sParams.type || "";
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
    const currentWeek = Math.floor(diffDays / 7) + 5;

    // 2. Fetch All Items (Filtered locally to accurately process missing week_numbers)
    const { data: allItems } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "kids")
        .neq("type", "atelier")
        .is('sales_page_url', null)
        .is('public_slug', null)
        .order("week_number", { ascending: false })
        .order("position", { ascending: true })
        .order("created_at", { ascending: false });

    const unlockedItems = allItems?.filter(item => {
        if (item.week_number && item.week_number > currentWeek) return false;
        if (item.published_at && new Date(item.published_at) > new Date()) return false;
        return true;
    });

    const indexItems: any[] = [];
    const weeksData: Record<number, any[]> = {};

    if (unlockedItems) {
        unlockedItems.forEach(item => {
            if (query || typeFilter) {
                let matchesQuery = true;
                if (query) {
                    const matchesTitle = item.title?.toLowerCase().includes(query);
                    const matchesDesc = item.description?.toLowerCase().includes(query);
                    const matchesTags = item.tags?.some((tag: string) => tag.toLowerCase().includes(query));
                    matchesQuery = Boolean(matchesTitle || matchesDesc || matchesTags);
                }
                
                let matchesType = true;
                if (typeFilter) {
                    matchesType = item.type === typeFilter;
                }
                
                if (!matchesQuery || !matchesType) return;
            }

            indexItems.push(item);
            if (item.week_number) {
                if (!weeksData[item.week_number]) weeksData[item.week_number] = [];
                weeksData[item.week_number].push(item);
            }
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
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 pb-32 font-sans overflow-hidden relative selection:bg-brand-purple/30">

            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-0 left-0 w-full md:w-1/2 h-[50vh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/10 via-[#000000]/0 to-[#000000]/0 pointer-events-none z-0"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <FadeInUp delay={0.1}>
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-brand-purple mb-2">
                                <Star className="w-5 h-5 fill-current animate-pulse text-brand-purple" />
                                <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
                                La <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-indigo-500">Formation</span>
                            </h1>
                            <p className="text-[#86868b] mt-3 text-lg md:text-xl font-light">
                                Retrouve ici ton parcours d'apprentissage de la magie.
                            </p>
                        </div>

                        {/* Resume Button */}
                        {(weeksData[currentWeek] && weeksData[currentWeek].length > 0) && (
                            <Link 
                                href={`/watch/${weeksData[currentWeek][0].id}`}
                                className="bg-[#1c1c1e] hover:bg-brand-purple text-white px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-sm transition-all flex items-center gap-3 w-full md:w-auto mt-6 md:mt-0 justify-center group shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] border border-white/5 hover:border-brand-purple"
                            >
                                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Reprendre
                            </Link>
                        )}
                    </header>
                </FadeInUp>

                {/* Search Bar */}
                <FadeInUp delay={0.2}>
                    <div className="w-full relative z-20 space-y-6">
                        <SearchInput showTypeFilter={true} />
                    </div>
                </FadeInUp>

                {/* Main Views Container */}
                <FadeInUp delay={0.3}>
                    <div className="space-y-6">
                        
                        {(query || typeFilter) ? (
                            <div className="space-y-4 pb-12">
                                <h2 className="text-sm font-semibold text-[#86868b] uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Search className="w-4 h-4" /> RÉSULTATS DE RECHERCHE
                                </h2>
                                {indexItems.length > 0 ? indexItems.map(item => (
                                    <Link key={item.id} href={`/watch/${item.id}`} className="flex flex-col sm:flex-row gap-5 bg-[#1c1c1e] hover:bg-[#2c2c2e]/60 p-4 rounded-[24px] border border-white/5 hover:border-white/10 transition-all group shadow-xl hover:shadow-2xl">
                                        <div className="w-full sm:w-64 md:w-56 aspect-video relative rounded-[16px] overflow-hidden bg-black shrink-0 border border-white/5">
                                            {item.thumbnail_url ? (
                                                <Image src={item.thumbnail_url} alt="" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><Play className="w-8 h-8 text-[#86868b]" /></div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-12 h-12 bg-brand-purple/90 rounded-full flex items-center justify-center shadow-lg border border-white/20 scale-90 group-hover:scale-100 transition-all duration-300">
                                                    <Play className="w-5 h-5 text-white ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center py-2 h-full">
                                            <h3 className="text-xl md:text-2xl font-semibold text-[#f5f5f7] mb-2 leading-tight group-hover:text-brand-purple transition-colors">{item.title}</h3>
                                            <p className="text-sm text-[#86868b] font-light line-clamp-2 md:line-clamp-3 mb-4">{item.description}</p>
                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`bg-white/5 text-[#86868b] border border-white/10 text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1 uppercase tracking-widest`}>
                                                        {item.type === 'pdf' ? 'Document' : item.type === 'activity' ? 'Activité' : item.type === 'game' ? 'Jeu' : item.type === 'illusion' ? 'Illusion' : 'Vidéo'}
                                                    </span>
                                                    {item.is_main && <span className="bg-brand-purple/10 text-brand-purple border border-brand-purple/20 text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1 uppercase tracking-widest"><Star className="w-3 h-3 fill-current" /> Principal</span>}
                                                    {item.week_number && <span className="text-[10px] text-[#86868b] font-mono font-bold uppercase">Semaine {item.week_number}</span>}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-brand-purple uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    {item.type === 'pdf' ? 'Consulter' : (item.type === 'activity' || item.type === 'game') ? 'Découvrir' : 'Visionner'} <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="text-center py-20 text-[#86868b] bg-[#1c1c1e] rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-[#2c2c2e]/50 rounded-[16px] flex items-center justify-center mb-6">
                                            <Search className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">Aucun résultat trouvé</p>
                                        <p className="text-sm font-light">Nous n'avons rien trouvé correspondant à vos critères dans la formation.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {displayWeeks.map(week => {
                                    const isLocked = week > currentWeek;
                                    const isCurrent = week === currentWeek;
                                    const isCompleted = week < currentWeek;
            
                                    const items = weeksData[week] || [];
                                    
                                    return (
                                        <div key={week} className="relative group">
                                            {!isLocked && (
                                                <div className={`absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-[32px] blur-lg transition duration-1000 pointer-events-none ${isCurrent ? 'opacity-20 group-hover:opacity-30' : 'opacity-0 group-hover:opacity-20'}`}></div>
                                            )}
                                            <div
                                                className={`
                                                relative p-8 rounded-[32px] border transition-all duration-500
                                                ${isLocked
                                                        ? 'bg-[#000000] border-white/5 opacity-60'
                                                        : isCurrent
                                                            ? 'bg-[#1c1c1e] border-brand-purple/50 shadow-xl scale-[1.01] z-10'
                                                            : 'bg-[#1c1c1e] border-white/5 hover:border-white/10 shadow-lg'
                                                    }
                                            `}
                                            >
                                                {/* Status Indicator */}
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`
                                                    w-12 h-12 rounded-[16px] flex items-center justify-center font-bold text-sm
                                                    ${isLocked ? 'bg-[#2c2c2e]/50 border border-white/5 text-[#86868b]' : ''}
                                                    ${isCurrent ? 'bg-brand-purple text-white shadow-lg' : ''}
                                                    ${isCompleted ? 'bg-green-500/10 text-green-400 border border-green-500/20' : ''}
                                                `}>
                                                            {isLocked && <Lock className="w-5 h-5" />}
                                                            {isCurrent && <Star className="w-6 h-6 fill-current animate-pulse" />}
                                                            {isCompleted && <CheckCircle className="w-6 h-6" />}
                                                        </div>
                                                        <div>
                                                            <h2 className={`font-semibold uppercase tracking-tight text-2xl ${isLocked ? 'text-[#86868b]' : 'text-[#f5f5f7]'}`}>
                                                                Semaine {week}
                                                            </h2>
                                                            {isCurrent && <span className="text-[10px] text-brand-purple font-bold uppercase tracking-widest">En cours</span>}
                                                            {isCompleted && <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Terminée</span>}
                                                            {isLocked && <span className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest">À venir</span>}
                                                        </div>
                                                    </div>
                                                </div>
            
                                                {/* Content Preview */}
                                                {!isLocked ? (
                                                    <div className="flex flex-col gap-4">
                                                        {items.sort((a,b) => (a.position || 0) - (b.position || 0)).map((item) => (
                                                            <div key={item.id} className="flex flex-col sm:flex-row gap-5 bg-[#000000] p-4 rounded-[24px] border border-white/5 hover:bg-[#2c2c2e]/50 hover:border-white/10 transition-colors group/item">
                                                                {/* Thumbnail */}
                                                                <div className="sm:w-1/3 aspect-video relative rounded-[16px] overflow-hidden bg-black border border-white/5 shrink-0">
                                                                    {item.thumbnail_url ? (
                                                                        <Image src={item.thumbnail_url} alt="" fill className="object-cover opacity-80 group-hover/item:opacity-100 transition-opacity" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-[#2c2c2e]/50"><Play className="w-8 h-8 text-[#86868b]" /></div>
                                                                    )}
                                                                </div>
            
                                                                {/* Info */}
                                                                <div className="flex-1 flex flex-col justify-center">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <h3 className="text-xl font-semibold text-[#f5f5f7] tracking-tight">{item.title || "Mission Mystère"}</h3>
                                                                        {item.is_main && <span className="bg-brand-purple/10 text-brand-purple border border-brand-purple/20 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">Principal</span>}
                                                                    </div>
                                                                    <p className="text-sm text-[#86868b] font-light line-clamp-2 mb-4">
                                                                        {item.description || "Le secret n'a pas encore été révélé..."}
                                                                    </p>
            
                                                                    <div className="flex gap-3 mt-auto">
                                                                        <Link
                                                                            href={`/watch/${item.id}`}
                                                                            className={`
                                                                                flex-1 items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all flex
                                                                                ${isCurrent && item.is_main ? 'bg-brand-purple text-white hover:bg-brand-purple/80 shadow-lg' : 'bg-[#2c2c2e]/50 border border-white/5 hover:bg-white/10 text-white'}
                                                                            `}
                                                                        >
                                                                            <Play className="w-4 h-4" />
                                                                            Voir
                                                                        </Link>
                                                                        {isCurrent && item.is_main && (
                                                                            <div className="px-4 py-3 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple flex items-center justify-center">
                                                                                <Trophy className="w-4 h-4" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {items.length === 0 && (
                                                            <div className="text-center py-8 text-[#86868b] border border-dashed border-white/10 rounded-[24px]">
                                                                Vide... Reviens plus tard pour de nouveaux secrets !
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="p-6 bg-[#000000] rounded-[24px] border border-dashed border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3 text-[#86868b]">
                                                        <Lock className="w-5 h-5" />
                                                        <span className="text-sm font-semibold uppercase tracking-widest">Contenu Classifié</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </FadeInUp>
            </div>
        </div>
    );
}
