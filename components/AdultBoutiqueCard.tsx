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
        <div className="relative group h-full flex flex-col hover:-translate-y-2 transition-transform duration-500 ease-[0.16,1,0.3,1]">
            <div className="relative bg-[#1c1c1e] border border-white/5 rounded-[32px] overflow-hidden shadow-xl flex flex-col h-full hover:shadow-2xl hover:border-white/10 transition-all">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden m-2 rounded-[24px]">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className={`object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105 ${!isPurchased ? 'opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100' : ''}`}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#2c2c2e]">
                            <PlayCircle className="w-12 h-12 text-[#86868b]" />
                        </div>
                    )}

                    {/* Gradient Overlay for better contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                        {isPurchased ? (
                            <div className="bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Débloqué
                            </div>
                        ) : (
                            <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md border border-white/10">
                                <Lock className="w-3.5 h-3.5 text-[#86868b]" />
                                Premium
                            </div>
                        )}
                    </div>

                    {/* Price Tag (if locked) */}
                    {!isPurchased && (
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-black font-semibold px-4 py-2 rounded-full shadow-lg z-10">
                            {priceString}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-20">
                    <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-3 tracking-tight group-hover:text-white transition-colors">
                        {product.title}
                    </h3>
                    <p className="text-base text-[#86868b] mb-8 flex-1 line-clamp-3 font-light leading-relaxed">
                        {product.description || "Découvrez ce programme exclusif pour améliorer votre technique magique."}
                    </p>

                    {/* Action Button */}
                    {isPurchased ? (
                        <Link href={`/dashboard/program`} className="w-full bg-[#2c2c2e] hover:bg-white text-[#f5f5f7] hover:text-black font-medium text-base py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
                            <Play className="w-5 h-5" />
                            Accéder au contenu
                        </Link>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            disabled={loading || !product.stripe_price_id}
                            className="w-full bg-[#f5f5f7] hover:bg-white text-black font-medium text-base py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
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
