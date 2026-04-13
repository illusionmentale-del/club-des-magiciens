"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

export default function SearchInput({ 
    showTypeFilter = false,
    placeholder = "Rechercher un tour, un secret, un PDF..."
}: { 
    showTypeFilter?: boolean;
    placeholder?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
    const [isPending, startTransition] = useTransition();

    // Sync state with URL
    useEffect(() => {
        setQuery(searchParams.get("q") || "");
        setTypeFilter(searchParams.get("type") || "");
    }, [searchParams]);

    const updateParams = (newQuery: string, newType: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams);
            if (newQuery.trim()) {
                params.set("q", newQuery);
            } else {
                params.delete("q");
            }
            
            if (newType) {
                params.set("type", newType);
            } else {
                params.delete("type");
            }
            
            router.replace(`?${params.toString()}`);
        });
    };

    const handleSearch = (val: string) => {
        setQuery(val);
        updateParams(val, typeFilter);
    };
    
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setTypeFilter(newType);
        updateParams(query, newType);
    };

    const clearSearch = () => {
        setQuery("");
        updateParams("", typeFilter);
    };

    return (
        <div className="relative w-full md:max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 ${isPending ? 'text-brand-gold animate-pulse' : 'text-brand-text-muted'}`} />
                </div>
                <input 
                    type="text" 
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full h-[58px] bg-black/40 border border-brand-purple/30 text-white text-base rounded-2xl md:rounded-full py-4 pl-12 pr-12 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 shadow-inner transition-colors"
                />
                {query && (
                    <button 
                        onClick={clearSearch} 
                        className="absolute inset-y-0 right-4 flex items-center text-brand-text-muted hover:text-white"
                    >
                        <X className="w-5 h-5 bg-white/10 rounded-full p-0.5" />
                    </button>
                )}
            </div>
            
            {showTypeFilter && (
                <div className="shrink-0 w-full md:w-48 relative">
                    <select
                        value={typeFilter}
                        onChange={handleTypeChange}
                        className="w-full h-[58px] bg-black/40 border border-brand-purple/30 text-white text-sm rounded-2xl md:rounded-full px-5 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 shadow-inner appearance-none transition-colors cursor-pointer"
                    >
                        <option value="">Tous les formats</option>
                        <option value="trick">Tours de Magie</option>
                        <option value="activity">Activités Manuelles</option>
                        <option value="pdf">Documents & PDF</option>
                        <option value="illusion">Illusions</option>
                        <option value="game">Jeux</option>
                        <option value="challenge">Défis</option>
                        <option value="tips">Conseils</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-brand-text-muted">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}
