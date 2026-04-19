"use client";

import { useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";

export default function CheckoutButton({ 
    itemId, 
    space, 
    className, 
    children 
}: { 
    itemId: string, 
    space: 'kids' | 'adults', 
    className?: string, 
    children?: React.ReactNode 
}) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/checkout-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, space })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Erreur de paiement");
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleCheckout} 
            disabled={loading}
            className={className || "w-full bg-gradient-to-r from-brand-gold to-yellow-500 text-black font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_10px_30px_rgba(250,204,21,0.3)] disabled:opacity-75"}
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (children || <><ShoppingBag className="w-5 h-5" /> Obtenir ce secret</>)}
        </button>
    );
}
