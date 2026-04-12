"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Retour", className = "" }: { label?: string, className?: string }) {
    const router = useRouter();

    return (
        <button 
            onClick={() => router.back()} 
            className={`flex items-center gap-2 text-brand-text hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg ${className}`}
        >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-widest">{label}</span>
        </button>
    );
}
