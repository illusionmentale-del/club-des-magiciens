"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";

export default function SubscribeButton({
    priceId,
    productId,
    space,
    userLoggedIn = true,
    buttonText = "Je m'abonne",
    className
}: {
    priceId?: string,
    productId?: string,
    space: 'kids' | 'adults',
    userLoggedIn?: boolean,
    buttonText?: string,
    className?: string
}) {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!priceId || !productId) {
            console.error("Missing Price ID or Product ID");
            alert("Il manque un identifiant de prix ou de produit. Veuillez contacter le support.");
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
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Une erreur est survenue lors de la redirection vers Stripe.");
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Stripe n'a pas retourné d'URL de paiement.");
            }
        } catch (error: any) {
            console.error("Error Checkout:", error);
            alert("Erreur de paiement : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSubscribe}
            disabled={loading || (!priceId && userLoggedIn)}
            className={className || `w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${space === 'kids'
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
                : 'bg-magic-grad text-black hover:brightness-110 shadow-lg shadow-magic-gold/20'
                }`}
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                    {buttonText}
                    <ArrowRight className="w-5 h-5" />
                </>
            )}
        </button>
    );
}
