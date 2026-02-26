import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle, GraduationCap, ShoppingBag, ArrowRight, Lock, Star, Play } from "lucide-react";

export default async function ProgramPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch User Profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (!profile || !profile.has_adults_access) {
        redirect("/kids");
    }
    const isAdmin = profile.role === 'admin';

    // 2. Fetch all courses, user purchases & settings
    const [coursesRes, purchasesRes, settingsRes] = await Promise.all([
        supabase.from("courses").select("*").neq('audience', 'kids').order("created_at", { ascending: false }),
        supabase.from("user_purchases").select("course_id").eq("user_id", user.id),
        supabase.from("settings").select("*").eq("key", "adult_home_main_programs")
    ]);

    const courses = coursesRes.data || [];
    const purchasedCourseIds = new Set(purchasesRes.data?.map(p => p.course_id) || []);

    // 3. Logic: Define "Continuous Training" vs "Isolated Purchases"
    const unlockedCourses = courses.filter(c => isAdmin || purchasedCourseIds.has(c.id) || c.price === 'Gratuit' || !c.price);

    // Read the admin configuration for main programs
    const mainProgramsSetting = settingsRes.data?.[0]?.value;
    let configuredMainProgramIds: string[] = [];

    if (mainProgramsSetting) {
        try {
            configuredMainProgramIds = JSON.parse(mainProgramsSetting);
        } catch (e) {
            console.error("Failed to parse adult_home_main_programs config", e);
        }
    }

    let mainPrograms = [];

    if (configuredMainProgramIds && configuredMainProgramIds.length > 0) {
        mainPrograms = unlockedCourses.filter(c => configuredMainProgramIds.includes(c.id));
    } else {
        // Fallback: If nothing is configured in the admin, take the oldest unlocked course 
        // (usually the main program like Le Club des Magiciens)
        if (unlockedCourses.length > 0) {
            mainPrograms.push(unlockedCourses[unlockedCourses.length - 1]);
        }
    }

    const mainProgramIds = new Set(mainPrograms.map(p => p.id));
    const isolatedPurchases = unlockedCourses.filter(c => !mainProgramIds.has(c.id));

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans selection:bg-magic-gold/30">
            {/* Ambient Background Lights (Adult Theme) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-magic-gold/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-magic-gold mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-magic-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le QG de la Magie</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 font-serif">
                            Ma <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-gold to-orange-400">Formation</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-light max-w-2xl">
                            Retrouvez ici l'ensemble de vos accès : votre programme de formation principal ainsi que vos achats à la carte.
                        </p>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto space-y-16">

                    {/* SECTION 1: LA FORMATION CONTINUE */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-white uppercase tracking-wider mb-8">
                            <GraduationCap className="w-6 h-6 text-magic-gold" />
                            La Formation Continue
                        </h2>

                        {mainPrograms.length > 0 ? (
                            <div className="space-y-6">
                                {mainPrograms.map(program => (
                                    <div key={program.id} className="relative group">
                                        {/* Subtitle glow effect on hover */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-magic-gold to-orange-500 rounded-3xl opacity-0 blur-lg transition duration-1000 group-hover:opacity-30 pointer-events-none"></div>

                                        <div className="relative p-6 rounded-2xl border transition-all duration-300 bg-magic-card border-magic-gold/30 hover:shadow-[0_0_30px_rgba(238,195,67,0.15)] scale-[1.01] hover:scale-[1.02] z-10">

                                            {/* Status / Title Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-magic-gold/90 text-black shadow-lg">
                                                        <Star className="w-5 h-5 fill-current animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <h2 className="font-bold uppercase tracking-tight text-xl text-white">
                                                            Formation Continue
                                                        </h2>
                                                        <span className="text-[10px] text-magic-gold font-bold uppercase tracking-widest">En cours</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Preview */}
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                {/* Thumbnail */}
                                                <div className="sm:w-1/3 aspect-video relative rounded-lg overflow-hidden bg-black border border-white/10 shrink-0">
                                                    {program.thumbnail_url ? (
                                                        <img src={program.thumbnail_url} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#111]"><PlayCircle className="w-12 h-12 text-white/20" /></div>
                                                    )}
                                                    {/* Play Overlay */}
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                                        <PlayCircle className="w-12 h-12 text-magic-gold/80 group-hover:text-magic-gold transition-colors duration-500 group-hover:scale-110 transform drop-shadow-lg" />
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <h3 className="text-2xl font-black text-white font-serif mb-2 group-hover:text-magic-gold transition-colors">
                                                        {program.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-400 line-clamp-2 md:line-clamp-3 mb-6 font-light">
                                                        {program.description || "Suivez pas à pas votre cursus pour maîtriser de nouvelles techniques."}
                                                    </p>

                                                    <div className="flex gap-3 mt-auto">
                                                        <Link
                                                            href={`/watch/${program.id}`}
                                                            className="flex-1 items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors flex bg-gradient-to-r from-magic-gold to-orange-500 text-black hover:opacity-90 shadow-lg"
                                                        >
                                                            <Play className="w-4 h-4 fill-black" />
                                                            Reprendre
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center">
                                <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">Aucune formation continue active</h3>
                                <p className="text-slate-400 text-sm font-light mb-6">Vous ne participez à aucun programme principal structuré pour le moment.</p>
                                <Link href="/dashboard/catalog" className="inline-flex items-center gap-2 text-magic-gold font-bold hover:underline">
                                    Découvrir les programmes <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </section>


                    {/* SECTION 2: ACHATS ISOLÉS */}
                    {isolatedPurchases.length > 0 && (
                        <section className="pt-8 border-t border-white/5 pb-16">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase tracking-wider mb-8">
                                <ShoppingBag className="w-5 h-5 text-slate-500" />
                                Mes Achats Isolés
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {isolatedPurchases.map((course) => (
                                    <Link
                                        key={course.id}
                                        href={`/watch/${course.id}`}
                                        className="group relative bg-[#111] border border-white/10 hover:border-magic-gold/40 rounded-2xl overflow-hidden transition-all flex flex-col shadow-lg hover:shadow-[0_0_20px_rgba(238,195,67,0.1)]"
                                    >
                                        <div className="aspect-video bg-black relative overflow-hidden">
                                            {course.thumbnail_url ? (
                                                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center shrink-0">
                                                    <PlayCircle className="w-8 h-8 text-white/30" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-transparent z-10"></div>
                                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                                <div className="w-12 h-12 rounded-full bg-magic-gold/90 text-black flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                                                    <Play className="w-5 h-5 ml-1" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 flex flex-1 flex-col justify-between relative z-10">
                                            <div>
                                                <h3 className="font-bold text-sm mb-2 text-white line-clamp-2 group-hover:text-magic-gold transition-colors">
                                                    {course.title}
                                                </h3>
                                                <p className="text-xs text-slate-400 line-clamp-2 font-light">
                                                    {course.description}
                                                </p>
                                            </div>

                                            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors">
                                                <span>Optionnel</span>
                                                <span className="flex items-center gap-1 text-magic-gold">
                                                    Regarder <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
