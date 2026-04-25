import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Lock, Play, CheckCircle2, Package } from "lucide-react";

import ShopBuyWithXP from "@/components/kids/ShopBuyWithXP";
import SkinLocker from "@/components/kids/SkinLocker";
import BackButton from "@/components/BackButton";
import CheckoutButton from "@/components/CheckoutButton";
import { FadeInUp } from "@/components/adults/MotionWrapper";

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

    // 3. Fetch true XP balance for the user
    let trueXP = 0;
    try {
        const { data: xpLogs } = await supabase.from("user_xp_logs").select("xp_awarded").eq("user_id", user.id);
        if (xpLogs) {
            trueXP = xpLogs.reduce((acc, log) => acc + log.xp_awarded, 0);
        }
    } catch(e) {
        console.error("Could not fetch xp logs securely (maybe table not ready?)");
    }

    // 4. Fetch Avatars Data
    const { data: skins } = await supabase.from('avatar_skins').select('*').order('price_xp', { ascending: true });
    
    // 5. Fetch Profile (for equipped skin)
    const { data: profile } = await supabase.from('profiles').select('equipped_skin_id').eq('id', user.id).single();
    
    // 6. Fetch Unlocked Skins
    const { data: unlockedSkins } = await supabase.from('user_unlocked_skins').select('skin_id').eq('user_id', user.id);
    const unlockedSkinIds = unlockedSkins?.map(s => s.skin_id) || [];

    return (
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 pb-32 font-sans relative selection:bg-brand-gold/30">
            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-0 left-0 w-full md:w-1/2 h-[50vh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-gold/10 via-[#000000]/0 to-[#000000]/0 pointer-events-none z-0"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <FadeInUp delay={0.1}>
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                        <div className="flex-1">
                            <div className="mb-6">
                                <BackButton className="md:hidden" />
                            </div>
                            <div className="flex items-center gap-2 text-brand-gold mb-2">
                                <Star className="w-5 h-5 fill-current animate-pulse text-brand-gold" />
                                <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
                                La <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-500">Boutique</span>
                            </h1>
                            <p className="text-[#86868b] mt-3 text-lg md:text-xl font-light">
                                Découvre des accessoires magiques et des formations vidéo exclusives.
                            </p>
                        </div>
                    </header>
                </FadeInUp>

                <FadeInUp delay={0.2}>
                    {skins && skins.length > 0 && (
                        <SkinLocker 
                            skins={skins} 
                            unlockedSkinIds={unlockedSkinIds} 
                            equippedSkinId={profile?.equipped_skin_id || null} 
                            trueXP={trueXP} 
                        />
                    )}
                </FadeInUp>

                {/* Shop Grid */}
                <FadeInUp delay={0.3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shopItems && shopItems.length > 0 ? (
                            shopItems.map((item) => {
                                const isUnlocked = unlockedItemIds.has(item.id);

                                return (
                                    <div key={item.id} className="relative group h-full flex flex-col hover:-translate-y-2 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                                        <div className="relative bg-[#1c1c1e] border border-white/5 rounded-[32px] overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:border-white/10 flex flex-col h-full transition-all duration-500">
                                            {/* Glow effect */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                                            {/* Thumbnail */}
                                            <div className="relative aspect-video bg-[#000000] overflow-hidden shrink-0 border-b border-white/5">
                                                {item.thumbnail_url ? (
                                                    <Image
                                                        src={item.thumbnail_url}
                                                        alt={item.title}
                                                        fill
                                                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${!isUnlocked ? 'opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100' : ''}`}
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-[#2c2c2e]/50">
                                                        <Star className="w-12 h-12 text-[#86868b]" />
                                                    </div>
                                                )}

                                                {/* Status Badge */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    {isUnlocked ? (
                                                        <div className="bg-green-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Débloqué
                                                        </div>
                                                    ) : (
                                                        <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-white/10">
                                                            <Lock className="w-4 h-4 text-brand-gold" />
                                                            Verrouillé
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Price Tag (if locked) */}
                                                {!isUnlocked && item.price_label && (
                                                    <div className="absolute bottom-4 left-4 bg-brand-gold text-black font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-xl shadow-xl transform -rotate-2">
                                                        {item.price_label}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-8 flex flex-col flex-1 relative z-10">
                                                <h3 className="text-xl font-semibold text-[#f5f5f7] mb-3 leading-tight tracking-tight group-hover:text-brand-gold transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-[#86868b] font-light mb-8 flex-1 line-clamp-3">
                                                    {item.description || "Aucune description disponible pour ce secret..."}
                                                </p>

                                                {/* Action Button */}
                                                {isUnlocked ? (
                                                    <Link href={`/kids/videos/${item.id}`} className="w-full bg-[#2c2c2e]/50 hover:bg-white/10 text-white font-semibold uppercase tracking-widest text-[11px] py-4 px-4 rounded-full flex items-center justify-center gap-2 transition-colors border border-white/5">
                                                        <Play className="w-4 h-4" />
                                                        Regarder
                                                    </Link>
                                                ) : (
                                                    <div className="space-y-3 mt-auto">
                                                        <CheckoutButton itemId={item.id} space="kids" className="w-full bg-brand-gold hover:bg-yellow-400 text-black font-semibold uppercase tracking-widest text-[11px] py-4 px-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg hover:shadow-brand-gold/30">
                                                            <ShoppingBag className="w-4 h-4" />
                                                            Obtenir
                                                        </CheckoutButton>
                                                        {item.xp_price && item.xp_price > 0 && (
                                                            <ShopBuyWithXP itemId={item.id} xpPrice={item.xp_price} trueXP={trueXP} />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full bg-[#1c1c1e] border border-white/5 p-16 rounded-[32px] text-center flex flex-col items-center shadow-xl">
                                <ShoppingBag className="w-20 h-20 text-[#86868b] mb-6 opacity-50" />
                                <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-3 tracking-tight">La Boutique est fermée</h3>
                                <p className="text-[#86868b] font-light">Reviens plus tard pour découvrir de nouveaux secrets magiques !</p>
                            </div>
                        )}
                    </div>
                </FadeInUp>
            </div>
        </div>
    );
}
