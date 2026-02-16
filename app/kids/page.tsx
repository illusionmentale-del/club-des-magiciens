import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, CheckCircle, Lock, Trophy, Map, Star, ArrowRight, Sparkles, Bell, PartyPopper } from "lucide-react";

export default async function KidsHomePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile & Tenure
    const { data: profile } = await supabase
        .from("profiles")
        .select("created_at, display_name, first_name")
        .eq("id", user.id)
        .single();

    if (!profile) return null;

    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7) + 1;
    const TOTAL_WEEKS = 24;
    const progressPercentage = Math.min((currentWeek / TOTAL_WEEKS) * 100, 100);

    // 2. Fetch Content
    // We need:
    // - Current Week (Main Item) -> Block 2
    // - Recent Items (News) -> Block 3
    // - Past/Validated Items -> Block 5

    // Fetch all relevant items to filter in memory (efficient for small dataset) 
    // or separate queries. Let's do one query for now as dataset is small < 100 items.
    const { data: allItems } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "kids")
        .lte("week_number", currentWeek) // Only unlocked stuff
        .order("week_number", { ascending: false });

    // Block 2: Atelier de la Semaine
    const currentItems = allItems?.filter(i => i.week_number === currentWeek) || [];
    const mainItem = currentItems.find(i => i.is_main) || currentItems[0];

    // Block 3: Nouveautés (Recent unlocked items, excluding current main if possible to avoid dupes, or just mix)
    // Actually, "Nouveautés" might be the latest added things. 
    // Let's use the last 3 unlocked items (including current week bonuses or previous week if new).
    // Filtering out the main item of current week to avoid redundancy if it's in the hero.
    const recentItems = allItems?.filter(i => i.id !== mainItem?.id).slice(0, 3) || [];

    // Block 5: Dernières Réussites (Validated = Previous Weeks)
    // We assume anything from previous weeks is "done" or at least "conquered".
    // Let's take the main item of the previous 2 weeks.
    const previousWeeksItems = allItems?.filter(i => i.week_number < currentWeek && i.is_main).slice(0, 3) || [];

    const userName = profile.first_name || profile.display_name?.split(' ')[0] || "Jeune Magicien";

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans overflow-hidden relative selection:bg-brand-purple/30">

            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* BLOC 1: BIENVENUE (Personnalisé & Chaleureux) */}
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
                            Une nouvelle mission t'attend cette semaine. Prêt à relever le défi ?
                        </p>
                    </div>
                    {/* Visual Badge or Avatar could go here */}
                </header>

                {/* BLOC 2: ATELIER DE LA SEMAINE (Héro - Prioritaire) */}
                <section className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-30 blur-lg group-hover:opacity-50 transition duration-1000"></div>

                    <div className="relative bg-brand-card border border-brand-purple/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                        {mainItem ? (
                            <>
                                {/* Thumbnail */}
                                <div className="md:w-3/5 relative aspect-video md:aspect-auto bg-black group-hover:scale-[1.01] transition-transform duration-500">
                                    {mainItem.thumbnail_url ? (
                                        <Image src={mainItem.thumbnail_url} alt={mainItem.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-brand-surface">
                                            <Play className="w-16 h-16 text-white/20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-brand-purple text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-bounce-slow">
                                            Nouvelle Mission
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                            <Play className="w-6 h-6 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-brand-card to-brand-bg">
                                    <div className="mb-auto">
                                        <h2 className="text-2xl font-black text-white uppercase leading-tight mb-2">
                                            {mainItem.title}
                                        </h2>
                                        <p className="text-brand-text-muted text-sm line-clamp-3">
                                            {mainItem.description}
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <Link
                                            href={`/watch/${mainItem.id}`}
                                            className="block w-full text-center bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-purple/20 uppercase tracking-wider text-sm"
                                        >
                                            Commencer la mission
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-12 w-full text-center">
                                <h3 className="text-xl font-bold text-white mb-2">Patience...</h3>
                                <p className="text-brand-text-muted">Ton prochain tour de magie arrive bientôt !</p>
                            </div>
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLONNE GAUCHE (2/3) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* BLOC 3: NOUVEAUTÉS DU CLUB */}
                        <section>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-brand-gold" />
                                Les Nouveautés du Club
                            </h3>

                            <div className="space-y-4">
                                {recentItems.length > 0 ? (
                                    recentItems.map(item => (
                                        <Link key={item.id} href={item.is_main ? `/watch/${item.id}` : `/kids/courses`} className="group block">
                                            <div className="bg-brand-card/50 border border-brand-border rounded-xl p-4 flex items-center gap-4 hover:bg-brand-surface transition-all hover:border-brand-purple/30">
                                                <div className="w-16 h-16 bg-black rounded-lg shrink-0 overflow-hidden relative">
                                                    {item.thumbnail_url && <Image src={item.thumbnail_url} alt="" fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" />}
                                                    <div className="absolute top-1 right-1 bg-brand-blue text-[8px] font-bold px-1.5 py-0.5 rounded text-brand-bg uppercase">New</div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white group-hover:text-brand-purple transition-colors">{item.title}</h4>
                                                    <p className="text-xs text-brand-text-muted mt-1 line-clamp-1">Ajouté à ton espace Semaine {item.week_number}</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <ArrowRight className="w-4 h-4 text-brand-text-muted group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-brand-text-muted text-sm italic">Pas de nouveautés pour le moment.</div>
                                )}
                            </div>
                        </section>

                        {/* BLOC 5: DERNIÈRES RÉUSSITES */}
                        <section>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-brand-gold" />
                                Tes Dernières Réussites
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {previousWeeksItems.length > 0 ? (
                                    previousWeeksItems.map(item => (
                                        <div key={item.id} className="bg-brand-surface/30 border border-brand-border/50 rounded-xl p-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center border border-brand-green/30 text-brand-green">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-brand-text-muted uppercase font-bold">Semaine {item.week_number}</div>
                                                <div className="font-bold text-white text-sm">{item.title}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-6 border border-dashed border-brand-border rounded-xl text-brand-text-muted text-sm">
                                        Termine ta première semaine pour voir tes trophées ici !
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>

                    {/* COLONNE DROITE (1/3) */}
                    <div className="space-y-8">

                        {/* BLOC 4: PROGRESSION MAGIQUE */}
                        <section className="bg-brand-card border border-brand-border rounded-2xl p-6 sticky top-8">
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                                <Map className="w-5 h-5 text-brand-purple" />
                                Ta Progression
                            </h3>

                            <div className="text-center mb-6">
                                <div className="text-4xl font-black text-white mb-1">{currentWeek} <span className="text-lg text-brand-text-muted font-medium">/ {TOTAL_WEEKS}</span></div>
                                <div className="text-xs font-bold text-brand-purple uppercase tracking-widest">Semaines Complétées</div>
                            </div>

                            <div className="relative h-3 w-full bg-brand-bg rounded-full overflow-hidden mb-4">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all duration-1000"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>

                            <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-xl p-4 flex gap-3 items-start">
                                <PartyPopper className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
                                <p className="text-sm text-brand-text leading-relaxed">
                                    "Tu avances comme un vrai magicien ! Continue tes efforts, le prochain Secret est incroyable !"
                                </p>
                            </div>
                        </section>

                    </div>
                </div>

            </div>
        </div>
    );
}
