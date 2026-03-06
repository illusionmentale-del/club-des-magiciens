"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star, Award } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MagicCardProps {
    user: any;
    profile: any;
    isKid?: boolean;
}

export default function MagicCard({ user, profile, isKid = false }: MagicCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, percentageX: 50, percentageY: 50 });

    const xp = profile?.xp || 0;

    // Rarity Tiers Logic
    const isHolo = xp >= 50 && xp < 150;
    const isLegendary = xp >= 150;

    // Fallbacks
    const defaultKidAvatar = "🎩";
    const currentAvatar = isKid ? (profile?.avatar_url_kids || defaultKidAvatar) : (profile?.avatar_url || "/default-avatar.png");
    const isEmojiAvatar = isKid && !currentAvatar.startsWith('http') && !currentAvatar.startsWith('/');

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const percentageX = (x / rect.width) * 100;
        const percentageY = (y / rect.height) * 100;
        setMousePosition({ x, y, percentageX, percentageY });
    };

    const handleMouseLeave = () => {
        // Reset to center smoothly when mouse leaves
        setMousePosition({ x: 150, y: 200, percentageX: 50, percentageY: 50 });
    };

    // Styling logic based on Rarity
    let cardBorder = isKid ? "border-purple-500/30" : "border-brand-royal/30";
    let cardBg = isKid ? "#050507" : "#171717";

    if (isLegendary) {
        cardBorder = "border-[#FFD700]/60 ring-1 ring-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.3)]";
    }

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto font-sans relative">

            {/* 3D Container - Aspect Ratio 63:88 (Standard Trading Card) */}
            <div
                className="w-full aspect-[63/88] perspective-[1500px] relative group/card cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Glow Behind Card */}
                <div className={cn(
                    "absolute -inset-4 rounded-[2rem] opacity-0 blur-2xl transition duration-1000 pointer-events-none group-hover/card:opacity-50",
                    isLegendary ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" :
                        isKid ? "bg-gradient-to-r from-brand-purple to-blue-500" : "bg-gradient-to-r from-brand-royal to-blue-600"
                )}></div>

                <motion.div
                    className="relative w-full h-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] preserve-3d shadow-2xl rounded-2xl"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* FRONT OF CARD */}
                    <div
                        className={cn("absolute inset-0 w-full h-full backface-hidden border rounded-2xl p-6 overflow-hidden transition-all duration-300", cardBorder)}
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            backgroundColor: cardBg,
                            zIndex: isFlipped ? 0 : 20,
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* 1. Base Gradient Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className={cn("absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none", isKid ? "bg-brand-purple/20" : "bg-brand-royal/20")} />

                        {/* 2. Rarity Effects (Holo & Legendary) */}
                        {isHolo && (
                            <div
                                className="absolute inset-0 mix-blend-color-dodge opacity-40 pointer-events-none transition-all duration-100"
                                style={{
                                    background: `linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.7) 40%, rgba(255,0,255,0.4) 45%, rgba(0,255,255,0.4) 50%, rgba(255,255,255,0.7) 55%, transparent 70%)`,
                                    backgroundPosition: `${mousePosition.percentageX * 2}% ${mousePosition.percentageY * 2}%`,
                                    backgroundSize: '250% 250%'
                                }}
                            />
                        )}

                        {isLegendary && (
                            <div
                                className="absolute inset-0 mix-blend-color-dodge opacity-60 pointer-events-none transition-all duration-100"
                                style={{
                                    background: `linear-gradient(115deg, transparent 20%, rgba(255,215,0,0.8) 40%, rgba(255,100,0,0.6) 45%, rgba(255,255,0,0.6) 50%, rgba(255,215,0,0.8) 55%, transparent 70%)`,
                                    backgroundPosition: `${mousePosition.percentageX * 2}% ${mousePosition.percentageY * 2}%`,
                                    backgroundSize: '300% 300%'
                                }}
                            />
                        )}

                        {/* 3. Mouse Tracking Spotlight (Lighting) */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover/card:opacity-50 transition-opacity duration-300 pointer-events-none z-20 mix-blend-overlay"
                            style={{
                                background: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.4), transparent 100%)`
                            }}
                        />

                        {/* --- CARD CONTENT --- */}
                        <div className="relative z-10 w-full h-full flex flex-col justify-between">

                            {/* Card Header */}
                            <div className="flex justify-between items-start">
                                <div className={cn("px-3 py-1 rounded-t-lg rounded-br-lg text-xs font-bold tracking-widest uppercase border", isLegendary ? "bg-amber-500/20 text-[#FFD700] border-[#FFD700]/30" : isKid ? "bg-brand-purple/20 text-purple-300 border-purple-500/30" : "bg-brand-royal/20 text-blue-300 border-brand-royal/30")}>
                                    {isKid ? "Apprenti" : "Membre"}
                                </div>
                                <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                                    <Sparkles className={cn("w-3 h-3", isLegendary ? "text-[#FFD700]" : "text-white/70")} />
                                    <span className={cn("text-xs font-bold", isLegendary ? "text-[#FFD700]" : "text-white/90")}>{xp} XP</span>
                                </div>
                            </div>

                            {/* Center Avatar Illustration */}
                            <div className="flex-1 flex flex-col items-center justify-center my-6">
                                <div className={cn(
                                    "relative w-40 h-40 rounded-full p-1.5 shadow-2xl flex-shrink-0",
                                    isLegendary ? "bg-gradient-to-tr from-amber-500 via-yellow-200 to-orange-500" :
                                        isKid ? "bg-gradient-to-tr from-blue-500 to-brand-purple" : "bg-gradient-to-tr from-brand-royal to-blue-400"
                                )}>
                                    <div className="w-full h-full rounded-full bg-[#0A0A0E] overflow-hidden relative flex items-center justify-center">
                                        {isEmojiAvatar ? (
                                            <span className="text-7xl drop-shadow-2xl z-10">{currentAvatar}</span>
                                        ) : (
                                            <Image src={currentAvatar} alt="Avatar" fill className="object-cover z-10" />
                                        )}
                                        {/* Avatar Background effect */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] z-0"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-xl p-4 w-full">
                                <h2 className={cn("font-serif text-2xl font-bold text-center mb-1 drop-shadow-lg", isLegendary ? "text-[#FFD700]" : "text-white")}>
                                    {profile?.username || "Le Mystérieux"}
                                </h2>
                                <p className="text-white/50 text-[10px] tracking-widest uppercase text-center mb-4">
                                    {profile?.magic_level || "Apprenti Magicien"}
                                </p>

                                <div className="grid grid-cols-2 gap-2 text-center border-t border-white/10 pt-3">
                                    <div>
                                        <p className="text-white/40 text-[9px] uppercase tracking-wider">QG</p>
                                        <p className="text-white/90 text-xs font-medium truncate">{profile?.city || "Inconnu"}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[9px] uppercase tracking-wider">Inscrit</p>
                                        <p className="text-white/90 text-xs font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* BACK OF CARD */}
                    <div
                        className={cn("absolute inset-0 w-full h-full backface-hidden border rounded-2xl flex flex-col items-center justify-center overflow-hidden", isLegendary ? "border-[#FFD700]/40" : cardBorder)}
                        style={{
                            transform: "rotateY(180deg)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            backgroundColor: cardBg,
                            zIndex: isFlipped ? 20 : 0,
                        }}
                    >
                        {/* Background Texture Pattern */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                        <div className={cn("w-32 h-32 rounded-full blur-3xl absolute absolute-center", isLegendary ? "bg-amber-600/30" : isKid ? "bg-brand-purple/20" : "bg-brand-royal/20")} />

                        <div className="relative z-10 flex flex-col items-center p-6 text-center">
                            <Star className={cn("w-12 h-12 mb-4 drop-shadow-lg", isLegendary ? "text-[#FFD700]" : isKid ? "text-brand-purple" : "text-brand-royal")} />
                            <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">
                                {isKid ? "Le Club des Petits Magiciens" : "L'Atelier des Magiciens"}
                            </h3>
                            <div className="w-12 h-1 border-t border-white/20 mb-4"></div>
                            <p className="text-xs text-white/50 leading-relaxed max-w-[200px] mb-8">
                                "La possession de cette carte officielle confère des privilèges magiques interdits aux moldus."
                            </p>

                            <div className="text-[10px] text-white/30 font-mono">
                                ID: {user.id.slice(0, 12)}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <p className="text-sm text-brand-text-muted animate-pulse">
                Clique sur la carte pour la retourner
            </p>
        </div>
    );
}
