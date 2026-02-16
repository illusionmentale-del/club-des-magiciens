import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Calendar, ShoppingBag, ExternalLink, Instagram } from "lucide-react";
import { LiveStatusCard } from "@/components/LiveStatusCard";

export default async function KidsDashboardPage() {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // 2. Fetch all data in parallel
    const [profileRes, newsRes, settingsRes, productsRes, instagramRes, livesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("news").select("*").order("date", { ascending: false }).limit(3),
        supabase.from("settings").select("*"),
        supabase.from("products").select("*").order("created_at", { ascending: false }).limit(6),
        supabase.from("instagram_posts").select("*").order("created_at", { ascending: false }).limit(6),
        supabase.from("lives").select("*").order("start_date", { ascending: true })
    ]);

    // Logic to pick the "Best" live to show
    const lives = livesRes.data || [];
    let nextLive = lives.find(l => l.status === 'en_cours');
    if (!nextLive) {
        nextLive = lives.find(l => l.status === 'programmé' && new Date(l.start_date).getTime() > Date.now());
        if (!nextLive) {
            const replays = lives.filter(l => l.status === 'terminé' && l.platform === 'vimeo');
            if (replays.length > 0) nextLive = replays[replays.length - 1];
        }
    }

    const profile = profileRes.data;
    const settings = settingsRes.data?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    const products = productsRes.data || [];
    const instagramPosts = instagramRes.data || [];

    const userName = profile?.full_name || user.email?.split("@")[0] || "Magicien";

    // Helper for Settings with Fallback
    const getSetting = (key: string, defaultVal: string) => {
        return settings[`kid_${key}`] || settings[key] || defaultVal;
    };

    const welcomeMsg = getSetting("welcome_message", "Bienvenue dans le QG du Club !");
    const featuredVideo = getSetting("featured_video", "5K17iK1vF6s");
    const shopLink = getSetting("shop_link", "#");
    const dashboardTitle = getSetting("dashboard_title", "Le QG du Club ✨");
    const newsTitle = getSetting("news_title", "Quoi de neuf ?");
    const instagramTitle = getSetting("instagram_title", "Sur Instagram");

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans selection:bg-brand-blue/30 overflow-hidden relative">

            {/* Ambient Background Lights */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-brand-blue/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-purple/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Header / Hero */}
            <header className="mb-16 max-w-7xl mx-auto relative z-10 pt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-1 bg-brand-blue"></div>
                            <span className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase">Club des Magiciens</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-brand-text uppercase tracking-tight leading-none mb-2">
                            Quartier<br />Général
                        </h1>
                        <p className="text-xl text-brand-text-muted font-light flex items-center gap-2">
                            Ravi de vous revoir, <span className="text-brand-text font-medium border-b border-brand-blue/50 pb-0.5">{userName}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <div className="text-3xl font-bold font-mono">{lives.length}</div>
                            <div className="text-[10px] text-brand-text-muted uppercase tracking-widest">Lives à venir</div>
                        </div>
                        {/* We can add a larger profile avatar here later */}
                    </div>
                </div>
            </header>

            {/* FEATURED: 3 MAGIC TRICKS (Geometric Cards) */}
            <section className="max-w-7xl mx-auto mb-20 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text uppercase tracking-wide">
                        <span className="w-2 h-2 bg-brand-blue rounded-full shadow-[0_0_10px_#3b82f6]"></span>
                        Nouveaux Modules
                    </h2>
                    <Link href="/kids/courses" className="text-xs font-bold text-brand-text-muted hover:text-brand-text transition-colors uppercase tracking-widest border-b border-brand-border hover:border-brand-text pb-1">
                        Tout voir
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "La Pièce Fantôme", level: "01", time: "12:45", icon: "🪙", color: "blue" },
                        { title: "Téléportation", level: "02", time: "08:30", icon: "🃏", color: "purple" },
                        { title: "La Corde Matrix", level: "01", time: "15:20", icon: "🪢", color: "cyan" }
                    ].map((trick, i) => (
                        <div key={i} className="group relative bg-brand-card border border-brand-border h-[280px] flex flex-col hover:border-brand-blue/30 transition-all duration-500 cursor-pointer overflow-hidden">
                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-brand-border group-hover:border-brand-blue/50 transition-colors"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-brand-border group-hover:border-brand-purple/50 transition-colors"></div>

                            {/* Image Area/Icon */}
                            <div className="h-40 bg-gradient-to-br from-brand-surface to-brand-bg relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10"></div>
                                <span className="text-6xl filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110 drop-shadow-2xl">{trick.icon}</span>

                                {/* Play Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                                    <Play className="w-12 h-12 text-brand-text fill-brand-text stroke-1" />
                                </div>

                                <div className="absolute bottom-3 right-3 bg-black/80 text-[10px] font-mono text-brand-text px-2 py-0.5 border border-brand-border">
                                    {trick.time}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest text-${trick.color}-500 border border-${trick.color}-900/50 px-1.5 py-0.5 bg-${trick.color}-900/10`}>
                                            Niveau {trick.level}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-text uppercase tracking-tight group-hover:text-brand-blue transition-colors">{trick.title}</h3>
                                </div>
                                <div className="w-full h-[1px] bg-white/5 group-hover:bg-brand-blue/50 transition-colors"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">

                {/* LEFT COLUMN (News & Video) */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Featured Video - Cinematic Style */}
                    <div className="relative group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-brand-text uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-brand-error rounded-full animate-pulse"></div>
                                À la une
                            </h3>
                        </div>

                        <div className="aspect-video bg-black border border-brand-border relative overflow-hidden group-hover:border-brand-border/20 transition-colors">
                            {featuredVideo ? (
                                <a
                                    href={`https://www.youtube.com/watch?v=${featuredVideo}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full relative"
                                >
                                    <Image
                                        src={`https://img.youtube.com/vi/${featuredVideo}/maxresdefault.jpg`}
                                        alt="Start"
                                        fill
                                        className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 border border-brand-border/30 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                                            <Play className="w-8 h-8 text-brand-text fill-brand-text stroke-none" />
                                        </div>
                                    </div>

                                    {/* Scanlines Effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                                </a>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-600 font-mono text-xs">
                                    // SIGNAL PERDU //
                                </div>
                            )}
                        </div>
                    </div>

                    {/* News Feed - Terminal Style */}
                    <div className="relative">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-brand-text uppercase tracking-wide border-b border-brand-border pb-4">
                            <Calendar className="w-5 h-5 text-brand-text-muted" />
                            Journal de Bord
                        </h2>

                        <div className="space-y-4">
                            {newsRes.data?.map((item) => (
                                <div key={item.id} className="bg-brand-card border border-brand-border p-6 hover:border-l-4 hover:border-l-brand-blue transition-all group">
                                    <div className="flex items-start justify-between gap-6">
                                        <div>
                                            <div className="text-[10px] text-brand-text-muted mb-2 font-mono uppercase">
                                                {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 text-brand-text group-hover:text-brand-blue transition-colors uppercase tracking-tight">{item.title}</h3>
                                            <p className="text-brand-text-muted text-sm leading-relaxed font-light">{item.content}</p>
                                        </div>
                                        {item.link_url && (
                                            <Link href={item.link_url} className="shrink-0 p-3 border border-brand-border hover:bg-white/5 text-brand-text-muted hover:text-brand-text transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )) || <div className="text-brand-text-muted font-mono uppercase text-xs p-4 border border-dashed border-brand-border">Aucune donnée entrante.</div>}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (Shop & Social) */}
                <div className="space-y-12">

                    {/* Boutique Widget - Box Style */}
                    <div className="bg-brand-card border border-brand-border p-8 relative overflow-hidden group hover:border-brand-gold/20 transition-colors">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-lg font-bold text-brand-text flex items-center gap-2 uppercase tracking-widest">
                                <ShoppingBag className="w-4 h-4 text-brand-gold" />
                                Équipement
                            </h2>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {products.length > 0 ? products.map(product => (
                                <a key={product.id} href={product.link_url} target="_blank" className="bg-black/40 border border-brand-border overflow-hidden hover:border-brand-border/20 transition-all block group/product relative aspect-square">
                                    {product.image_url ? (
                                        <Image src={product.image_url} alt={product.title} fill className="object-cover opacity-70 group-hover/product:opacity-100 transition-opacity grayscale group-hover/product:grayscale-0" />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <div className="w-8 h-8 border border-white/10 rotate-45"></div>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 border-t border-brand-border/50">
                                        <div className="text-[9px] text-brand-gold font-bold font-mono text-center">{product.price || "N/A"}</div>
                                    </div>
                                </a>
                            )) : (
                                <div className="col-span-2 text-center text-xs text-brand-text-muted py-4 font-mono">// INVENTAIRE VIDE //</div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-brand-border text-center">
                            <Link href={shopLink} className="text-xs font-bold text-brand-gold hover:text-brand-text transition-colors uppercase tracking-widest">
                                Accéder au Shop
                            </Link>
                        </div>
                    </div>

                    {/* Instagram Widget - Grid */}
                    <div className="bg-brand-card border border-brand-border p-8 relative overflow-hidden group hover:border-pink-500/20 transition-colors">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-8 text-brand-text relative z-10 uppercase tracking-widest">
                            <Instagram className="w-4 h-4 text-pink-500" />
                            Social
                        </h2>

                        <div className="grid grid-cols-3 gap-1 relative z-10">
                            {instagramPosts.length > 0 ? instagramPosts.map(post => (
                                <a key={post.id} href={post.link_url || "#"} target="_blank" className="aspect-square bg-white/5 relative hover:opacity-100 opacity-60 transition-opacity block border border-brand-border grayscale hover:grayscale-0">
                                    {post.image_url && <Image src={post.image_url} alt="Insta" fill className="object-cover" />}
                                </a>
                            )) : (
                                [1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square bg-white/5 border border-white/5"></div>
                                ))
                            )}
                        </div>
                        <a href="https://instagram.com" target="_blank" className="block text-center mt-6 text-xs text-brand-text-muted hover:text-pink-500 font-bold uppercase tracking-wider transition-colors relative z-10">
                            @clubdesmagiciens
                        </a>
                    </div>

                    {/* Live Widget */}
                    <div className="mt-auto border-t border-brand-border pt-8">
                        <LiveStatusCard live={nextLive} />
                    </div>

                </div>
            </div>
        </div>
    );

}
