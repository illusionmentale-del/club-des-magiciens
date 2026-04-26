"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export interface GamificationEvent {
    unlockedWelcome?: boolean;
    leveledUpTo?: string | null;
    gainedXP?: number;
    newQuestsData?: any[];
}

interface GamificationModalProps {
    event: GamificationEvent | null;
    onClose: () => void;
}

export default function GamificationModal({ event, onClose }: GamificationModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (event && (event.unlockedWelcome || event.leveledUpTo || (event.gainedXP && event.gainedXP > 0) || (event.newQuestsData && event.newQuestsData.length > 0))) {
            setIsVisible(true);
            // Auto close after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 500); // give time for exit animation
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [event, onClose]);

    if (!event) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                        onClick={() => { setIsVisible(false); setTimeout(onClose, 500); }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.8, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, y: -50, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="relative bg-gradient-to-br from-brand-purple to-blue-600 rounded-3xl p-1 pointer-events-auto max-w-sm w-full shadow-[0_0_50px_rgba(168,85,247,0.5)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* CSS Confetti/Rays Background */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.2)_10deg,transparent_20deg,rgba(255,255,255,0.2)_30deg,transparent_40deg)] animate-spin-slow mix-blend-overlay" />
                        </div>

                        <div className="bg-[#050507] rounded-[22px] p-8 text-center relative z-10 h-full flex flex-col items-center border border-white/10">
                            
                            {/* Icon */}
                            <motion.div 
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-purple to-indigo-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(94,92,230,0.6)] relative"
                            >
                                <motion.div 
                                    animate={{ rotate: 360 }} 
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-4 border-dashed border-white/30"
                                />
                                {event.leveledUpTo ? (
                                    <Trophy className="w-12 h-12 text-white drop-shadow-lg" />
                                ) : event.newQuestsData && event.newQuestsData.length > 0 ? (
                                    <Trophy className="w-12 h-12 text-white drop-shadow-lg" />
                                ) : (
                                    <Star className="w-12 h-12 text-white drop-shadow-lg fill-white" />
                                )}
                            </motion.div>

                            <motion.h2 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-black text-white uppercase tracking-wider mb-2"
                            >
                                Félicitations !
                            </motion.h2>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-4"
                            >
                                {event.unlockedWelcome && (
                                    <div className="bg-brand-purple/20 border border-brand-purple/50 rounded-xl p-3">
                                        <p className="text-brand-purple font-bold text-sm mb-1 uppercase">Succès Débloqué</p>
                                        <p className="text-white font-medium">Mes Premiers Pas</p>
                                    </div>
                                )}

                                {event.newQuestsData?.map((q, idx) => (
                                    <div key={idx} className="bg-brand-purple/20 border border-brand-purple/50 rounded-xl p-3">
                                        <p className="text-brand-purple font-bold text-sm mb-1 uppercase flex items-center justify-center gap-1"><Trophy className="w-3 h-3" /> Nouveau Succès</p>
                                        <p className="text-white font-medium">{q.title}</p>
                                    </div>
                                ))}

                                {event.leveledUpTo && (
                                    <div className="bg-brand-purple/20 border border-brand-purple/50 rounded-xl p-3">
                                        <p className="text-cyan-400 font-bold text-sm mb-1 uppercase">Nouveau Grade atteint</p>
                                        <p className="text-white font-black text-xl">{event.leveledUpTo}</p>
                                    </div>
                                )}

                                {event.gainedXP && event.gainedXP > 0 ? (
                                    <div className="flex items-center justify-center gap-2 text-xl font-black text-brand-purple mt-4">
                                        <Sparkles className="w-6 h-6" />
                                        +{event.gainedXP} XP
                                    </div>
                                ) : null}
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                onClick={() => { setIsVisible(false); setTimeout(onClose, 500); }}
                                className="mt-8 px-8 py-3 bg-white text-black font-bold uppercase rounded-full hover:scale-105 transition-transform"
                            >
                                Super !
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
