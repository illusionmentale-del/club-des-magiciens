"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

export default function SubscribeButton({ priceId, productId, space }: { priceId?: string, productId?: string, space: 'kids' | 'adults' }) {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!priceId || !productId) {
            console.error("Missing Price ID or Product ID");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    productId,
                    isSubscription: true,
                    space
                })
            });
            const { url } = await response.json();
            if (url) window.location.href = url;
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSubscribe}
            disabled={loading || !priceId}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${space === 'kids'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
                    : 'bg-magic-grad text-black hover:brightness-110 shadow-lg shadow-magic-gold/20'
                }`}
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                    Je m'abonne
                    <ArrowRight className="w-5 h-5" />
                </>
            )}
        </button>
    );
}
