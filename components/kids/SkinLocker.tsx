"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Lock, Loader2, UserRound, Sparkles } from "lucide-react";
import { equipSkin, buySkinWithXP } from "@/app/actions/avatars";

type Skin = {
    id: string;
    name: string;
    image_url: string;
    price_xp: number;
    is_default: boolean;
};

type Props = {
    skins: Skin[];
    unlockedSkinIds: string[];
    equippedSkinId: string | null;
    trueXP: number;
};

export default function SkinLocker({ skins, unlockedSkinIds, equippedSkinId, trueXP }: Props) {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const handleEquip = async (skinId: string) => {
        setLoadingMap(prev => ({ ...prev, [skinId]: true }));
        try {
            const res = await equipSkin(skinId);
            if (!res.success) alert(res.error);
        } finally {
            setLoadingMap(prev => ({ ...prev, [skinId]: false }));
        }
    };

    const handleBuy = async (skinId: string, price: number) => {
        if (!confirm(`Acheter cet avatar pour ${price} Éclats ?`)) return;
        
        setLoadingMap(prev => ({ ...prev, [skinId]: true }));
        try {
            const res = await buySkinWithXP(skinId, price);
            if (!res.success) alert(res.error || "Erreur lors de l'achat.");
        } finally {
            setLoadingMap(prev => ({ ...prev, [skinId]: false }));
        }
    };

    if (!skins || skins.length === 0) return null;

    return (
        <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <UserRound className="text-pink-400" />
                Mon Casier d'Avatars
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {skins.map(skin => {
                    const isUnlocked = skin.is_default || unlockedSkinIds.includes(skin.id);
                    const isEquipped = equippedSkinId === skin.id || (!equippedSkinId && skin.is_default);
                    const canAfford = trueXP >= skin.price_xp;
                    const isLoading = loadingMap[skin.id];

                    return (
                        <div key={skin.id} className={`bg-brand-card/80 border p-4 rounded-3xl flex flex-col items-center text-center transition-all ${isEquipped ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'border-white/5 hover:border-white/20'}`}>
                            
                            <div className="w-20 h-20 bg-black/50 rounded-full border-2 border-white/10 relative overflow-hidden mb-3">
                                {skin.image_url ? (
                                    <Image src={skin.image_url} alt={skin.name} fill className={`object-cover ${!isUnlocked && 'opacity-40 grayscale'}`} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><UserRound className="text-gray-600 w-8 h-8"/></div>
                                )}
                                
                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <Lock className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-sm font-bold text-white leading-tight mb-3 line-clamp-1 h-5">{skin.name}</h3>

                            <div className="mt-auto w-full">
                                {isEquipped ? (
                                    <button disabled className="w-full bg-pink-500/20 text-pink-400 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 border border-pink-500/30">
                                        <Check className="w-3.5 h-3.5" /> Équipé
                                    </button>
                                ) : isUnlocked ? (
                                    <button 
                                        onClick={() => handleEquip(skin.id)}
                                        disabled={isLoading}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl text-xs transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Équiper"}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleBuy(skin.id, skin.price_xp)}
                                        disabled={isLoading || !canAfford}
                                        className={`w-full font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 flex-wrap ${canAfford ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:scale-105 transition-transform' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3" />
                                                {skin.price_xp} Éclats
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
