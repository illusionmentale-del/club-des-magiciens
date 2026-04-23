"use client";

import { useState } from "react";
import Image from "next/image";
import { UserRound, Check, Edit2, X, Loader2 } from "lucide-react";
import { equipSkin } from "@/app/actions/avatars";

type Skin = {
    id: string;
    name: string;
    image_url: string;
    is_default: boolean;
};

interface Props {
    skins: Skin[];
    equippedSkinId: string | null;
}

export default function QuickSkinSelector({ skins, equippedSkinId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const handleEquip = async (skinId: string) => {
        setLoadingMap(prev => ({ ...prev, [skinId]: true }));
        try {
            const res = await equipSkin(skinId);
            if (!res.success) {
                alert(res.error || "Une erreur est survenue");
            } else {
                setIsOpen(false);
                window.location.reload();
            }
        } finally {
            setLoadingMap(prev => ({ ...prev, [skinId]: false }));
        }
    };

    return (
        <div className="flex flex-col items-center mt-6 w-full relative z-20">
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-brand-purple/20 hover:bg-brand-purple/40 border border-brand-purple/50 rounded-full text-brand-purple hover:text-white font-bold text-sm tracking-widest transition-all shadow-[0_4px_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105"
            >
                <Edit2 className="w-4 h-4" />
                Modifier mon icône
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                    <div className="bg-brand-card border border-brand-border rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto flex flex-col items-center relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-brand-text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        
                        <h3 className="text-2xl font-black text-white mb-6 text-center flex gap-2 items-center">
                            <UserRound className="text-brand-purple" />
                            Mes Avatars Débloqués
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                            {skins.map(skin => {
                                const isEquipped = equippedSkinId === skin.id || (!equippedSkinId && skin.id === skins.find(s => s.is_default)?.id);
                                const isLoading = loadingMap[skin.id];

                                return (
                                    <div key={skin.id} className={`bg-black/40 border p-3 rounded-2xl flex flex-col items-center text-center transition-all ${isEquipped ? 'border-brand-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-white/10 hover:border-white/30'}`}>
                                        <div className={`w-16 h-16 bg-black/50 rounded-full border-2 border-white/10 relative overflow-hidden mb-2`}>
                                            {skin.image_url ? (
                                                <Image src={skin.image_url} alt={skin.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><UserRound className="text-gray-600 w-6 h-6"/></div>
                                            )}
                                        </div>
                                        <h4 className="text-xs font-bold text-white mb-3 line-clamp-1 h-4">{skin.name}</h4>
                                        <div className="mt-auto w-full">
                                            {isEquipped ? (
                                                <button disabled className="w-full font-bold py-1.5 rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                                                    <Check className="w-3 h-3" /> Équipé
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleEquip(skin.id)}
                                                    disabled={isLoading}
                                                    className="w-full font-bold py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50 bg-white/10 hover:bg-white/20 text-white"
                                                >
                                                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Sélectionner"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {skins.length === 0 && (
                            <p className="text-gray-400 text-sm mt-4">Aucun avatar personnalisé débloqué pour l'instant.</p>
                        )}
                        
                        <div className="mt-6 w-full text-center">
                             <a href="/kids/shop" className="text-brand-purple text-sm hover:underline font-bold">
                                 Débloquer de nouveaux avatars dans la boutique &rarr;
                             </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
