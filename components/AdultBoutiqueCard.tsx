"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, CheckCircle2, ShoppingBag, Lock, Loader2, PlayCircle } from "lucide-react";

interface AdultBoutiqueCardProps {
    product: {
        id: string;
        title: string;
        description: string;
        price: number;
        image_url?: string;
        stripe_price_id?: string;
        type: string;
        sales_page_url?: string;
    };
    isPurchased: boolean;
}

export default function AdultBoutiqueCard({ product, isPurchased }: AdultBoutiqueCardProps) {
    const [loading, setLoading] = useState(false);

    const handlePurchase = async () => {
        if (isPurchased) return;

        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: product.stripe_price_id,
                    productId: product.id,
                    isSubscription: product.type === 'subscription',
                    space: 'adults'
                })
            });

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                console.error("No checkout URL returned");
            }
        } catch (error) {
            console.error("Purchase error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate price string
    const priceString = product.price > 0 ? `${(product.price / 100).toFixed(2)}€` : "Gratuit";

    return (
        <div className="relative group h-full flex flex-col hover:-translate-y-2 transition-transform duration-500">
            {/* Adult Theme Glow effect (Magic Gold / Amber instead of Purple / Blue) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-magic-gold/80 to-amber-600/50 rounded-3xl opacity-0 blur-lg group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>

            <div className="relative bg-[#0a0a0f] border border-white/5 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col h-full">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#111] overflow-hidden">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${!isPurchased ? 'opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100' : ''}`}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
                            <PlayCircle className="w-12 h-12 text-white/10" />
                        </div>
                    )}

                    {/* Gradient Overlay for better contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                        {isPurchased ? (
                            <div className="bg-green-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-green-400/30">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Débloqué
                            </div>
                        ) : (
                            <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                                <Lock className="w-3.5 h-3.5 text-magic-gold" />
                                Premium
                            </div>
                        )}
                    </div>

                    {/* Price Tag (if locked) */}
                    {!isPurchased && (
                        <div className="absolute bottom-4 left-4 bg-magic-gold text-black font-black px-4 py-1.5 rounded-xl shadow-xl transform -rotate-2 z-10">
                            {priceString}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 relative z-20 bg-[#0a0a0f]">
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-magic-gold transition-colors">
                        {product.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-3 font-light">
                        {product.description || "Découvrez ce programme exclusif pour améliorer votre technique magique."}
                    </p>

                    {/* Action Button */}
                    {isPurchased ? (
                        <Link href={`/dashboard/program`} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10 hover:border-magic-gold/50">
                            <Play className="w-5 h-5 text-magic-gold" />
                            Accéder au contenu
                        </Link>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            disabled={loading || !product.stripe_price_id}
                            className="w-full bg-gradient-to-r from-magic-gold to-yellow-500 text-black font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_10px_30px_rgba(238,195,67,0.2)] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <ShoppingBag className="w-5 h-5" />
                                    Acheter maintenant
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
