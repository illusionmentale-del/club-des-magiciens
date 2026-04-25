import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShoppingBag, CheckCircle2, Lock, Play } from "lucide-react";
import CheckoutButton from "@/components/CheckoutButton";
import BackButton from "@/components/BackButton";
import { FadeInUp, BentoHoverEffect } from "@/components/adults/MotionWrapper";

export const metadata = {
    title: 'La Boutique | L\'Atelier des Magiciens',
    description: 'Découvrez des tours de magie exclusifs et des formations premium pour adultes.',
};

export default async function AdultShopPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Shop Items (Library items with a sales_page_url for adults)
    const { data: shopItems } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "adults")
        .not("sales_page_url", "is", null)
        .order("published_at", { ascending: false });

    // 2. Fetch User Purchases to see what is already unlocked
    const { data: purchases } = await supabase
        .from("user_purchases")
        .select("library_item_id")
        .eq("user_id", user.id);

    const unlockedItemIds = new Set(purchases?.map(p => p.library_item_id) || []);

    return (
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 pb-32 font-sans relative selection:bg-white/30">

            <div className="max-w-6xl mx-auto relative z-10">
                <BackButton />
                {/* Header */}
                <FadeInUp delay={0.1}>
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4 border-b border-white/5 pb-8 mb-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-[#86868b] mb-2">
                                <Sparkles className="w-5 h-5 text-[#f5f5f7]" />
                                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Nouveautés & Exclusivités</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#f5f5f7] mt-2">
                                La Boutique
                            </h1>
                            <p className="text-[#86868b] mt-3 text-xl font-light max-w-2xl">
                                Découvrez des accessoires exclusifs et des masterclass premium pour parfaire votre art de l'illusion.
                            </p>
                        </div>
                    </header>
                </FadeInUp>

                {/* Shop Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {shopItems && shopItems.length > 0 ? (
                        shopItems.map((item, index) => {
                            const isUnlocked = unlockedItemIds.has(item.id);

                            return (
                                <FadeInUp key={item.id} delay={0.2 + (index * 0.1)}>
                                    <div className="relative group h-full flex flex-col hover:-translate-y-2 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                                        <div className="relative bg-[#1c1c1e] border border-white/5 rounded-[32px] overflow-hidden shadow-xl flex flex-col h-full hover:shadow-2xl hover:border-white/10 transition-all">
                                            {/* Thumbnail */}
                                            <div className="relative aspect-video bg-black overflow-hidden m-2 rounded-[24px]">
                                                {item.thumbnail_url ? (
                                                    <Image
                                                        src={item.thumbnail_url}
                                                        alt={item.title}
                                                        fill
                                                        className={`object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105 ${!isUnlocked ? 'opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100' : ''}`}
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-[#2c2c2e]">
                                                        <Sparkles className="w-12 h-12 text-[#86868b]" />
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>

                                                {/* Status Badge */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    {isUnlocked ? (
                                                        <div className="bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Possédé
                                                        </div>
                                                    ) : (
                                                        <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md border border-white/10">
                                                            <Lock className="w-3.5 h-3.5 text-[#86868b]" />
                                                            Verrouillé
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Price Tag (if locked) */}
                                                {!isUnlocked && item.price_label && (
                                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-black font-semibold px-4 py-2 rounded-full shadow-lg z-10">
                                                        {item.price_label}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 md:p-8 flex flex-col flex-1 relative z-20">
                                                <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-3 tracking-tight group-hover:text-white transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-base text-[#86868b] mb-8 flex-1 line-clamp-3 font-light leading-relaxed">
                                                    {item.description || "Aucune description disponible."}
                                                </p>

                                                {/* Action Button */}
                                                {isUnlocked ? (
                                                    <Link href={`/watch/${item.id}`} className="w-full bg-[#2c2c2e] hover:bg-white text-[#f5f5f7] hover:text-black font-medium text-base py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
                                                        <Play className="w-5 h-5" />
                                                        Accéder au contenu
                                                    </Link>
                                                ) : (
                                                    <CheckoutButton itemId={item.id} space="adults" className="w-full bg-[#f5f5f7] hover:bg-white text-black font-medium text-base py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]">
                                                        <ShoppingBag className="w-5 h-5" />
                                                        Obtenir ce contenu
                                                    </CheckoutButton>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </FadeInUp>
                            );
                        })
                    ) : (
                        <FadeInUp delay={0.2}>
                            <div className="col-span-full bg-[#1c1c1e] border border-white/5 p-16 rounded-[32px] text-center flex flex-col items-center shadow-xl">
                                <ShoppingBag className="w-16 h-16 text-[#86868b] mb-4 opacity-50" />
                                <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">La Boutique est en cours de réapprovisionnement</h3>
                                <p className="text-[#86868b] font-light">Revenez plus tard pour découvrir de nouvelles masterclass exclusives !</p>
                            </div>
                        </FadeInUp>
                    )}
                </div>

            </div>
        </div>
    );
}
