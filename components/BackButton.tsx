"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ label = "Retour", className = "" }: { label?: string; className?: string }) {
    const router = useRouter();

    return (
        <button 
            onClick={() => router.back()} 
            className={`flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group w-fit ${className}`}
        >
            <div className="p-1 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="text-sm font-medium tracking-widest uppercase">{label}</span>
        </button>
    );
}
