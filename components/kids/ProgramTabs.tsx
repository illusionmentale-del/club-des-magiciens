"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ListVideo, Grid2x2, Paintbrush } from "lucide-react";

export default function ProgramTabs() {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "parcours";
    const currentQuery = searchParams.get("q") || "";

    const tabs = [
        { id: "parcours", label: "Mon Parcours", icon: ListVideo },
        { id: "index", label: "Toutes les vidéos", icon: Grid2x2 },
    ];

    return (
        <div className="flex bg-black/40 p-1.5 rounded-2xl w-full max-w-lg mx-auto border border-white/10 shadow-lg">
            {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                const Icon = tab.icon;
                const href = currentQuery ? `?tab=${tab.id}&q=${encodeURIComponent(currentQuery)}` : `?tab=${tab.id}`;
                return (
                    <Link
                        key={tab.id}
                        href={href}
                        scroll={false}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all
                            ${isActive ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'text-brand-text-muted hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </Link>
                );
            })}
        </div>
    );
}
