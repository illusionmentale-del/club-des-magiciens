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
    lifetimeXP?: number;
    avatarUrl?: string; // Optional prop to pass explicit avatar (prevents async mismatch)
}

export default function MagicCard({ user, profile, isKid = false, lifetimeXP, avatarUrl }: MagicCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, percentageX: 50, percentageY: 50 });

    const xp = lifetimeXP ?? profile?.xp ?? 0;

    // Rarity Tiers Logic
    const isHolo = xp >= 50 && xp < 150;
    const isLegendary = xp >= 150;

    let computedLevel = "Membre";
    if (isKid) {
        if (isLegendary) computedLevel = "Légendaire";
        else if (isHolo) computedLevel = "Holo-Magicien";
        else computedLevel = "Apprenti";
    } else {
        computedLevel = profile?.magic_level || "Membre";
    }

    const validFactions = ["Magicien", "Sorcier", "Elfe", "Fée", "Licorne", "Illusionniste", "Mentaliste", "Druide"];
    const displayCityOrFaction = isKid
        ? (validFactions.includes(profile?.city) ? profile.city : "Non choisie")
        : (profile?.city || "Inconnu");

    // Fallbacks
    const defaultKidAvatar = "/avatars/avatar_base_student.png";
    const currentAvatar = isKid 
        ? (avatarUrl && avatarUrl.trim() !== "" ? avatarUrl : defaultKidAvatar)
        : (profile?.avatar_url || "/default-avatar.png");
        
    const isEmojiAvatar = !isKid && !currentAvatar.startsWith('http') && !currentAvatar.startsWith('/');

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
    let cardBorder = isKid ? "border-purple-500/50 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]" : "border-brand-royal/50 shadow-[inset_0_0_20px_rgba(29,78,216,0.2)]";
    // Using a rich gradient instead of flat #050507 or #171717
    let cardBg = isKid ? "bg-gradient-to-b from-[#1a1025] to-[#0A0510]" : "bg-gradient-to-b from-[#101525] to-[#050A10]";


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
                        className={cn("absolute inset-0 w-full h-full backface-hidden border-2 rounded-2xl p-4 overflow-hidden transition-all duration-300", cardBorder, cardBg)}
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
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
                            <div className="flex flex-col items-center justify-center my-1 md:my-2 relative">
                                {/* Backdrop glow for avatar */}
                                <div className={cn("absolute w-48 h-48 rounded-full blur-2xl opacity-40 mix-blend-screen", isKid ? "bg-purple-500" : "bg-brand-royal")}></div>


                                <div className={cn(
                                    "relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 shadow-2xl flex-shrink-0 z-10 transition-transform duration-500",
                                    isLegendary ? "bg-gradient-to-tr from-amber-500 via-yellow-200 to-orange-500" :
                                        isKid ? "bg-gradient-to-tr from-blue-500 via-purple-400 to-brand-purple" : "bg-gradient-to-br from-cyan-400 via-brand-royal to-blue-600"
                                )}>
                                    <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1a1c29] to-[#0A0A0E] overflow-hidden relative flex flex-col items-center justify-center shadow-inner ring-4 ring-black/50">
                                        {isEmojiAvatar ? (
                                            <span className="text-[5rem] drop-shadow-2xl z-20 relative transform hover:scale-110 transition-transform duration-500">{currentAvatar}</span>
                                        ) : (
                                            <Image src={currentAvatar} alt="Avatar" fill className="object-cover z-20" />
                                        )}
                                        {/* Avatar Background effect */}
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10"></div>
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2)_0%,transparent_60%)] z-10"></div>
                                    </div>

                                    {/* Level Badge Overlapping Avatar */}
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30">
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-2",
                                            isLegendary ? "bg-amber-600 text-amber-100 border-yellow-300" : isKid ? "bg-brand-purple text-purple-100 border-purple-300" : "bg-brand-royal text-blue-100 border-blue-300"
                                        )}>
                                            {computedLevel}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-3 md:p-4 w-full relative overflow-hidden mt-1 flex flex-col justify-center">
                                {/* Subtle internal reflection */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                                <h2 className={cn("font-serif text-xl md:text-2xl font-black text-center mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] truncate", isLegendary ? "text-[#FFD700]" : "text-white")}>
                                    {profile?.username || "Le Mystérieux"}
                                </h2>

                                {/* Inner Card XP Progress Bar */}
                                <div className="mb-3 px-2">
                                    <div className="flex justify-between text-[8px] md:text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">
                                        <span>Progression</span>
                                        <span className={isLegendary ? "text-amber-400" : "text-white"}>{xp} XP</span>
                                    </div>
                                    <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className={cn("h-full relative", isLegendary ? "bg-gradient-to-r from-amber-600 to-yellow-400" : isKid ? "bg-gradient-to-r from-purple-600 to-blue-400" : "bg-gradient-to-r from-blue-600 to-cyan-400")}
                                            style={{ width: `${Math.min((xp / (isLegendary ? 500 : 150)) * 100, 100)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/30 w-full animate-[pulse_2s_infinite]"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-center border-t border-white/5 pt-2">
                                    <div className="flex flex-col items-center bg-white/5 rounded-lg py-1 border border-white/5">
                                        <p className="text-white/40 text-[8px] uppercase tracking-widest font-bold mb-0.5">{isKid ? "Faction" : "QG"}</p>
                                        <p className="text-white/90 text-[11px] md:text-sm font-bold truncate px-1 w-full">{displayCityOrFaction}</p>
                                    </div>
                                    <div className="flex flex-col items-center bg-white/5 rounded-lg py-1 border border-white/5">
                                        <p className="text-white/40 text-[8px] uppercase tracking-widest font-bold mb-0.5">Inscrit</p>
                                        <p className="text-white/90 text-[11px] md:text-sm font-bold px-1">{new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* BACK OF CARD */}
                    <div
                        className={cn("absolute inset-0 w-full h-full backface-hidden border-2 rounded-2xl flex flex-col items-center justify-center overflow-hidden p-3", cardBorder, cardBg)}
                        style={{
                            transform: "rotateY(180deg)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            zIndex: isFlipped ? 20 : 0,
                        }}
                    >
                        {/* Inner Borders (Card Sleeve Effect) */}
                        <div className="absolute inset-2 border border-white/10 rounded-xl pointer-events-none" />
                        <div className="absolute inset-3 border border-white/5 rounded-lg pointer-events-none" />

                        {/* Background Texture Pattern */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none z-0 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                        <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                        <div className={cn("w-full h-full absolute top-0 left-0 bg-gradient-to-b from-transparent to-black/60 z-0 pointer-events-none")} />

                        {/* Central Glow */}
                        <div className={cn("w-48 h-48 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none", isLegendary ? "bg-amber-600" : isKid ? "bg-purple-600" : "bg-blue-600")} />

                        <div className="relative z-10 flex flex-col items-center p-3 text-center h-full justify-center w-full">
                            <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">

                                {/* Geometric Emblem */}
                                <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                                    <div className={cn("absolute inset-0 rotate-45 border shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]", isLegendary ? "border-amber-500/30" : isKid ? "border-purple-500/30" : "border-blue-500/30")} />
                                    <div className={cn("absolute inset-2 rotate-12 border", isLegendary ? "border-amber-500/20" : isKid ? "border-purple-500/20" : "border-blue-500/20")} />
                                    <Star className={cn("w-10 h-10 drop-shadow-2xl relative z-10", isLegendary ? "text-[#FFD700] fill-amber-500/20" : isKid ? "text-purple-400 fill-purple-500/20" : "text-blue-400 fill-blue-500/20")} />
                                </div>

                                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-tight">
                                    {isKid ? "Le Club des" : "L'Atelier des"}
                                    <br />
                                    <span className={cn("text-lg", isLegendary ? "text-amber-400" : isKid ? "text-purple-400" : "text-blue-400")}>
                                        {isKid ? "Petits Magiciens" : "Magiciens"}
                                    </span>
                                </h3>

                                <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent my-6"></div>

                                {/* New Impactful Tagline */}
                                <p className="text-xs text-white/80 leading-relaxed font-serif font-medium px-2 tracking-wide italic shadow-black drop-shadow-md mb-2">
                                    {isKid
                                        ? "« La vraie magie se trouve à l'intérieur de toi, il ne te reste plus qu'à l'exprimer pour la révéler au monde. »"
                                        : "« L'art de l'illusion s'apprend dans l'ombre. Bienvenue dans la Confrérie. »"}
                                </p>

                                {/* Biography */}
                                {profile?.bio && (
                                    <div className="w-full px-4 mt-2 mb-2">
                                        <div className="bg-black/40 border border-white/10 rounded-lg p-2.5 text-[9px] md:text-[10px] text-white/70 italic line-clamp-4 text-center shadow-inner">
                                            "{profile.bio}"
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Verification Block */}
                            <div className="mt-auto w-full pt-4">
                                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg py-2 px-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] flex flex-col items-center">
                                    <div className="w-full flex items-center justify-between mb-1 opacity-40">
                                        <div className="flex-1 h-px bg-white"></div>
                                        <p className="text-[7px] text-white uppercase tracking-[0.2em] px-2 font-bold">Authentification</p>
                                        <div className="flex-1 h-px bg-white"></div>
                                    </div>
                                    <div className="text-[10px] text-white/50 font-mono tracking-widest flex items-center gap-2">
                                        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isLegendary ? "bg-amber-400" : isKid ? "bg-purple-400" : "bg-blue-400")}></span>
                                        ID-M-{user.id.slice(0, 8).toUpperCase()}
                                    </div>
                                </div>
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
