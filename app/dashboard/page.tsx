import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle, ArrowRight, Lock, BookOpen, Tv } from "lucide-react";
import Image from "next/image";
import AdultHomeHero from "@/components/adults/AdultHomeHero";
import AdultNewsFeed from "@/components/adults/AdultNewsFeed";
import AdultProgression from "@/components/adults/AdultProgression";
import AdultAchievements from "@/components/adults/AdultAchievements";

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // 2. Fetch User Profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (!profile || !profile.has_adults_access) {
        redirect("/kids");
    }

    const userName = profile.full_name || user.email?.split("@")[0] || "L'Illusionniste";
    const isAdmin = profile.role === 'admin';

    // 3. Fetch Data in Parallel
    const [
        coursesRes,
        purchasesRes,
        settingsRes,
        livesRes,
        validatedProgressionRes,
        recentValidsRes
    ] = await Promise.all([
        supabase.from("courses").select("*").neq('audience', 'kids').order("created_at", { ascending: false }),
        supabase.from("user_purchases").select("course_id").eq("user_id", user.id),
        supabase.from("settings").select("*"),
        supabase.from("lives").select("*").order("start_date", { ascending: true }),
        supabase.from("user_course_progress").select("*", { count: 'exact', head: true }).eq("user_id", user.id),
        supabase.from("user_course_progress").select("course_id, completed_at, courses(title)").eq("user_id", user.id).eq("is_completed", true).order("completed_at", { ascending: false }).limit(3)
    ]);

    const courses = coursesRes.data || [];
    const purchasedCourseIds = new Set(purchasesRes.data?.map(p => p.course_id) || []);
    const validatedCount = validatedProgressionRes.count || 0;
    const recentValids = recentValidsRes.data || [];

    // 4. Parse Adult Home Featured Config
    // Format: { title, description, image, link, buttonText, tag }
    const featuredConfigSetting = settingsRes.data?.find(s => s.key === 'adult_home_featured_config')?.value;
    let featuredConfig = undefined;
    if (featuredConfigSetting) {
        try {
            featuredConfig = typeof featuredConfigSetting === 'string'
                ? JSON.parse(featuredConfigSetting)
                : featuredConfigSetting;
        } catch (e) {
            console.error("Error parsing adult_home_featured_config", e);
        }
    }

    // Quick helper to determine if a course is unlocked
    const isUnlocked = (course: any) => isAdmin || purchasedCourseIds.has(course.id) || course.price === 'Gratuit' || !course.price;

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans selection:bg-magic-gold/30 overflow-hidden relative">

            {/* Ambient Premium Lighting */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-magic-gold/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Premium Header / Hero */}
            <header className="mb-12 max-w-7xl mx-auto relative z-10 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-1 bg-gradient-to-r from-magic-gold to-transparent"></div>
                            <span className="text-magic-gold text-sm font-semibold tracking-[0.2em] uppercase">Club des Magiciens</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 font-serif">
                            L'Actu du Club
                        </h1>
                        <p className="text-lg text-slate-400 font-light flex items-center gap-2">
                            Heureux de vous revoir, <span className="text-white font-medium border-b border-magic-gold/50 pb-0.5">{userName}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/program" className="hidden md:flex items-center gap-2 px-6 py-3 bg-magic-gold text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-magic-gold/20">
                            Continuer la formation <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto relative z-10 space-y-16">

                {/* HERO SECTION / ANNONCE A LA UNE */}
                {featuredConfig && featuredConfig.title && (
                    <AdultHomeHero config={featuredConfig} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* COLONNE GAUCHE (2/3) */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* NOUVEAUTÉS */}
                        <AdultNewsFeed items={courses.slice(0, 3).map(c => ({ ...c, type: 'course' }))} />

                        {/* Section: Vos Formations et Masterclass (Courses grid) */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase tracking-wider">
                                    <BookOpen className="w-5 h-5 text-magic-gold" />
                                    Toutes Vos Formations
                                </h2>
                                <Link href="/dashboard/catalog" className="text-sm font-bold text-slate-400 hover:text-magic-gold transition-colors uppercase tracking-widest hidden md:inline-block">
                                    Voir le catalogue complet
                                </Link>
                            </div>

                            {/* Simplified Grid to fit within the 2/3 column */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {courses.length > 0 ? courses.map((course) => {
                                    const unlocked = isUnlocked(course);
                                    const href = unlocked ? `/watch/${course.id}` : (course.sales_page_url || "#");

                                    return (
                                        <Link
                                            key={course.id}
                                            href={href}
                                            className={`group relative bg-black border ${unlocked ? 'border-magic-gold/20 hover:border-magic-gold/50' : 'border-white/5 opacity-80 hover:opacity-100'} rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(238,195,67,0.15)] flex flex-col`}
                                        >
                                            <div className="aspect-video bg-[#0a0a0f] relative overflow-hidden">
                                                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity`}></div>

                                                {/* Golden Ambient Glow for unlocked */}
                                                {unlocked && <div className="absolute inset-0 bg-magic-gold/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full blur-[80px] pointer-events-none group-hover:bg-magic-gold/10 transition-colors"></div>}

                                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                                    {unlocked ? (
                                                        <PlayCircle className="w-14 h-14 text-white/50 group-hover:text-magic-gold transition-colors group-hover:scale-110 duration-300 transform" />
                                                    ) : (
                                                        <Lock className="w-14 h-14 text-white/30 group-hover:text-red-400 transition-colors" />
                                                    )}
                                                </div>

                                                <div className="absolute top-4 right-4 z-20">
                                                    {unlocked ? (
                                                        <div className="bg-magic-gold text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-black/50">
                                                            Accessible
                                                        </div>
                                                    ) : (
                                                        <div className="bg-red-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                                                            Verrouillé
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-1 flex-col justify-between bg-gradient-to-b from-[#111] to-black border-t border-white/5">
                                                <div>
                                                    <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-magic-gold transition-colors text-white line-clamp-2">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 line-clamp-2 font-light leading-relaxed">
                                                        {course.description}
                                                    </p>
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider">
                                                    <span className="text-slate-500">
                                                        Module
                                                    </span>
                                                    {unlocked ? (
                                                        <span className="flex items-center gap-1 text-magic-gold">
                                                            Visionner <ArrowRight className="w-3 h-3 ml-1" />
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-400">
                                                            {course.price_label || "Découvrir"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                }) : (
                                    <div className="col-span-full p-12 text-center border border-dashed border-white/10 rounded-2xl text-gray-500 font-mono">
                                        // AUCUNE DONNÉE DISPONIBLE //
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* COLONNE DROITE (1/3) */}
                    <div className="space-y-8">
                        {/* PROGRESSION */}
                        <AdultProgression
                            validatedCount={validatedCount}
                            totalCourses={courses.length}
                        />

                        {/* SUCCESS */}
                        <AdultAchievements
                            recentValids={recentValids}
                        />
                    </div>
                </div>

                {/* Optional: Add a subtle section for lives/replays if needed, keeping it minimal */}
                {livesRes.data && livesRes.data.length > 0 && (
                    <section className="pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-white uppercase tracking-wider">
                                <Tv className="w-5 h-5 text-gray-400" />
                                Contenus Vidéos (Lives & Replays)
                            </h2>
                            <Link href="/dashboard/live" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                                Tout voir &rarr;
                            </Link>
                        </div>
                        <p className="text-slate-400 text-sm max-w-2xl font-light">
                            Ne manquez pas les prochaines diffusions en direct ou rattrapez les anciens épisodes directement depuis la salle de projection.
                        </p>
                    </section>
                )}

            </div>
        </div>
    );
}
