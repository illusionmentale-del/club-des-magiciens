"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayCircle, CheckCircle, ShoppingCart, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ProductCardProps {
    product: {
        id: string;
        title: string;
        description: string;
        price: number;
        image_url?: string;
        stripe_price_id?: string;
        type: string;
    };
    isPurchased: boolean;
    space: 'kids' | 'adults';
}

export default function ProductCard({ product, isPurchased, space }: ProductCardProps) {
    const [loading, setLoading] = useState(false);

    const handlePurchase = async () => {
        if (isPurchased) {
            // Redirect to content (logic potentially needs to find the course linked to this product)
            window.location.href = `/dashboard/library`;
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: product.stripe_price_id,
                    productId: product.id,
                    isSubscription: product.type === 'subscription',
                    space: space
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

    return (
        <div className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden hover:border-brand-purple/50 transition-all hover:shadow-lg hover:shadow-brand-purple/10 flex flex-col h-full">
            <div className="aspect-video relative bg-brand-bg/50">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-brand-text-muted/20">
                        <PlayCircle className="w-12 h-12" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 to-transparent opacity-60"></div>

                {/* Status Tag */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 backdrop-blur-md rounded-full text-xs font-bold border ${isPurchased ? 'bg-brand-success/20 text-brand-success border-brand-success/30' : 'bg-brand-card/90 text-brand-text border-brand-border'}`}>
                        {isPurchased ? "Possédé" : `${(product.price / 100).toFixed(2)}€`}
                    </span>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-brand-text mb-2 group-hover:text-brand-gold transition-colors line-clamp-1">
                    {product.title}
                </h3>
                <p className="text-sm text-brand-text-muted line-clamp-2 mb-4 flex-1">
                    {product.description || "Aucune description disponible."}
                </p>

                <button
                    onClick={handlePurchase}
                    disabled={loading || !product.stripe_price_id}
                    className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${isPurchased
                        ? "bg-brand-surface text-brand-text cursor-default"
                        : "bg-brand-purple hover:bg-brand-purple/90 text-white shadow-lg hover:shadow-brand-purple/20"
                        }`}
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isPurchased ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Accéder
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4" />
                            Acheter maintenant
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
