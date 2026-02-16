import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, CheckCircle, Lock, Trophy, Map, Star, ArrowRight, Sparkles, Bell, PartyPopper, ShoppingBag, Package } from "lucide-react";

export default async function KidsHomePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile & Tenure
    const { data: profile } = await supabase
        .from("profiles")
        .select("created_at, display_name, first_name, magic_level, xp") // Added magic_level, xp
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
        .lte("week_number", currentWeek) // Only unlocked stuff
        .order("week_number", { ascending: false });

    // Block 2: Atelier de la Semaine
    const currentItems = allItems?.filter(i => i.week_number === currentWeek) || [];
    const mainItem = currentItems.find(i => i.is_main) || currentItems[0];

    // Block 3: Nouveautés
    // Filter out the main item of current week to avoid redundancy
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

                {/* BLOC 2: ATELIER DE LA SEMAINE (ID for Anchor) */}
                <section id="atelier" className="relative group scroll-mt-24">
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

                        {/* BLOC 4: PROGRESSION MAGIQUE */}
                        <section className="bg-brand-card border border-brand-border rounded-2xl p-6 sticky top-8">
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                                <Map className="w-5 h-5 text-brand-purple" />
                                Ta Progression
                            </h3>

                            <div className="text-center mb-6">
                                <div className="inline-block px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-xs font-bold uppercase tracking-widest mb-2">
                                    Grade Actuel: {userGrade}
                                </div>
                                <div className="text-4xl font-black text-white mb-1">{currentWeek} <span className="text-lg text-brand-text-muted font-medium">/ {TOTAL_WEEKS}</span></div>
                                <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">Semaines Complétées</div>
                            </div>

                            <div className="relative h-3 w-full bg-brand-bg rounded-full overflow-hidden mb-4">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all duration-1000"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>

                            <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-xl p-4 flex gap-3 items-start mb-6">
                                <PartyPopper className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
                                <p className="text-sm text-brand-text leading-relaxed">
                                    "Continue comme ça ! Chaque semaine te rapproche du grade de Grand Magicien."
                                </p>
                            </div>

                            <Link href="/kids/account" className="block w-full text-center py-2 text-xs font-bold text-brand-text-muted hover:text-white transition-colors uppercase tracking-widest border border-white/10 rounded-lg hover:bg-white/5">
                                Voir mon parcours complet
                            </Link>
                        </section>

                        {/* BLOC 5: DÉCOUVRIR LA BOUTIQUE */}
                        <section className="bg-gradient-to-br from-brand-card to-brand-bg border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-purple/20 transition-colors"></div>

                            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4 flex items-center gap-2 relative z-10">
                                <ShoppingBag className="w-5 h-5 text-brand-purple" />
                                La Boutique
                            </h3>

                            <p className="text-sm text-brand-text-muted mb-6 relative z-10">
                                Envie d'aller plus loin ? Découvre les packs spéciaux pour enrichir ta magie.
                            </p>

                            <Link
                                href="/kids/courses"
                                className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all relative z-10 uppercase tracking-wide text-xs group-hover:border-brand-purple/30 group-hover:text-brand-purple"
                            >
                                Visiter la Boutique
                            </Link>
                        </section>

                    </div>
                </div>

            </div>
        </div>
    );
}
