"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Lock, Loader2, UserRound, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [previewSkin, setPreviewSkin] = useState<Skin | null>(null);

    const handleEquip = async (skinId: string) => {
        setLoadingMap(prev => ({ ...prev, [skinId]: true }));
        try {
            const res = await equipSkin(skinId);
            if (!res.success) {
                alert(res.error);
            } else {
                router.refresh();
            }
        } finally {
            setLoadingMap(prev => ({ ...prev, [skinId]: false }));
        }
    };

    const confirmPurchase = async () => {
        if (!previewSkin) return;
        const skinId = previewSkin.id;
        const price = previewSkin.price_xp;
        
        setLoadingMap(prev => ({ ...prev, [skinId]: true }));
        try {
            const res = await buySkinWithXP(skinId, price);
            if (!res.success) {
                alert(res.error || "Erreur lors de l'achat.");
            } else {
                setPreviewSkin(null);
                router.refresh();
            }
        } finally {
            setLoadingMap(prev => ({ ...prev, [skinId]: false }));
        }
    };

    const handleBuyClick = (skin: Skin) => {
        setPreviewSkin(skin);
    };

    if (!skins || skins.length === 0) return null;

    return (
        <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <UserRound className="text-pink-400" />
                Mon Casier d'Avatars
            </h2>

            {/* Preview Modal */}
            {previewSkin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-brand-card border border-brand-border rounded-3xl p-6 md:p-8 w-full max-w-sm flex flex-col items-center relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setPreviewSkin(null)} className="absolute top-4 right-4 text-brand-text-muted hover:text-white bg-white/5 rounded-full p-2">
                            <X className="w-5 h-5" />
                        </button>
                        
                        <h3 className="text-xl font-bold text-white mb-6 text-center">{previewSkin.name}</h3>
                        
                        <div className="w-48 h-48 rounded-full border-4 border-brand-purple/50 bg-black/50 shadow-[0_0_40px_rgba(168,85,247,0.4)] relative flex items-center justify-center overflow-hidden mb-8">
                                {previewSkin.image_url ? (
                                    <Image src={previewSkin.image_url} alt={previewSkin.name} fill className="object-cover" />
                                ) : (
                                    <UserRound className="w-20 h-20 text-gray-500" />
                                )}
                        </div>

                        <div className="w-full space-y-3">
                            <button 
                                onClick={confirmPurchase}
                                disabled={loadingMap[previewSkin.id] || trueXP < previewSkin.price_xp}
                                className={`w-full font-black uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform shadow-[0_10px_30px_rgba(250,204,21,0.3)] disabled:opacity-50 ${
                                    trueXP >= previewSkin.price_xp 
                                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:scale-[1.02]' 
                                        : 'bg-gray-800 text-gray-500 border border-gray-700 shadow-none'
                                }`}
                            >
                                {loadingMap[previewSkin.id] ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        {trueXP >= previewSkin.price_xp 
                                            ? `Confirmer (${previewSkin.price_xp} Poussières)` 
                                            : `Poussières insuffisantes (${previewSkin.price_xp})`
                                        }
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setPreviewSkin(null)}
                                className="w-full py-3 text-sm font-bold text-brand-text-muted hover:text-white transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {skins.map(skin => {
                    const isUnlocked = skin.is_default || unlockedSkinIds.includes(skin.id);
                    const isEquipped = equippedSkinId === skin.id || (!equippedSkinId && skin.is_default);
                    const canAfford = trueXP >= skin.price_xp;
                    const isLoading = loadingMap[skin.id];

                    return (
                        <div key={skin.id} className={`bg-brand-card/80 border p-4 rounded-3xl flex flex-col items-center text-center transition-all ${isEquipped ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'border-white/5 hover:border-white/20'}`}>
                            
                            <div 
                                className="w-20 h-20 bg-black/50 rounded-full border-2 border-white/10 relative overflow-hidden mb-3 cursor-pointer group hover:border-brand-purple/50 transition-all duration-300 hover:scale-[1.4] hover:z-20 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                                onClick={() => !isUnlocked && handleBuyClick(skin)}
                            >
                                {skin.image_url ? (
                                    <Image src={skin.image_url} alt={skin.name} fill className={`object-cover transition-all duration-300 ${!isUnlocked && 'opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><UserRound className="text-gray-600 w-8 h-8"/></div>
                                )}
                                
                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:opacity-0 transition-opacity duration-300">
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
                                        onClick={() => handleBuyClick(skin)}
                                        disabled={isLoading}
                                        className={`w-full font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 flex-wrap transition-transform ${
                                            canAfford 
                                                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:scale-105' 
                                                : 'bg-brand-surface text-brand-text border border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3" />
                                                {skin.price_xp} Poussières d'étoiles
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
