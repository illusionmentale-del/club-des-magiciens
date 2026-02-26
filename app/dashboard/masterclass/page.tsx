import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, Sparkles, FolderOpen, Play, Lock } from "lucide-react";
import AdultVideoCard from "@/components/AdultVideoCard";

export const metadata = {
    title: 'Les Masterclass | Club des Magiciens',
    description: 'Le Netflix de la magie. Accédez à vos masterclass et perfectionnez-vous.',
};

export default async function AdultMasterclassPage() {
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

    // 2. Fetch all courses (exclude kids), user purchases & settings
    const [coursesRes, purchasesRes, settingsRes] = await Promise.all([
        supabase.from("courses").select("*").neq('audience', 'kids').order("created_at", { ascending: false }),
        supabase.from("user_purchases").select("course_id").eq("user_id", user.id),
        supabase.from("settings").select("*").eq("key", "adult_masterclass_featured_config")
    ]);

    const courses = coursesRes.data || [];
    const purchasedCourseIds = new Set(purchasesRes.data?.map(p => p.course_id) || []);

    // 3. Featured Masterclass Logic
    // For now, if no setting is defined, we'll just take the most recent course as "À la une"
    let featuredConfig = settingsRes.data?.[0]?.value ? JSON.parse(settingsRes.data[0].value) : null;
    let featuredCourse = null;

    if (featuredConfig?.id) {
        featuredCourse = courses.find(c => c.id === featuredConfig.id) || null;
    } else if (courses.length > 0) {
        // Fallback: the newest course
        featuredCourse = courses[0];
    }

    // Determine unlock status for the featured course
    const isFeaturedUnlocked = featuredCourse
        ? (isAdmin || purchasedCourseIds.has(featuredCourse.id) || featuredCourse.price === 'Gratuit' || !featuredCourse.price)
        : false;

    // Remaining courses for the grid (excluding the featured one to avoid duplication)
    const gridCourses = featuredCourse
        ? courses.filter(c => c.id !== featuredCourse.id)
        : courses;

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans relative selection:bg-magic-gold/30">
            {/* Ambient Background Lights (Adult Theme) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-magic-gold/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-6xl mx-auto relative z-10 space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-magic-gold mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-magic-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le QG de la Magie</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-serif mb-2">
                            Les <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-gold to-orange-400">Masterclass</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-light max-w-2xl">
                            Le repaire des secrets les mieux gardés. Perfectionnez-vous avec ces formations vidéos approfondies.
                        </p>
                    </div>
                </header>

                {/* Featured Masterclass Section */}
                {featuredCourse && (
                    <div className="mb-12">
                        <h2 className="text-sm font-bold text-magic-gold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                            <Sparkles className="w-4 h-4" /> À LA UNE
                        </h2>

                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className={`absolute -inset-1 rounded-3xl opacity-0 blur-lg transition duration-1000 pointer-events-none ${isFeaturedUnlocked ? 'bg-gradient-to-r from-magic-gold to-orange-600 group-hover:opacity-30' : ''}`}></div>

                            <div className={`relative rounded-3xl overflow-hidden border bg-magic-card flex flex-col md:flex-row shadow-[0_10px_40px_rgba(0,0,0,0.5)] ${isFeaturedUnlocked ? 'border-magic-gold/20' : 'border-white/5'}`}>

                                {/* Featured Image Area */}
                                <div className="w-full md:w-[55%] md:aspect-[16/10] aspect-video relative bg-black">
                                    {featuredCourse.thumbnail_url ? (
                                        <Image
                                            src={featuredCourse.thumbnail_url}
                                            alt={featuredCourse.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                                            sizes="(max-width: 768px) 100vw, 60vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <Play className="w-12 h-12 text-white/20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-magic-card via-black/40 to-transparent md:bg-gradient-to-r" />

                                    {/* Play/Lock Button Overlay */}
                                    <Link
                                        href={isFeaturedUnlocked ? `/watch/${featuredCourse.id}` : (featuredCourse.sales_page_url || "#")}
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                    >
                                        {isFeaturedUnlocked ? (
                                            <div className="w-24 h-24 bg-magic-gold/90 text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(238,195,67,0.6)] transform scale-50 group-hover:scale-100 transition-all duration-300">
                                                <Play className="w-10 h-10 ml-2" />
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 bg-black/80 border border-white/10 text-white/50 rounded-full flex items-center justify-center backdrop-blur-md transform scale-50 group-hover:scale-100 transition-all duration-300 group-hover:text-red-400 group-hover:border-red-500/50">
                                                <Lock className="w-10 h-10" />
                                            </div>
                                        )}
                                    </Link>

                                    {!isFeaturedUnlocked && (
                                        <div className="absolute top-6 left-6 px-3 py-1.5 bg-red-500/90 text-white text-xs font-bold rounded-lg backdrop-blur-md z-30 uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                            <Lock className="w-4 h-4" />
                                            Accès Verrouillé
                                        </div>
                                    )}
                                </div>

                                {/* Featured Content Info */}
                                <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center relative z-10">
                                    <h3 className={`text-2xl md:text-4xl font-black mb-6 leading-tight font-serif ${isFeaturedUnlocked ? 'text-white' : 'text-slate-300'}`}>
                                        {featuredConfig?.title || featuredCourse.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 font-light">
                                        {featuredConfig?.description || featuredCourse.description || "Plongez dans cette masterclass pour maîtriser ces nouveaux secrets."}
                                    </p>

                                    <Link
                                        href={isFeaturedUnlocked ? `/watch/${featuredCourse.id}` : (featuredCourse.sales_page_url || "#")}
                                        className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all self-start shadow-lg ${isFeaturedUnlocked
                                                ? 'bg-gradient-to-r from-magic-gold to-orange-500 text-black hover:shadow-[0_0_30px_rgba(238,195,67,0.4)] hover:scale-105'
                                                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                            }`}
                                    >
                                        {isFeaturedUnlocked ? (
                                            <>
                                                <Play className="w-4 h-4" /> Visionner
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4" /> {featuredCourse.price_label || "Découvrir"}
                                            </>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Grid */}
                <div className="space-y-6 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wider">
                            <Sparkles className="w-5 h-5 text-slate-500" />
                            Catalogue Complet
                        </h2>
                    </div>

                    {gridCourses.length === 0 ? (
                        <div className="relative group/box">
                            <div className="absolute -inset-1 bg-gradient-to-r from-magic-gold to-orange-600 rounded-3xl opacity-0 blur-lg group-hover/box:opacity-10 transition duration-1000 pointer-events-none"></div>
                            <div className="relative bg-magic-card border border-white/5 p-16 rounded-3xl text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-[#111] border border-white/5 rounded-full flex items-center justify-center mb-6 text-slate-600">
                                    <FolderOpen className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Le coffre est vide</h3>
                                <p className="text-slate-400 max-w-md mx-auto text-sm font-light">
                                    Il n'y a aucune autre masterclass disponible pour le moment.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {gridCourses.map((course) => {
                                const isUnlocked = isAdmin || purchasedCourseIds.has(course.id) || course.price === 'Gratuit' || !course.price;

                                return (
                                    <AdultVideoCard
                                        key={course.id}
                                        id={course.id}
                                        title={course.title}
                                        thumbnailUrl={course.thumbnail_url || ""}
                                        description={course.description}
                                        date={course.created_at}
                                        href={isUnlocked ? `/watch/${course.id}` : (course.sales_page_url || "#")}
                                        isUnlocked={isUnlocked}
                                        priceLabel={course.price_label}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
