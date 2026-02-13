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
    const welcomeMsg = settings["welcome_message"] || "Bienvenue dans le QG du Club !";
    const featuredVideo = settings["featured_video"] || "5K17iK1vF6s";
    const shopLink = settings["shop_link"] || "#";
    const dashboardTitle = settings["dashboard_title"] || "Le QG du Club ✨";
    const newsTitle = settings["news_title"] || "Quoi de neuf ?";
    const instagramTitle = settings["instagram_title"] || "Sur Instagram";

    return (
        <div className="min-h-screen text-gray-900 p-4 md:p-8 pb-32">

            {/* Header / Welcome */}
            <header className="mb-12 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-4 animate-fade-in-up filter drop-shadow-sm">
                    {dashboardTitle}
                </h1>
                <p className="text-xl text-gray-600 font-light flex items-center gap-2">
                    Bonjour, <span className="text-gray-900 font-bold">{userName}</span>. {welcomeMsg}
                </p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN (News & Video) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Featured Video */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Play className="w-5 h-5 text-red-500" />
                            </div>
                            <h3 className="font-bold text-gray-900">Découverte du mois</h3>
                        </div>

                        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative shadow-inner">
                            {featuredVideo ? (
                                <a
                                    href={`https://www.youtube.com/watch?v=${featuredVideo}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full relative"
                                >
                                    <Image
                                        src={`https://img.youtube.com/vi/${featuredVideo}/maxresdefault.jpg`}
                                        alt="Découverte du mois"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-red-600 ml-1" />
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Vidéo non disponible
                                </div>
                            )}
                        </div>
                    </div>

                    {/* News Feed */}
                    <div className="relative">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                            <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                            {newsTitle}
                        </h2>

                        <div className="space-y-4">
                            {newsRes.data?.map((item) => (
                                <div key={item.id} className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl hover:shadow-md transition-shadow group">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-xs text-purple-600 mb-2 font-bold uppercase tracking-wider flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(item.date).toLocaleDateString()}
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">{item.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                                        </div>
                                        {item.link_url && (
                                            <Link href={item.link_url} className="shrink-0 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                                                <ExternalLink className="w-5 h-5 text-gray-500" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )) || <div className="text-gray-500">Aucune actualité pour le moment.</div>}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (Shop & Social) */}
                <div className="space-y-8">

                    {/* Boutique Widget */}
                    <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 shadow-sm rounded-3xl p-6 relative overflow-hidden group">

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-amber-600" />
                                La Boutique
                            </h2>
                            <Link href={shopLink} className="text-xs text-amber-600 hover:text-amber-700 font-bold uppercase tracking-wider">
                                Tout voir
                            </Link>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            {products.length > 0 ? products.map(product => (
                                <a key={product.id} href={product.link_url} target="_blank" className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow border border-gray-100 block group/product">
                                    <div className="aspect-square relative">
                                        {product.image_url ? (
                                            <Image src={product.image_url} alt={product.title} fill className="object-cover transition-opacity" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100" />
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <div className="font-bold text-xs truncate text-gray-800">{product.title}</div>
                                        <div className="text-[10px] text-amber-600 font-bold">{product.price || "Gratuit"}</div>
                                    </div>
                                </a>
                            )) : (
                                <div className="col-span-2 text-center text-xs text-gray-400 py-4">Bientôt disponible...</div>
                            )}
                        </div>
                    </div>

                    {/* Instagram Widget */}
                    <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-200 shadow-sm rounded-3xl p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-pink-900">
                            <Instagram className="w-5 h-5 text-pink-500" />
                            {instagramTitle}
                        </h2>

                        <div className="grid grid-cols-3 gap-2">
                            {instagramPosts.length > 0 ? instagramPosts.map(post => (
                                <a key={post.id} href={post.link_url || "#"} target="_blank" className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative hover:opacity-80 transition-opacity block">
                                    {post.image_url && <Image src={post.image_url} alt="Insta" fill className="object-cover" />}
                                </a>
                            )) : (
                                [1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>
                                ))
                            )}
                        </div>
                        <a href="https://instagram.com" target="_blank" className="block text-center mt-6 text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors">
                            Suivre @clubdesmagiciens
                        </a>
                    </div>

                    {/* Live Widget - Component needs to be light-theme aware? Or just generic? Current one is likely dark. */}
                    <div className="mt-auto">
                        <LiveStatusCard live={nextLive} />
                    </div>

                </div>
            </div>
        </div>
    );
}
