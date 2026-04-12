"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [isPending, startTransition] = useTransition();

    // Sync state with URL
    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    const handleSearch = (val: string) => {
        setQuery(val);
        startTransition(() => {
            const params = new URLSearchParams(searchParams);
            if (val.trim()) {
                params.set("q", val);
            } else {
                params.delete("q");
            }
            router.replace(`?${params.toString()}`);
        });
    };

    const clearSearch = () => {
        setQuery("");
        router.replace("?");
    };

    return (
        <div className="relative w-full md:max-w-md mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 ${isPending ? 'text-brand-gold animate-pulse' : 'text-brand-text-muted'}`} />
            </div>
            <input 
                type="text" 
                placeholder="Rechercher un tour, une carte, un secret..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-black/40 border border-brand-purple/30 text-white text-base rounded-full py-4 pl-12 pr-12 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 shadow-inner transition-colors"
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
    );
}
