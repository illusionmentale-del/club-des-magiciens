"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type MagicAvatarProps = {
    imageUrl?: string | null;
    levelName: string; // "Apprenti", "Magicien", "Illusionniste" or custom
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
};

export default function MagicAvatar({ imageUrl, levelName, size = "md", className }: MagicAvatarProps) {
    // 1. Définir les tailles
    const sizeClasses = {
        sm: "w-10 h-10",
        md: "w-16 h-16",
        lg: "w-24 h-24",
        xl: "w-32 h-32"
    };

    // 2. Associer les thèmes en fonction du nom du niveau
    const levelLower = (levelName || "").toLowerCase();
    
    let themeClass = "avatar-theme-default"; // Basique

    if (levelLower.includes("apprenti") || levelLower.includes("débutant")) {
        themeClass = "avatar-theme-parchemin";
    } else if (levelLower.includes("magicien") || levelLower.includes("intermédiaire")) {
        themeClass = "avatar-theme-emeraude";
    } else if (levelLower.includes("illusionniste") || levelLower.includes("avancé")) {
        themeClass = "avatar-theme-foudre";
    } else if (levelLower.includes("suprême") || levelLower.includes("maître") || levelLower.includes("sorcier") || levelLower.includes("dieu")) {
        themeClass = "avatar-theme-feu";
    } else if (levelLower !== "") {
         // Si c'est un autre grade personnalisé inconnu, on met un effet doré par défaut
         themeClass = "avatar-theme-feu";
    }

    const finalImage = imageUrl && imageUrl.trim() !== "" 
        ? imageUrl 
        : "/avatars/avatar_base_student.png";

    return (
        <div className={cn("relative flex items-center justify-center shrink-0", sizeClasses[size], className, themeClass)}>
            {/* Particules et auras (Géré en CSS pur via global.css) */}
            <div className="absolute inset-[-20%] rounded-full aura-container z-0 pointer-events-none" />
            
            <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-white/10 avatar-inner transition-all duration-500 bg-brand-card">
                <Image 
                    src={finalImage} 
                    alt={`Avatar de niveau ${levelName}`} 
                    fill 
                    className="object-cover" 
                />
            </div>
        </div>
    );
}
