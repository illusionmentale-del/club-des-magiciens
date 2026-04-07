"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";

interface CategoryBannerProps {
    categoryId: string;
    title: string;
    description: string;
    icon?: any;
    colorClass?: string;
    bgClass?: string;
}

export default function CategoryBanner({
    categoryId,
    title,
    description,
    icon: Icon = Lightbulb,
    colorClass = "text-brand-purple",
    bgClass = "bg-brand-purple/10 border-brand-purple/20"
}: CategoryBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has closed this specific banner
        const storageKey = `kids_banner_${categoryId}_seen`;
        const hasSeen = localStorage.getItem(storageKey);
        
        if (!hasSeen) {
            // Show with a slight delay so it pops in nicely after page load
            const timer = setTimeout(() => setIsVisible(true), 600);
            return () => clearTimeout(timer);
        }
    }, [categoryId]);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem(`kids_banner_${categoryId}_seen`, "true");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, scale: 0.95, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mb-8"
                >
                    <div className={`relative w-full rounded-2xl border p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg ${bgClass}`}>
                        
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-black/20 backdrop-blur-sm border ${bgClass.split(' ')[1]}`}>
                            <Icon className={`w-6 h-6 ${colorClass}`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 pr-6">
                            <h3 className={`text-lg font-black uppercase tracking-tight mb-1 ${colorClass}`}>
                                {title}
                            </h3>
                            <p className="text-brand-text/90 text-sm leading-relaxed max-w-3xl">
                                {description}
                            </p>
                        </div>
                        
                        {/* Close Button */}
                        <button 
                            onClick={handleClose}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-brand-text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors group"
                            title="Ne plus afficher"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
