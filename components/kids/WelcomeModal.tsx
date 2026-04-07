"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, GraduationCap, Sparkles, ShoppingBag, X, ChevronRight } from "lucide-react";

const slides = [
    {
        title: "Bienvenue au Club ! 🎩",
        description: "Prêt à devenir un vrai magicien ? Laisse-moi te montrer comment fonctionne ton nouveau repaire secret !",
        icon: Wand2,
        color: "text-brand-purple",
        bg: "bg-brand-purple/10",
        border: "border-brand-purple/20"
    },
    {
        title: "Les Ateliers 🎓",
        description: "C'est ton programme d'entraînement ! Suis les vidéos étape par étape, semaine après semaine, pour maîtriser l'art de l'illusion.",
        icon: GraduationCap,
        color: "text-brand-cyan",
        bg: "bg-brand-cyan/10",
        border: "border-brand-cyan/20"
    },
    {
        title: "La Bibliothèque 📚",
        description: "Envie d'apprendre un secret rapidement ? Explore la Bibliothèque pour piocher des tours et relever des défis magiques !",
        icon: Sparkles,
        color: "text-brand-blue",
        bg: "bg-brand-blue/10",
        border: "border-brand-blue/20"
    },
    {
        title: "La Boutique VIP 🎁",
        description: "Besoin de matériel de pro ? Commande tes boîtes physiques secrètes pour épater tes proches sur scène !",
        icon: ShoppingBag,
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20"
    }
];

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        // Check if the user has already seen the modal
        const hasSeen = localStorage.getItem("kids_welcome_seen");
        if (!hasSeen) {
            // Small delay so it doesn't jump scare immediately on load
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("kids_welcome_seen", "true");
    };

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            handleClose();
        }
    };

    if (!isOpen) return null;

    const slide = slides[currentSlide];
    const Icon = slide.icon;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-brand-border/50">
                        <div className="flex gap-1.5 ml-2">
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-brand-text' : i < currentSlide ? 'w-2 bg-brand-text-muted/50' : 'w-2 bg-brand-border'
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-brand-text-muted hover:text-brand-text hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 text-center flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center space-y-6"
                            >
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 shadow-2xl ${slide.bg} ${slide.border}`}>
                                    <Icon className={`w-12 h-12 ${slide.color}`} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-brand-text">
                                        {slide.title}
                                    </h3>
                                    <p className="text-brand-text-muted text-base leading-relaxed max-w-sm mx-auto">
                                        {slide.description}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-black/20 border-t border-brand-border/50 flex flex-col gap-3">
                        <button
                            onClick={nextSlide}
                            className={`w-full py-4 px-6 rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all group ${
                                currentSlide === slides.length - 1
                                    ? "bg-brand-purple hover:bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                    : "bg-white text-black hover:bg-gray-200"
                            }`}
                        >
                            {currentSlide === slides.length - 1 ? "Compris, c'est parti !" : "Suivant"}
                            {currentSlide < slides.length - 1 && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                        
                        <button 
                            onClick={handleClose}
                            className="text-xs text-brand-text-muted hover:text-white uppercase tracking-widest font-bold transition-colors py-2"
                        >
                            Passer ce tutoriel
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
