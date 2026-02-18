import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Sparkles, ShoppingBag } from "lucide-react";
import KidsHomeHero from "@/components/kids/KidsHomeHero";
import KidsNewsFeed from "@/components/kids/KidsNewsFeed";
import KidsProgression from "@/components/kids/KidsProgression";
import KidsAchievements from "@/components/kids/KidsAchievements";

export const dynamic = 'force-dynamic';

export default async function KidsHomePage() {
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
                .select("created_at, display_name, first_name, magic_level, xp")
                .eq("id", user.id)
                .single(),
            supabase
                .from("settings")
                .select("*")
                .like("key", "kid_home_%")
        ]);
    } catch (err: any) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-mono p-10 space-y-4">
                <h1 className="text-2xl font-bold">⚠️ CRASH CHARGEMENT DONNÉES</h1>
                <p>User ID: {user.id}</p>
                <div className="p-4 bg-red-900/20 border border-red-500 rounded text-xs whitespace-pre-wrap">
                    {err?.message || JSON.stringify(err)}
                </div>
            </div>
        );
    }

    // DEBUG: Stop silent failure
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-mono p-10 space-y-4">
                <h1 className="text-2xl font-bold">⚠️ PROFIL NON TROUVÉ</h1>
                <p>User ID: {user.id}</p>
                <div className="p-4 bg-red-900/20 border border-red-500 rounded">
                    <p className="font-bold mb-2">Diagnostic:</p>
                    <ul className="list-disc ml-5 text-sm">
                        <li>Authentifié: OUI</li>
                        <li>Profil DB: NON (data: {JSON.stringify(profile)})</li>
                        <li>Settings: {settings ? `${settings.length} items` : "NULL"}</li>
                    </ul>
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
    const currentWeek = Math.floor(diffDays / 7) + 1;

    // 2. Fetch Content (Library Items)
    // We fetch everything up to current week to have context
    const { data: allItems } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "kids")
        .lte("week_number", currentWeek)
        .order("week_number", { ascending: false });

    // --- CONFIG LOGIC ---

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
    const newsConfig = getJsonSetting("news_config", []);
    let recentItems: any[] = [];
    if (Array.isArray(newsConfig) && newsConfig.length > 0) {
        // Filter from allItems to respect week limits (LTE currentWeek)
        recentItems = allItems?.filter(i => newsConfig.includes(i.id)) || [];
    } else {
        // Fallback news logic
        recentItems = allItems?.filter(i => i.id !== mainItem?.id).slice(0, 3) || [];
    }

    // --- END CONFIG LOGIC ---

    // Item-based progression logic
    const { count: validatedCount } = await supabase
        .from("user_library_progress")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    // Fetch recent successes for Block 5
    const { data: recentValids } = await supabase
        .from("user_library_progress")
        .select("item_id, completed_at, library_items(title)")
        .eq("user_id", user.id)
        .eq("is_completed", true)
        .order("completed_at", { ascending: false })
        .limit(3);

    // Progression Logic
    const validatedItems = validatedCount || 0;
    const TOTAL_ITEMS_TO_MAX = 50;
    const currentLevel = Math.floor(validatedItems / 5) + 1;

    // Fetch Purchase Count for Block 6
    const { count: purchaseCount } = await supabase
        .from("purchases")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("status", "paid");
    const hasPurchases = (purchaseCount || 0) > 0;

    const userName = profile.first_name || profile.display_name?.split(' ')[0] || "Jeune Magicien";
    const userGrade = profile.magic_level || "Apprenti";

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans overflow-hidden relative selection:bg-brand-purple/30">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* BLOC 1: BIENVENUE */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Bienvenue, <span className="text-brand-purple">{userName}</span> ! ✨
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            {customWelcome || (mainItem ? "Prêt à découvrir les secrets de la semaine ?" : "Prêt pour ton aventure magique ?")}
                        </p>
                    </div>
                </header>

                {/* BLOC 2: HERO (ATELIER VEDETTE) */}
                <KidsHomeHero
                    item={mainItem}
                    overrideImage={featuredConfig.image}
                    overrideHook={featuredConfig.text}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* COLONNE GAUCHE (2/3) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* BLOC 3: NOUVEAUTÉS */}
                        <KidsNewsFeed items={recentItems} />

                        {/* BLOC 6: MES COFFRES (Always Visible or Logic based) */}
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
                                        {hasPurchases ? `Tu as déjà ${purchaseCount} coffres !` : "Découvre les secrets du Club !"}
                                    </h4>
                                    <p className="text-brand-text-muted text-sm">Équipe-toi avec le meilleur matériel de magicien pro.</p>
                                </div>
                                <Link
                                    href="/kids/courses?filter=owned"
                                    className="bg-brand-gold hover:bg-brand-gold/80 text-black font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                                >
                                    Faire un tour à la boutique
                                </Link>
                            </div>
                        </section>
                    </div>

                    {/* COLONNE DROITE (1/3) */}
                    <div className="space-y-8">
                        {/* BLOC 4: PROGRESSION */}
                        <KidsProgression
                            validatedCount={validatedItems}
                            totalItemsToMax={TOTAL_ITEMS_TO_MAX}
                            userGrade={userGrade}
                            currentLevel={currentLevel}
                        />

                        {/* BLOC 5: SUCCESS (WINS) */}
                        <KidsAchievements recentValids={recentValids || []} />
                    </div>
                </div>
                <div className="mt-20 p-6 bg-black/80 text-green-400 font-mono text-xs rounded-xl border border-green-500/30 overflow-hidden">
                    <p className="font-bold text-lg mb-4 text-green-500">🔧 ZONE DE DEBUG (Temporaire)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="font-bold border-b border-green-500/30 mb-2">PROFIL & TEMPS</p>
                            <p>User ID: {user.id}</p>
                            <p>Created At: {profile.created_at}</p>
                            <p>Current Date: {now.toISOString()}</p>
                            <p>Diff Days: {diffDays}</p>
                            <p>Calculated Week: {currentWeek}</p>
                        </div>
                        <div>
                            <p className="font-bold border-b border-green-500/30 mb-2">RÉGLAGES BRUTS</p>
                            <pre className="whitespace-pre-wrap">{JSON.stringify(settingsMap, null, 2)}</pre>
                        </div>
                        <div>
                            <p className="font-bold border-b border-green-500/30 mb-2">CONFIG RÉSOLUE</p>
                            <p>Welcome Active: {String(welcomeActive)}</p>
                            <p>Weekly Message Key: {String(currentWeek)}</p>
                            <p>Custom Welcome: {customWelcome || "NULL"}</p>
                            <p>Featured Config ID: {featuredConfig.id || "NONE"}</p>
                            <p>Main Item Found: {mainItem ? `YES (${mainItem.id})` : "NO"}</p>
                        </div>
                        <div>
                            <p className="font-bold border-b border-green-500/30 mb-2">DATABASE ACCESS</p>
                            <p>Has Profile: YES</p>
                            <p>Items Fetched: {allItems?.length || 0}</p>
                            <p>Filtered Recent Items: {recentItems?.length || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
