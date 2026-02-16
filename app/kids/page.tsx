import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Sparkles } from "lucide-react";
import KidsHomeHero from "@/components/kids/KidsHomeHero";
import KidsNewsFeed from "@/components/kids/KidsNewsFeed";
import KidsProgression from "@/components/kids/KidsProgression";
import KidsAchievements from "@/components/kids/KidsAchievements";

export default async function KidsHomePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("created_at, display_name, first_name, magic_level, xp")
        .eq("id", user.id)
        .single();

    if (!profile) return null;

    // Time-based unlocking logic (Keep this for content availability)
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7) + 1;

    // Item-based progression logic
    const { count: validatedCount } = await supabase
        .from("library_progress")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    // Fetch recent successes for Block 5
    const { data: recentValids } = await supabase
        .from("library_progress")
        .select("item_id, completed_at, library_items(title)")
        .eq("user_id", user.id)
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

    // 2. Fetch Content
    const { data: allItems } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "kids")
        .lte("week_number", currentWeek)
        .order("week_number", { ascending: false });

    // Block 2: Atelier de la Semaine
    const currentItems = allItems?.filter(i => i.week_number === currentWeek) || [];
    const mainItem = currentItems.find(i => i.is_main) || currentItems[0];

    // Block 3: Nouveautés (Filter out main item)
    const recentItems = allItems?.filter(i => i.id !== mainItem?.id).slice(0, 3) || [];

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
                    <div>
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Bienvenue, <span className="text-brand-purple">{userName}</span> ! ✨
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            Prêt à découvrir les secrets de la semaine ?
                        </p>
                    </div>
                </header>

                {/* BLOC 2: HERO (ATELIER SEMAINE) */}
                <KidsHomeHero item={mainItem} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* COLONNE GAUCHE (2/3) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* BLOC 3: NOUVEAUTÉS */}
                        <KidsNewsFeed items={recentItems} />

                        {/* BLOC 6: MES COFFRES (Conditional) */}
                        {hasPurchases && (
                            <section>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-brand-gold" />
                                    Mes Coffres Secrets
                                </h3>
                                <div className="bg-gradient-to-r from-brand-gold/10 to-transparent border border-brand-gold/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center shrink-0">
                                        <Package className="w-8 h-8 text-brand-gold" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h4 className="text-xl font-bold text-brand-gold mb-1">Tu as {purchaseCount || 0} coffre{(purchaseCount || 0) > 1 ? 's' : ''} à ouvrir !</h4>
                                        <p className="text-brand-text-muted text-sm">Tes packs magiques t'attendent dans ta réserve secrète.</p>
                                    </div>
                                    <Link
                                        href="/kids/courses?filter=owned"
                                        className="bg-brand-gold hover:bg-brand-gold/80 text-black font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                                    >
                                        Ouvrir mes coffres
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
                            userGrade={userGrade}
                            currentLevel={currentLevel}
                        />

                        {/* BLOC 5: SUCCESS (WINS) */}
                        <KidsAchievements recentValids={recentValids || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
