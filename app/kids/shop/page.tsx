import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Lock, Play, CheckCircle2 } from "lucide-react";

export const metadata = {
    title: 'La Boutique | Club des Magiciens',
    description: 'Découvre des tours de magie exclusifs et des formations premium.',
};

export default async function KidsShopPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Shop Items (Library items with a sales_page_url)
    const { data: shopItems, error: shopError } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "kids")
        .not("sales_page_url", "is", null)
        .order("published_at", { ascending: false });

    // 2. Fetch User Purchases to see what is already unlocked
    const { data: purchases, error: purchaseError } = await supabase
        .from("user_purchases")
        .select("library_item_id")
        .eq("user_id", user.id);

    const unlockedItemIds = new Set(purchases?.map(p => p.library_item_id) || []);

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans relative selection:bg-brand-gold/30">
            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-brand-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            La <span className="text-brand-purple">Boutique</span>
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            Découvre des accessoires magiques et des formations vidéo exclusives pour devenir un véritable Maître de l'Illusion.
                        </p>
                    </div>
                </header>

                {/* Shop Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shopItems && shopItems.length > 0 ? (
                        shopItems.map((item) => {
                            const isUnlocked = unlockedItemIds.has(item.id);

                            return (
                                <div key={item.id} className="relative group h-full flex flex-col hover:-translate-y-2 transition-transform duration-500">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-0 blur-lg group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
                                    <div className="relative bg-brand-card border border-white/5 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex flex-col h-full">
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-black/50 overflow-hidden">
                                            {item.thumbnail_url ? (
                                                <Image
                                                    src={item.thumbnail_url}
                                                    alt={item.title}
                                                    fill
                                                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!isUnlocked ? 'opacity-80 mix-blend-luminosity' : ''}`}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-brand-bg">
                                                    <Star className="w-12 h-12 text-white/10" />
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                {isUnlocked ? (
                                                    <div className="bg-green-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Débloqué
                                                    </div>
                                                ) : (
                                                    <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                                                        <Lock className="w-3.5 h-3.5 text-brand-gold" />
                                                        Secret Verrouillé
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price Tag (if locked) */}
                                            {!isUnlocked && item.price_label && (
                                                <div className="absolute bottom-4 left-4 bg-brand-gold text-black font-black px-4 py-2 rounded-xl shadow-xl transform -rotate-2">
                                                    {item.price_label}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-brand-text-muted mb-6 flex-1 line-clamp-3">
                                                {item.description || "Aucune description disponible pour ce secret..."}
                                            </p>

                                            {/* Action Button */}
                                            {isUnlocked ? (
                                                <Link href={`/kids/videos/${item.video_url || item.id}`} className="w-full bg-brand-purple/20 hover:bg-brand-purple text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-brand-purple/30">
                                                    <Play className="w-5 h-5" />
                                                    Regarder la vidéo
                                                </Link>
                                            ) : (
                                                <a href={`${item.sales_page_url}?prefilled_email=${encodeURIComponent(user.email || '')}&client_reference_id=${user.id}___${item.id}`} target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-brand-gold to-yellow-500 text-black font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_10px_30px_rgba(250,204,21,0.3)]">
                                                    <ShoppingBag className="w-5 h-5" />
                                                    Obtenir ce secret
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full bg-white/5 border border-white/5 p-12 rounded-3xl text-center flex flex-col items-center">
                            <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">La Boutique est fermée pour le moment</h3>
                            <p className="text-brand-text-muted">Reviens plus tard pour découvrir de nouveaux secrets magiques !</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
