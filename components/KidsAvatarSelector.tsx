"use client";

import { useState } from "react";
import { Sparkles, Check } from "lucide-react";

const KID_AVATARS = [
    { id: "hat", icon: "🎩", name: "Chapeau Magique", color: "from-purple-500 to-indigo-600" },
    { id: "wand", icon: "🪄", name: "Baguette de Fée", color: "from-pink-500 to-rose-500" },
    { id: "crystal", icon: "🔮", name: "Boule de Cristal", color: "from-blue-500 to-cyan-500" },
    { id: "owl", icon: "🦉", name: "Chouette Savante", color: "from-amber-600 to-orange-600" },
    { id: "dragon", icon: "🐉", name: "Jeune Dragon", color: "from-emerald-500 to-teal-600" },
    { id: "unicorn", icon: "🦄", name: "Licorne Polaire", color: "from-fuchsia-500 to-purple-600" },
    { id: "castle", icon: "🏰", name: "Château Secret", color: "from-slate-600 to-slate-800" },
    { id: "star", icon: "⭐", name: "Étoile Filante", color: "from-yellow-400 to-amber-500" },
];

interface KidsAvatarSelectorProps {
    currentAvatarUrl?: string;
    onSelect: (url: string) => void;
}

export default function KidsAvatarSelector({ currentAvatarUrl, onSelect }: KidsAvatarSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    // We store the icon emoji or full SVG string as the URL for simplicity,
    // or we can just send the ID. Let's send the ID, and MagicCard can render it.
    // Actually, storing the emoji directly as `avatar_url_kids` is super easy and works everywhere!

    const currentSelected = KID_AVATARS.find(a => a.icon === currentAvatarUrl) || null;

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className={`relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr ${currentSelected ? currentSelected.color : "from-brand-purple to-blue-500"} shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => setIsOpen(true)}
            >
                <div className="w-full h-full rounded-full bg-[#050507] flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl z-10">{currentSelected ? currentSelected.icon : "🎩"}</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="absolute -bottom-2 md:-right-2 right-1/2 md:translate-x-0 translate-x-1/2 bg-white text-black p-2 rounded-full shadow-lg z-20 hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4" />
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                    <div
                        className="bg-[#111114] border border-white/10 p-6 rounded-3xl max-w-lg w-full shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-black text-white mb-6 text-center">Choisis ton Emblème</h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {KID_AVATARS.map((avatar) => {
                                const isSelected = currentAvatarUrl === avatar.icon;

                                return (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        onClick={() => {
                                            onSelect(avatar.icon);
                                            setIsOpen(false);
                                        }}
                                        className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${isSelected
                                                ? "bg-white/10 border-brand-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                                : "bg-black/40 border-white/5 hover:bg-white/5"
                                            } border`}
                                    >
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl bg-gradient-to-tr ${avatar.color} shadow-inner`}>
                                            <div className="w-full h-full rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                                {avatar.icon}
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-white/70 text-center">{avatar.name}</span>

                                        {isSelected && (
                                            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 text-white shadow-lg">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-bold"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
