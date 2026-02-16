import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Calendar, ShoppingBag, ExternalLink, Instagram, Star, Video } from "lucide-react";
import { LiveStatusCard } from "@/components/LiveStatusCard";

export default async function DashboardPage() {
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

    const lives = livesRes.data || [];

    // Priority 1: En Cours
    let nextLive = lives.find(l => l.status === 'en_cours');

    // Priority 2: Programmé (Next one)
    if (!nextLive) {
        nextLive = lives.find(l => l.status === 'programmé' && new Date(l.start_date).getTime() > Date.now());
        // If no future programmed, maybe show latest replay?
        if (!nextLive) {
            const replays = lives.filter(l => l.status === 'terminé' && l.platform === 'vimeo');
            if (replays.length > 0) nextLive = replays[replays.length - 1]; // Last replay
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
    const featuredVideo = settings["featured_video"] || "5K17iK1vF6s";
    const shopLink = settings["shop_link"] || "#";
    const dashboardTitle = settings["dashboard_title"] || "Le QG du Club";

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans selection:bg-blue-500/30 overflow-hidden relative">

            {/* Ambient Background Lights */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Header / Hero - Minimalist & Geometric */}
            <header className="mb-16 max-w-7xl mx-auto relative z-10 pt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-1 bg-blue-600"></div>
                            <span className="text-blue-500 text-xs font-bold tracking-[0.2em] uppercase">Club des Magiciens</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-2">
                            Quartier<br />Général
                        </h1>
                        <p className="text-xl text-slate-400 font-light flex items-center gap-2">
                            Bon retour parmi nous, <span className="text-white font-medium border-b border-blue-500/50 pb-0.5">{userName}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <div className="text-3xl font-bold font-mono">{lives.length}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Lives & Replays</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">

                {/* LEFT COLUMN (News & Video) */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Featured Video - Cinematic Style */}
                    <div className="relative group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                À la une
                            </h3>
                        </div>

                        <div className="aspect-video bg-black border border-white/10 relative overflow-hidden group-hover:border-white/20 transition-colors">
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
                                        <div className="w-20 h-20 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                                            <Play className="w-8 h-8 text-white fill-white stroke-none" />
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
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white uppercase tracking-wide border-b border-white/5 pb-4">
                            <Calendar className="w-5 h-5 text-slate-500" />
                            Journal de Bord
                        </h2>

                        <div className="space-y-4">
                            {newsRes.data?.map((item) => (
                                <div key={item.id} className="bg-[#0F1014] border border-white/5 p-6 hover:border-l-4 hover:border-l-blue-500 transition-all group">
                                    <div className="flex items-start justify-between gap-6">
                                        <div>
                                            <div className="text-[10px] text-slate-500 mb-2 font-mono uppercase">
                                                {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed font-light">{item.content}</p>
                                        </div>
                                        {item.link_url && (
                                            <Link href={item.link_url} className="shrink-0 p-3 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )) || <div className="text-slate-600 font-mono uppercase text-xs p-4 border border-dashed border-white/5">Aucune donnée entrante.</div>}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (Shop & Social) */}
                <div className="space-y-12">

                    {/* Boutique Widget - Box Style */}
                    <div className="bg-[#0F1014] border border-white/5 p-8 relative overflow-hidden group hover:border-amber-500/20 transition-colors">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <ShoppingBag className="w-4 h-4 text-amber-500" />
                                Équipement
                            </h2>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {products.length > 0 ? products.map(product => (
                                <a key={product.id} href={product.link_url} target="_blank" className="bg-black/40 border border-white/5 overflow-hidden hover:border-white/20 transition-all block group/product relative aspect-square">
                                    {product.image_url ? (
                                        <Image src={product.image_url} alt={product.title} fill className="object-cover opacity-70 group-hover/product:opacity-100 transition-opacity grayscale group-hover/product:grayscale-0" />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <div className="w-8 h-8 border border-white/10 rotate-45"></div>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 border-t border-white/5">
                                        <div className="text-[9px] text-amber-500 font-bold font-mono text-center">{product.price || "N/A"}</div>
                                    </div>
                                </a>
                            )) : (
                                <div className="col-span-2 text-center text-xs text-slate-600 py-4 font-mono">// INVENTAIRE VIDE //</div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/5 text-center">
                            <Link href={shopLink} className="text-xs font-bold text-amber-500 hover:text-white transition-colors uppercase tracking-widest">
                                Accéder au Shop
                            </Link>
                        </div>
                    </div>

                    {/* Instagram Widget - Grid */}
                    <div className="bg-[#0F1014] border border-white/5 p-8 relative overflow-hidden group hover:border-pink-500/20 transition-colors">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-8 text-white relative z-10 uppercase tracking-widest">
                            <Instagram className="w-4 h-4 text-pink-500" />
                            Social
                        </h2>

                        <div className="grid grid-cols-3 gap-1 relative z-10">
                            {instagramPosts.length > 0 ? instagramPosts.map(post => (
                                <a key={post.id} href={post.link_url || "#"} target="_blank" className="aspect-square bg-white/5 relative hover:opacity-100 opacity-60 transition-opacity block border border-white/5 grayscale hover:grayscale-0">
                                    {post.image_url && <Image src={post.image_url} alt="Insta" fill className="object-cover" />}
                                </a>
                            )) : (
                                [1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square bg-white/5 border border-white/5"></div>
                                ))
                            )}
                        </div>
                        <a href="https://instagram.com" target="_blank" className="block text-center mt-6 text-xs text-slate-500 hover:text-pink-500 font-bold uppercase tracking-wider transition-colors relative z-10">
                            @clubdesmagiciens
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
