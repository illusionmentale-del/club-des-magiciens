import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Sparkles, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import KidsHomeHero from "@/components/kids/KidsHomeHero";
import KidsNewsFeed from "@/components/kids/KidsNewsFeed";
import KidsProgression from "@/components/kids/KidsProgression";
import KidsAchievements from "@/components/kids/KidsAchievements";
import { LiveStatusCard } from "@/components/LiveStatusCard";
import GlobalAlertBanner from "@/components/kids/GlobalAlertBanner";
import WelcomeModal from "@/components/kids/WelcomeModal";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function KidsHomePage({ searchParams }: { searchParams: Promise<any> }) {
    const sParams = await searchParams;
    const isForcedPreview = sParams.preview === "true";
    const forcedView = sParams.view;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile & Settings
    let profile, settings;
    try {
        [{ data: profile }, { data: settings }] = await Promise.all([
            supabase
                .from("profiles")
                .select("*, avatar_skins(image_url)") // Fetch avatar info too
                .eq("id", user.id)
                .single(),
            supabase
                .from("settings")
                .select("*")
                .like("key", "kid_home_%")
        ]);

        // SELF-HEALING: If profile is missing but user exists, create it
        if (!profile && user) {
            const { data: newProfile, error: createError } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || "Jeune Magicien",
                    role: 'kid', // Default role
                    access_level: 'kid'
                })
                .select()
                .single();

            if (newProfile) {
                profile = newProfile;
            }
        }

    } catch (err: any) {
        console.error("Data fetch error:", err);
        // Continue to allow error handling below if strictly needed, 
        // or let the next check capture the missing profile.
    }

    // CRITICAL ERROR: If still no profile after self-healing, show error
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-mono p-10 space-y-4">
                <h1 className="text-2xl font-bold">⚠️ ERREUR FATALE PROFIL</h1>
                <p>Impossible de récupérer ou créer le profil.</p>
                <div className="p-4 bg-red-900/20 border border-red-500 rounded text-xs whitespace-pre-wrap">
                    User: {user.id}
                </div>
            </div>
        );
    }

    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    const getJsonSetting = (key: string, fallback: any) => {
        try {
            const val = settingsMap[`kid_home_${key}`];
            if (!val) return fallback;
            // Handle if Supabase auto-parsed it or if it's already an object
            if (typeof val === 'object') return val;
            return JSON.parse(val);
        } catch (e) {
            console.error(`Error parsing setting kid_home_${key}:`, e);
            return fallback;
        }
    }

    // Time-based unlocking logic (anchor for content availability)
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7) + 5;

    // 2. Fetch Content (Library Items & Active Live & Alerts)
    const [{ data: allItems }, { data: activeLive }, { data: alerts }, { data: readAlerts }] = await Promise.all([
        supabase
            .from("library_items")
            .select("*")
            .eq("audience", "kids")
            .lte("week_number", currentWeek)
            .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
            .order("week_number", { ascending: false }),

        supabase
            .from("lives")
            .select("*")
            .or("audience.eq.kids,audience.eq.all")
            .in("status", ["programmé", "en_cours"])
            .order("start_date", { ascending: true })
            .limit(1)
            .maybeSingle(),

        supabase
            .from("global_alerts")
            .select("*")
            .or("target_audience.eq.kids,target_audience.eq.all")
            .order("created_at", { ascending: false }),

        supabase
            .from("user_alerts_read")
            .select("alert_id")
            .eq("user_id", user.id)
    ]);

    // Filter out read alerts
    const readAlertIds = readAlerts?.map(r => r.alert_id) || [];
    const unreadAlerts = alerts?.filter(a => !readAlertIds.includes(a.id)) || [];

    // --- CONFIG LOGIC ---

    // Fetch reminder status if there's an active live
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

    // WELCOME MESSAGE
    const welcomeActive = settingsMap.kid_home_welcome_active === "true";
    const weeklyMessages = getJsonSetting("weekly_messages", {});
    const customWelcome = welcomeActive ? weeklyMessages[String(currentWeek)] : null;

    // HERO (FEATURED)
    const featuredConfig = getJsonSetting("featured_config", { id: "", image: "", text: "" });
    let mainItem = allItems?.find(i => i.id === featuredConfig.id);

    // If not found in allItems (e.g. from a future week), fetch it explicitly
    if (featuredConfig.id && !mainItem) {
        const { data: specificItem } = await supabase
            .from("library_items")
            .select("*")
            .eq("id", featuredConfig.id)
            .single();
        if (specificItem) mainItem = specificItem;
    }

    // Fallback hero logic
    if (!mainItem) {
        const currentItems = allItems?.filter(i => i.week_number === currentWeek) || [];
        mainItem = currentItems.find(i => i.is_main) || currentItems[0] || allItems?.[0];
    }

    // NEWS (CURATION)
    // Supports both old format (string[]) and new format ({id, type, data?}[])
    const newsConfigRaw = getJsonSetting("news_config", []);
    let recentItems: any[] = [];

    if (Array.isArray(newsConfigRaw) && newsConfigRaw.length > 0) {
        // Normalize config to array of objects
        const configItems = newsConfigRaw.map(item => {
            if (typeof item === 'string') return { id: item, type: 'course' };
            return item;
        });

        // 1. Fetch real course data for items of type 'course'
        const courseIds = configItems.filter((i: any) => i.type === 'course').map((i: any) => i.id);
        const courses = allItems?.filter(i => courseIds.includes(i.id)) || [];

        // 2. Merge and preserve order from config
        recentItems = configItems.map((configItem: any) => {
            if (configItem.type === 'course') {
                const realCourse = courses.find(c => c.id === configItem.id);
                if (!realCourse) return null; // Course not found or not available yet
                return { ...realCourse, type: 'course' };
            }
            // Custom items (tips, products, links)
            return {
                id: configItem.id,
                type: configItem.type,
                title: configItem.data?.title || "Sans titre",
                thumbnail_url: configItem.data?.image,
                url: configItem.data?.url,
                week_number: null // Custom items don't have a week number usually
            };
        }).filter(Boolean); // Remove nulls

    } else {
        // Fallback news logic
        recentItems = allItems?.filter(i => i.id !== mainItem?.id).slice(0, 3).map(i => ({ ...i, type: 'course' })) || [];
    }

    // --- END CONFIG LOGIC ---

    // Item-based progression logic
    const { count: validatedCount } = await supabase
        .from("user_library_progress")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    const { data: recentValids } = await supabase
        .from("user_library_progress")
        .select("item_id, completed_at, library_items(title)")
        .eq("user_id", user.id)
        .eq("is_completed", true)
        .order("completed_at", { ascending: false })
        .limit(3);

    // Fetch Completed Quests for Achievements Block
    const { data: completedQuests } = await supabase
        .from("user_quests")
        .select("completed_at, gamification_quests(title, reward_xp)")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(3);

    // XP & Grade Logic
    const { data: xpLogs } = await supabase.from("user_xp_logs").select("xp_awarded").eq("user_id", user.id);
    const totalXP = xpLogs?.reduce((acc, log) => acc + (log.xp_awarded > 0 ? log.xp_awarded : 0), 0) || 0;

    const { data: levels } = await supabase.from('gamification_levels').select('*').order('xp_threshold', { ascending: false });
    
    let currentGrade = "Apprenti";
    let nextGrade: string | null = null;
    let nextThreshold: number | null = null;

    if (levels && levels.length > 0) {
        const currentLevelObj = levels.find(l => totalXP >= l.xp_threshold);
        if (currentLevelObj) {
            currentGrade = currentLevelObj.name;
        } else {
            currentGrade = levels[levels.length - 1].name;
        }

        const ascLevels = [...levels].reverse();
        const nextLevelObj = ascLevels.find(l => l.xp_threshold > totalXP);
        if (nextLevelObj) {
            nextGrade = nextLevelObj.name;
            nextThreshold = nextLevelObj.xp_threshold;
        }
    }

    // Progression Logic
    const validatedItems = validatedCount || 0;
    const TOTAL_ITEMS_TO_MAX = 50;
    const currentLevelNumber = Math.floor(validatedItems / 5) + 1;

    // Fetch Purchase Count for Block 6
    const { count: purchaseCount } = await supabase
        .from("user_purchases")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("status", "active");
    const hasPurchases = (purchaseCount || 0) > 0;



    const userName = profile.username || profile.full_name || profile.display_name || profile.first_name || user.user_metadata?.full_name || "Jeune Magicien";

    let avatarUrl = "";
    if (profile?.avatar_skins && !Array.isArray(profile.avatar_skins) && typeof profile.avatar_skins === 'object') {
         avatarUrl = (profile.avatar_skins as any).image_url || "";
    }

    const isShopEnabled = settingsMap.enable_kids_shop !== 'false';

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans overflow-hidden relative selection:bg-brand-purple/30">
            <WelcomeModal />
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {isForcedPreview && (
                    <div className="flex items-center justify-center gap-4 py-2 px-4 bg-brand-purple/20 border border-brand-purple/30 rounded-xl mb-8 animate-pulse">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple">Mode Aperçu Actif</span>
                        <Separator orientation="vertical" className="h-4 bg-brand-purple/30" />
                        <span className="text-[10px] font-bold text-white uppercase italic">
                            Interface : {forcedView === 'mobile' ? '📱 Mobile' : (forcedView === 'desktop' ? '💻 Desktop' : '🌐 Auto')}
                        </span>
                    </div>
                )}

                {/* BLOC 1: BIENVENUE */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Bienvenue au <span className="text-brand-purple">Club</span> ! ✨
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            {customWelcome || (mainItem ? "Prêt à découvrir les secrets de la semaine ?" : "Prêt pour ton aventure magique ?")}
                        </p>
                    </div>
                </header>

                {/* BLOC: GLOBAL ALERTS */}
                <GlobalAlertBanner alerts={unreadAlerts} />

                {/* BLOC: LIVE STREAM BANNER */}
                {activeLive && (
                    <div className="mb-8">
                        <LiveStatusCard live={activeLive} isReminded={isReminded} />
                    </div>
                )}

                {/* BLOC 2: HERO (ATELIER VEDETTE) */}
                <KidsHomeHero
                    item={mainItem}
                    overrideImage={featuredConfig.image}
                    overrideHook={featuredConfig.text}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* COLONNE GAUCHE (2/3) */}
                    <div className="md:col-span-2 lg:col-span-2 space-y-12">

                        {/* BLOC 3: NOUVEAUTÉS */}
                        <KidsNewsFeed items={recentItems} />

                        {/* BLOC 6: MES COFFRES (Always Visible or Logic based) */}
                        {isShopEnabled && (
                            <section>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-brand-gold" />
                                    La Boutique Magique
                                </h3>
                                <div className="bg-gradient-to-r from-brand-gold/10 to-transparent border border-brand-gold/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center shrink-0">
                                        <ShoppingBag className="w-8 h-8 text-brand-gold" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h4 className="text-xl font-bold text-brand-gold mb-1">
                                            {hasPurchases ? `Tu as déjà ${purchaseCount} vidéos !` : "Découvre les secrets du Club !"}
                                        </h4>
                                        <p className="text-brand-text-muted text-sm">Équipe-toi avec le meilleur matériel de magicien pro.</p>
                                    </div>
                                    <Link
                                        href="/kids/shop"
                                        className="bg-brand-gold hover:bg-brand-gold/80 text-black font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                                    >
                                        Faire un tour à la boutique
                                    </Link>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* COLONNE DROITE (1/3) */}
                    <div className="space-y-8">
                        {/* BLOC 4: PROGRESSION */}
                        <KidsProgression
                            validatedCount={validatedItems}
                            totalItemsToMax={TOTAL_ITEMS_TO_MAX}
                            userGrade={currentGrade}
                            currentLevel={currentLevelNumber}
                            totalXP={totalXP}
                            nextGrade={nextGrade}
                            nextThreshold={nextThreshold}
                            avatarUrl={avatarUrl}
                        />

                        {/* BLOC 5: SUCCESS (WINS) */}
                        <KidsAchievements recentValids={recentValids || []} completedQuests={completedQuests || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
