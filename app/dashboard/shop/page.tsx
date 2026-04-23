import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShoppingBag, CheckCircle2, Lock, Play } from "lucide-react";
import CheckoutButton from "@/components/CheckoutButton";
import BackButton from "@/components/BackButton";

export const metadata = {
    title: 'La Boutique | Club des Magiciens',
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
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-32 font-sans relative selection:bg-magic-royal/30">

            <div className="max-w-6xl mx-auto relative z-10">
                <BackButton />
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4 border-b border-white/5 pb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-magic-royal mb-2">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Nouveautés & Exclusivités</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-2">
                            La <span className="text-magic-gold">Boutique</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg font-light max-w-2xl">
                            Découvrez des accessoires exclusifs et des masterclass premium pour parfaire votre art de l'illusion.
                        </p>
                    </div>
                </header>

                {/* Shop Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {shopItems && shopItems.length > 0 ? (
                        shopItems.map((item) => {
                            const isUnlocked = unlockedItemIds.has(item.id);

                            return (
                                <div key={item.id} className="relative group h-full flex flex-col hover:-translate-y-2 transition-transform duration-500">
                                    <div className="relative bg-black border border-white/10 rounded-none overflow-hidden shadow-2xl flex flex-col h-full hover:border-magic-royal transition-colors">
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-black/80 overflow-hidden">
                                            {item.thumbnail_url ? (
                                                <Image
                                                    src={item.thumbnail_url}
                                                    alt={item.title}
                                                    fill
                                                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!isUnlocked ? 'opacity-80 mix-blend-luminosity' : ''}`}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]">
                                                    <Sparkles className="w-12 h-12 text-white/10" />
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                {isUnlocked ? (
                                                    <div className="bg-green-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Possédé
                                                    </div>
                                                ) : (
                                                    <div className="bg-black text-white px-3 py-1.5 rounded-none text-xs font-serif uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-white/10">
                                                        <Lock className="w-3.5 h-3.5 text-magic-gold" />
                                                        Verrouillé
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price Tag (if locked) */}
                                            {!isUnlocked && item.price_label && (
                                                <div className="absolute bottom-4 left-4 bg-magic-royal text-black font-serif px-4 py-2 rounded-none shadow-xl border border-magic-royal/50">
                                                    {item.price_label}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2 font-serif leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-3">
                                                {item.description || "Aucune description disponible."}
                                            </p>

                                            {/* Action Button */}
                                            {isUnlocked ? (
                                                <Link href={`/watch/${item.id}`} className="w-full bg-black hover:bg-magic-royal/10 text-magic-royal font-serif uppercase tracking-widest text-sm py-3 px-4 rounded-none flex items-center justify-center gap-2 transition-colors border border-magic-royal/30">
                                                    <Play className="w-5 h-5" />
                                                    Accéder au contenu
                                                </Link>
                                            ) : (
                                                <CheckoutButton itemId={item.id} space="adults" className="w-full bg-magic-royal text-black font-serif uppercase tracking-widest text-sm py-3 px-4 rounded-none flex items-center justify-center gap-2 transition-colors">
                                                    <ShoppingBag className="w-5 h-5" />
                                                    Obtenir ce contenu
                                                </CheckoutButton>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full bg-white/5 border border-white/5 p-12 rounded-3xl text-center flex flex-col items-center">
                            <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2 font-serif">La Boutique est en cours de réapprovisionnement</h3>
                            <p className="text-slate-400">Revenez plus tard pour découvrir de nouvelles masterclass exclusives !</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
