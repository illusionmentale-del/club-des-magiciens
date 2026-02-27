"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Edit, RotateCw } from "lucide-react";
import Image from "next/image";
import AccountForm from "@/app/dashboard/account/AccountForm";
import { cn } from "@/lib/utils";

interface MagicCardProps {
    user: any;
    profile: any;
    isKid?: boolean;
}

export default function MagicCard({ user, profile, isKid = false }: MagicCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
    };

    // Variant Styles
    const cardBg = isKid
        ? "bg-[#0F1014] border-purple-500/30"
        : "bg-neutral-900 border-magic-gold/30";

    const textColor = isKid ? "text-purple-400" : "text-magic-gold";
    const accentColor = isKid ? "bg-purple-500" : "bg-magic-gold";

    return (
        <div className="w-full max-w-2xl mx-auto perspective-1000 min-h-[600px] relative group/card font-sans">
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-purple to-brand-blue rounded-[2.5rem] opacity-0 blur-xl group-hover/card:opacity-40 transition duration-1000 pointer-events-none"></div>
            <motion.div
                className="relative w-full h-full preserve-3d transition-all duration-700"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* FRONT: Identity Card */}
                <div
                    className={`absolute inset-0 w-full h-full backface-hidden ${cardBg} border rounded-3xl p-8 shadow-2xl relative overflow-hidden group`}
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        backgroundColor: isKid ? "#050507" : "#171717", // Ensure opacity
                        zIndex: isFlipped ? 0 : 20,
                        pointerEvents: isFlipped ? "none" : "auto"
                    }}
                    onMouseMove={handleMouseMove}
                >
                    {/* Holographic Sheen Layer */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none z-20 mix-blend-overlay"
                        style={{
                            background: `radial-gradient(
                                circle at ${mousePosition.x}px ${mousePosition.y}px, 
                                rgba(255,255,255,0.4) 0%, 
                                rgba(255,255,255,0.1) 20%, 
                                transparent 60%
                            )`
                        }}
                    />

                    {/* Foil Texture (Subtle Noise) */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none z-0 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className={cn("absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none", isKid ? "bg-brand-purple/10" : "bg-magic-gold/10")} />

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                <span className="text-2xl">🎩</span>
                            </div>
                            <div>
                                <h1 className={`font-serif text-2xl font-bold ${isKid ? 'text-white' : 'text-magic-gold'}`}>
                                    {isKid ? "Carte d'Apprenti" : "Carte de Membre"}
                                </h1>
                                <p className="text-white/50 text-xs tracking-widest uppercase">Club des Magiciens</p>
                            </div>
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                            <span className="text-xs font-mono text-white/70">ID: {user.id.slice(0, 8)}</span>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {/* Avatar Column */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                {/* Avatar Container */}
                                <div className={`relative w-32 h-32 rounded-full p-1 ${isKid ? "bg-gradient-to-tr from-blue-600 to-brand-purple shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "bg-gradient-to-tr from-magic-gold to-orange-500 shadow-[0_0_20px_rgba(238,195,67,0.3)]"} animate-pulse-slow`}>
                                    <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
                                        <Image
                                            src={isKid ? (profile?.avatar_url_kids || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23FFD1DC'/><path d='M30 60h40v30H30z' fill='%23333'/><path d='M20 85h60v5H20z' fill='%23333'/><circle cx='50' cy='60' r='15' fill='%23FFF'/><path d='M40 30c-5-15-15-15-15 0s10 20 15 0zM60 30c5-15 15-15 15 0s-10 20-15 0z' fill='%23FFF'/></svg>") : (profile?.avatar_url || "/default-avatar.png")}
                                            alt="Avatar"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs font-bold text-white/80 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                                {profile?.magic_level || "Moldue"}
                            </div>
                        </div>

                        {/* Info Column */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <label className="text-white/40 text-xs uppercase tracking-wider mb-1 block">Nom de Scène</label>
                                <div className={`text-3xl font-bold ${textColor} drop-shadow-lg font-serif`}>
                                    {profile?.username || "Le Mystérieux"}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs uppercase tracking-wider mb-1 block">QG Secret</label>
                                    <div className="text-white font-medium">{profile?.city || "Inconnu"}</div>
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs uppercase tracking-wider mb-1 block">Membre Depuis</label>
                                    <div className="text-white font-medium">{new Date(user.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>

                            {/* Magic Stats / Level Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-white/60">
                                    <span>Progression Magique</span>
                                    <span>{profile?.xp || 0} XP</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    {/* Animated Liquid Bar */}
                                    {/* Using simpler gradient animation for performance/reliability */}
                                    <div
                                        className={`h-full relative overflow-hidden ${isKid ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gradient-to-r from-magic-gold to-amber-500"} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`}
                                        style={{ width: `${Math.min((profile?.xp || 0) / 10 * 10, 100)}%` }} // Example XP logic
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-12 flex justify-center relative z-10">
                        <button
                            onClick={() => setIsFlipped(true)}
                            className={`group flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isKid ? "bg-white text-slate-900 hover:bg-purple-50" : "bg-magic-gold text-black hover:bg-amber-400"} shadow-lg hover:shadow-xl hover:-translate-y-1`}
                        >
                            <Edit className="w-4 h-4" />
                            Modifier mon profil
                        </button>
                    </div>

                    {/* Holographic Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" style={{ mixBlendMode: 'overlay' }} />
                </div>

                {/* BACK: Edit Form */}
                <div
                    className={`absolute inset-0 w-full h-full backface-hidden ${cardBg} border rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col`}
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        backgroundColor: isKid ? "#050507" : "#171717", // Ensure opacity
                        zIndex: isFlipped ? 20 : 0,
                        pointerEvents: isFlipped ? "auto" : "none"
                    }}
                >
                    <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className={cn("w-5 h-5", isKid ? "text-brand-purple" : "text-magic-gold")} />
                            Mise à jour
                        </h2>
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                        >
                            <RotateCw className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto customized-scrollbar relative z-10 -mr-4 pr-4 pb-12">
                        <AccountForm user={user} profile={profile} theme="dark" isKidProfile={isKid} />
                        {/* Extra spacer at bottom to ensure button is reachable */}
                        <div className="h-24"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
