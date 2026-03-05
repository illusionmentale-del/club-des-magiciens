import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle, ArrowRight, Lock, BookOpen, Tv, ShoppingBag, Star, Sparkles } from "lucide-react";
import Image from "next/image";
import AdultHomeHero from "@/components/adults/AdultHomeHero";
import AdultNewsFeed from "@/components/adults/AdultNewsFeed";
import AdultProgression from "@/components/adults/AdultProgression";
import AdultAchievements from "@/components/adults/AdultAchievements";
import GlobalAlertBanner from "@/components/kids/GlobalAlertBanner"; // Reusable component for both spaces
import { LiveStatusCard } from "@/components/LiveStatusCard"; // Reusable generic live card

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
        recentValidsRes,
        activeLiveRes,
        alertsRes,
        readAlertsRes
    ] = await Promise.all([
        supabase.from("library_items").select("*").eq("audience", "adults").order("created_at", { ascending: false }),
        supabase.from("user_purchases").select("course_id").eq("user_id", user.id),
        supabase.from("settings").select("*"),
        supabase.from("lives").select("*").order("start_date", { ascending: true }),
        supabase.from("user_course_progress").select("*", { count: 'exact', head: true }).eq("user_id", user.id),
        supabase.from("user_course_progress").select("course_id, completed_at, courses(title)").eq("user_id", user.id).eq("is_completed", true).order("completed_at", { ascending: false }).limit(3),
        supabase.from("lives").select("*").or("audience.eq.adults,audience.eq.all").in("status", ["programmé", "en_cours"]).order("start_date", { ascending: true }).limit(1).maybeSingle(),
        supabase.from("global_alerts").select("*").or("target_audience.eq.adults,target_audience.eq.all").order("created_at", { ascending: false }),
        supabase.from("user_alerts_read").select("alert_id").eq("user_id", user.id)
    ]);

    const libraryItems = coursesRes.data || [];
    const purchasedCourseIds = new Set(purchasesRes.data?.map(p => p.course_id) || []);
    const validatedCount = validatedProgressionRes.count || 0;
    const recentValids = recentValidsRes.data || [];

    // Alerts Logic
    const readAlertIds = readAlertsRes.data?.map(r => r.alert_id) || [];
    const unreadAlerts = alertsRes.data?.filter(a => !readAlertIds.includes(a.id)) || [];

    // Live Logic
    const activeLive = activeLiveRes.data;
    let isReminded = false;
    if (activeLive && activeLive.status === "programmé") {
        const { data: reminder } = await supabase
            .from("event_reminders")
            .select("id")
            .eq("event_id", activeLive.id)
            .eq("user_id", user.id)
            .single();
        if (reminder) isReminded = true;
    }

    const settingsMap = settingsRes.data?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    const featuredConfigSetting = settingsMap['adult_home_featured_config'];
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

    const newsConfigSetting = settingsMap['adult_home_news_courses'];
    let newsConfigIds: string[] = [];
    if (newsConfigSetting) {
        try {
            newsConfigIds = typeof newsConfigSetting === 'string'
                ? JSON.parse(newsConfigSetting)
                : newsConfigSetting;
        } catch (e) {
            console.error("Error parsing adult_home_news_courses", e);
        }
    }

    // Determine which items to show in the "Nouveautés" block
    const newsItems = newsConfigIds.length > 0
        ? newsConfigIds.map((item: any) => {
            if (typeof item === 'string') {
                const c = libraryItems.find(course => course.id === item);
                return c ? { ...c, type: 'course' } : null;
            } else if (item.type === 'course') {
                const c = libraryItems.find(course => course.id === item.id);
                return c ? { ...c, type: 'course' } : null;
            } else {
                return {
                    id: item.id,
                    type: item.type,
                    title: item.data?.title || 'Nouveau',
                    url: item.data?.url,
                    thumbnail_url: item.data?.image,
                };
            }
        }).filter(Boolean)
        : libraryItems.slice(0, 3).map(c => ({ ...c, type: 'course' }));

    // Quick helper to determine if an item is unlocked
    const isUnlocked = (item: any) => isAdmin || purchasedCourseIds.has(item.id) || !item.price_label;

    const promoConfigSetting = settingsMap['adult_home_promo_config'];
    let promoConfig = {
        title: "Étendez votre magie !",
        subtitle: "Accédez à des Masterclass exclusives et du matériel professionnel directement depuis la boutique de l'Atelier.",
        buttonText: "Visiter la Boutique",
        link: "/dashboard/catalog"
    };
    if (promoConfigSetting) {
        try {
            promoConfig = typeof promoConfigSetting === 'string'
                ? JSON.parse(promoConfigSetting)
                : promoConfigSetting;
        } catch (e) {
            console.error("Error parsing adult_home_promo_config", e);
        }
    }

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans selection:bg-magic-royal/30 overflow-hidden relative">

            {/* Ambient Premium Lighting */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-magic-royal/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Premium Header / Hero */}
            {/* Premium Header / Hero */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 max-w-5xl mx-auto relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-magic-royal mb-2">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest">Le Club des Magiciens</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Bienvenue, <span className="text-magic-royal">{userName}</span> ! ✨
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">
                        Prêt à découvrir de nouveaux secrets ?
                    </p>
                </div>
            </header>

            <div className="max-w-5xl mx-auto relative z-10 space-y-12 mt-12">

                {/* BLOC: GLOBAL ALERTS */}
                <GlobalAlertBanner alerts={unreadAlerts} />

                {/* BLOC: LIVE STREAM BANNER OR HERO SECTION */}
                {/* Rule: If there is a Live, it takes the main spot. If not, the Hero takes it. */}
                {activeLive ? (
                    <div className="mb-0">
                        <LiveStatusCard live={activeLive} isReminded={isReminded} />
                    </div>
                ) : (
                    <AdultHomeHero config={featuredConfig || { title: "", description: "", image: "", link: "", buttonText: "", tag: "" }} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* COLONNE GAUCHE (2/3) */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* NOUVEAUTÉS */}
                        {settingsMap?.show_adults_news !== 'false' && (
                            <AdultNewsFeed items={newsItems as any} />
                        )}

                        {/* SECTION PROMO BOUTIQUE (Optional, replacing the grid to keep it balanced) */}
                        {settingsMap?.enable_adults_catalog !== 'false' && settingsMap?.show_adults_catalog_promo !== 'false' && (
                            <section>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-magic-royal" />
                                    Le Catalogue Premium
                                </h3>
                                <div className="bg-gradient-to-r from-magic-royal/10 to-transparent border border-magic-royal/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-16 h-16 bg-magic-royal/20 rounded-full flex items-center justify-center shrink-0">
                                        <ShoppingBag className="w-8 h-8 text-magic-royal" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h4 className="text-xl font-bold text-magic-royal mb-1">
                                            {promoConfig.title}
                                        </h4>
                                        <p className="text-slate-400 text-sm font-light">
                                            {promoConfig.subtitle}
                                        </p>
                                    </div>
                                    <Link
                                        href={promoConfig.link}
                                        className="bg-magic-royal hover:bg-blue-400 text-black font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-magic-royal/20"
                                    >
                                        {promoConfig.buttonText}
                                    </Link>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* COLONNE DROITE (1/3) */}
                    <div className="space-y-8">
                        {/* PROGRESSION */}
                        {settingsMap?.show_adults_progression !== 'false' && (
                            <AdultProgression
                                validatedCount={validatedCount}
                                totalCourses={libraryItems.length}
                            />
                        )}

                        {/* SUCCESS */}
                        {settingsMap?.show_adults_achievements !== 'false' && (
                            <AdultAchievements
                                recentValids={recentValids}
                            />
                        )}
                    </div>
                </div>



            </div>
        </div>
    );
}
