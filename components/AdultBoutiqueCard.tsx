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
            <div className="relative bg-black border border-white/10 rounded-none overflow-hidden shadow-2xl flex flex-col h-full hover:border-magic-royal transition-colors">
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
                            <div className="bg-green-500 text-black px-3 py-1.5 rounded-none text-xs font-serif uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-green-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Débloqué
                            </div>
                        ) : (
                            <div className="bg-black text-white px-3 py-1.5 rounded-none text-xs font-serif uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-white/10">
                                <Lock className="w-3.5 h-3.5 text-magic-royal" />
                                Premium
                            </div>
                        )}
                    </div>

                    {/* Price Tag (if locked) */}
                    {!isPurchased && (
                        <div className="absolute bottom-4 left-4 bg-magic-royal text-black font-serif px-4 py-2 rounded-none shadow-xl border border-magic-royal/50 z-10">
                            {priceString}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 relative z-20 bg-black">
                    <h3 className="text-xl font-serif text-white mb-2 leading-tight group-hover:text-magic-royal transition-colors">
                        {product.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-3 font-light">
                        {product.description || "Découvrez ce programme exclusif pour améliorer votre technique magique."}
                    </p>

                    {/* Action Button */}
                    {isPurchased ? (
                        <Link href={`/dashboard/program`} className="w-full bg-black hover:bg-magic-royal/10 text-magic-royal font-serif uppercase tracking-widest text-sm py-3 px-4 rounded-none flex items-center justify-center gap-2 transition-colors border border-magic-royal/30">
                            <Play className="w-5 h-5 text-magic-royal" />
                            Accéder au contenu
                        </Link>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            disabled={loading || !product.stripe_price_id}
                            className="w-full bg-magic-royal hover:bg-amber-400 text-black font-serif uppercase tracking-widest text-sm py-3 px-4 rounded-none flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
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
