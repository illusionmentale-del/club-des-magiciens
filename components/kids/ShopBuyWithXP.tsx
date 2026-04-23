"use client";

import { useState } from "react";
import { Sparkles, Loader2, Lock } from "lucide-react";
import { purchaseWithXP } from "@/app/actions/xp";
import { useRouter } from "next/navigation";

import GamificationModal, { GamificationEvent } from "./GamificationModal";

export default function ShopBuyWithXP({ itemId, xpPrice, trueXP, adultMode = false, title = "cet objet", itemType = "secret", description = "" }: { itemId: string, xpPrice: number, trueXP: number, adultMode?: boolean, title?: string, itemType?: string, description?: string }) {
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState<GamificationEvent | null>(null);
    const router = useRouter();

    const canAfford = trueXP >= xpPrice;

    const handlePurchase = async () => {
        if (!canAfford) return;
        
        const xpName = adultMode ? "XP" : "Poussières d'étoiles 🌟";
        const confirm = window.confirm(`Veux-tu dépenser ${xpPrice} ${xpName} pour débloquer ${title} ?`);
        if (!confirm) return;

        setLoading(true);
        const result: any = await purchaseWithXP(itemId);
        setLoading(false);
        
        if (result.success && result.newQuestsData && result.newQuestsData.length > 0) {
            setEvent({ newQuestsData: result.newQuestsData });
        } else if (result.success) {
            router.refresh();
        } else if (result.error) {
            alert(result.error);
        }
    };

    const gradientBtn = adultMode 
        ? "bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 shadow-[0_0_15px_rgba(0,102,255,0.4)] hover:shadow-[0_0_25px_rgba(0,102,255,0.6)] border-blue-500/30 text-white" 
        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] border-purple-400/30 text-white";

    const labelMissing = adultMode ? `XP insuffisant : manque ${xpPrice - trueXP} XP` : `Il te manque ${xpPrice - trueXP} Poussières`;
    const labelUnlock = adultMode ? `Acheter (${xpPrice} XP)` : `Débloquer (${xpPrice} Poussières)`;

    return (
        <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col h-full border-t border-white/10 shadow-lg">
            {title !== "cet objet" && (
                <div className="mb-4 text-center">
                    <h4 className="font-bold text-white text-lg">{title}</h4>
                    {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
                </div>
            )}
            
            <GamificationModal event={event} onClose={() => { setEvent(null); router.refresh(); }} />
            
            <div className="mt-auto">
                {!canAfford ? (
                    <button disabled className="w-full mt-2 bg-black/40 border border-white/10 text-brand-text-muted font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-xs">
                        <Lock className="w-4 h-4" />
                        {labelMissing}
                    </button>
                ) : (
                    <button 
                        onClick={handlePurchase}
                        disabled={loading}
                        className={`w-full mt-2 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 text-sm border ${gradientBtn}`}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
                        {labelUnlock}
                    </button>
                )}
            </div>
        </div>
    );
}
