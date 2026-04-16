"use client";

import { useState } from "react";
import { Sparkles, Loader2, Lock } from "lucide-react";
import { purchaseWithXP } from "@/app/actions/xp";
import { useRouter } from "next/navigation";

import GamificationModal, { GamificationEvent } from "./GamificationModal";

export default function ShopBuyWithXP({ itemId, xpPrice, trueXP }: { itemId: string, xpPrice: number, trueXP: number }) {
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState<GamificationEvent | null>(null);
    const router = useRouter();

    const canAfford = trueXP >= xpPrice;

    const handlePurchase = async () => {
        if (!canAfford) return;
        
        const confirm = window.confirm(`Veux-tu dépenser ${xpPrice} Poussières d'étoiles 🌟 pour débloquer ce secret ?`);
        if (!confirm) return;

        setLoading(true);
        const result = await purchaseWithXP(itemId);
        setLoading(false);
        
        if (result.success && result.newQuestsData && result.newQuestsData.length > 0) {
            setEvent({ newQuestsData: result.newQuestsData });
        } else if (result.success) {
            router.refresh(); // Refresh page to show the "Watch Video" button
        } else if (result.error) {
            alert(result.error);
        }
    };

    if (!canAfford) {
        return (
            <button disabled className="w-full mt-2 bg-black/40 border border-white/10 text-brand-text-muted font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-xs">
                <Lock className="w-4 h-4" />
                Il te manque {xpPrice - trueXP} Poussières d'étoiles
            </button>
        );
    }

    return (
        <>
            <GamificationModal event={event} onClose={() => { setEvent(null); router.refresh(); }} />
            <button 
                onClick={handlePurchase}
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-[1.02] disabled:opacity-50 text-sm border border-purple-400/30"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
                Débloquer ({xpPrice} Poussières)
            </button>
        </>
    );
}
