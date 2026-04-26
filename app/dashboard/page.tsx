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
import { FadeInUp, FadeIn } from "@/components/adults/MotionWrapper";

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
        supabase.from("library_progress").select("*", { count: 'exact', head: true }).eq("user_id", user.id).eq("is_completed", true),
        supabase.from("library_progress").select("library_item_id, completed_at, library_items(title)").eq("user_id", user.id).eq("is_completed", true).order("completed_at", { ascending: false }).limit(3),
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

    let uiLabelsMap: Record<string, string> = {
        page_dashboard_title: "Le QG de la Magie"
    };

    if (settingsMap["adult_ui_labels"]) {
        try {
            uiLabelsMap = { ...uiLabelsMap, ...JSON.parse(settingsMap["adult_ui_labels"]) };
        } catch (e) {
            console.error("Failed to parse adult_ui_labels", e);
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
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 pb-32 font-sans selection:bg-magic-royal/30 overflow-hidden relative">
            {/* Ambient Background Lights (Kids Theme) */}
            <div className="absolute top-0 left-0 w-full md:w-1/2 h-[50vh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/10 via-[#000000]/0 to-[#000000]/0 pointer-events-none z-0"></div>
            {/* Premium Glass Header */}
            <FadeIn>
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 pb-4 max-w-5xl mx-auto relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-[#86868b] mb-3">
                            <Sparkles className="w-5 h-5 text-brand-purple" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">{uiLabelsMap.page_dashboard_title || "Le QG de la Magie"}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#f5f5f7]">
                            Bienvenue, <span className="text-brand-purple font-serif italic">{userName}</span>.
                        </h1>
                        <p className="text-[#86868b] mt-3 text-xl font-light tracking-wide">
                            Prêt à découvrir de nouveaux secrets ?
                        </p>
                    </div>
                </header>
            </FadeIn>

            <div className="max-w-5xl mx-auto relative z-10 space-y-8 mt-12">

                {/* BLOC: GLOBAL ALERTS */}
                <FadeInUp delay={0.1}>
                    <GlobalAlertBanner alerts={unreadAlerts} />
                </FadeInUp>

                {/* BLOC: LIVE STREAM BANNER OR HERO SECTION */}
                <FadeInUp delay={0.2}>
                    {activeLive ? (
                        <div className="mb-0">
                            <LiveStatusCard live={activeLive} isReminded={isReminded} />
                        </div>
                    ) : (
                        <AdultHomeHero config={featuredConfig || { title: "", description: "", image: "", link: "", buttonText: "", tag: "" }} />
                    )}
                </FadeInUp>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* COLONNE GAUCHE (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* NOUVEAUTÉS */}
                        {settingsMap?.show_adults_news !== 'false' && (
                            <FadeInUp delay={0.3}>
                                <AdultNewsFeed items={newsItems as any} />
                            </FadeInUp>
                        )}

                        {/* SECTION PROMO BOUTIQUE */}
                        {settingsMap?.enable_adults_catalog !== 'false' && settingsMap?.show_adults_catalog_promo !== 'false' && (
                            <FadeInUp delay={0.4}>
                                <section className="bg-[#1c1c1e] rounded-[32px] p-8 md:p-10 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                                    <div className="w-20 h-20 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center shrink-0 border border-white/5 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                        <ShoppingBag className="w-8 h-8 text-[#f5f5f7]" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left relative z-10">
                                        <h4 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                                            {promoConfig.title}
                                        </h4>
                                        <p className="text-[#86868b] text-base font-light leading-relaxed">
                                            {promoConfig.subtitle}
                                        </p>
                                    </div>
                                    <Link
                                        href={promoConfig.link}
                                        className="bg-brand-purple text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] font-medium py-3 px-6 rounded-full transition-all whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105 relative z-10"
                                    >
                                        {promoConfig.buttonText}
                                    </Link>
                                </section>
                            </FadeInUp>
                        )}
                    </div>

                    {/* COLONNE DROITE (1/3) */}
                    <div className="space-y-6">
                        {/* PROGRESSION */}
                        {settingsMap?.show_adults_progression !== 'false' && (
                            <FadeInUp delay={0.4}>
                                <AdultProgression
                                    validatedCount={validatedCount}
                                    totalCourses={libraryItems.filter(i => !i.sales_page_url).length}
                                />
                            </FadeInUp>
                        )}

                        {/* SUCCESS */}
                        {settingsMap?.show_adults_achievements !== 'false' && (
                            <FadeInUp delay={0.5}>
                                <AdultAchievements
                                    recentValids={recentValids}
                                />
                            </FadeInUp>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
