"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, BookOpen, Settings, Video, Star, Youtube, Instagram, Facebook, LayoutDashboard, Shield, Wand2, ShoppingBag, Trophy, Map, Package } from "lucide-react";

export default function KidsSidebar({ socialLinks, logoUrl, isAdmin, hasPurchases }: {
    socialLinks?: { youtube: string; instagram: string; facebook: string; tiktok: string };
    logoUrl?: string;
    isAdmin?: boolean;
    hasPurchases?: boolean;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    // Support for forced preview modes
    const forcedView = searchParams.get('view');
    const isForcedMobile = forcedView === 'mobile';
    const isForcedDesktop = forcedView === 'desktop';
    const [mounted, setMounted] = useState(false);
    const [hash, setHash] = useState('');

    useEffect(() => {
        setMounted(true);
        setHash(window.location.hash);

        const handleHashChange = () => setHash(window.location.hash);
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login"); // Explicit redirect
    };

    const isActive = (path: string) => pathname === path;
    const isHomeActive = isActive('/kids') && (!mounted || !hash);

    return (
        <aside className={`w-64 bg-magic-card border-r border-white/10 ${isForcedMobile ? 'hidden' : (isForcedDesktop ? 'flex' : 'hidden md:flex')} flex-col flex-shrink-0 h-full`}>
            {/* Logo Area */}
            <div className="p-6 border-b border-white/10 flex flex-col items-center gap-4 text-center">
                <Link href="/kids">
                    <div className="relative w-32 h-32 hover:scale-105 transition-transform">
                        <Image
                            src={logoUrl || "/logo.png"}
                            alt="Club des Magiciens"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                <div>
                    <h2 className="font-bold text-white text-sm">Jérémy Marouani</h2>
                    <p className="text-xs text-magic-gold font-mono">@LeMagicienPOV</p>
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                    <a href={socialLinks?.youtube || "#"} target="_blank" className="hover:text-red-500 transition-colors"><Youtube className="w-4 h-4" /></a>
                    <a href={socialLinks?.instagram || "#"} target="_blank" className="hover:text-pink-500 transition-colors"><Instagram className="w-4 h-4" /></a>
                    <a href={socialLinks?.facebook || "#"} target="_blank" className="hover:text-blue-500 transition-colors"><Facebook className="w-4 h-4" /></a>
                    {/* SVG for TikTok */}
                    <a href={socialLinks?.tiktok || "#"} target="_blank" className="hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                    </a>
                </div>
            </div>

            {/* Navigation */}
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* 1. 🏰 Le Club (Home) */}
                <Link
                    href="/kids"
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isHomeActive ? 'bg-magic-purple/20 border border-magic-purple/20' : 'hover:bg-white/5'}`}
                >
                    <div className={`p-2 rounded-lg ${isHomeActive ? 'bg-magic-purple text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                        <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                        <div className={`font-bold ${isHomeActive ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>Le Club</div>
                        <div className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400 hidden xl:block">Retrouve toutes les dernières actualités</div>
                    </div>
                </Link>

                {/* 2. 📖 Le Grimoire (Archives) */}
                <Link
                    href="/kids/program"
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/kids/program') ? 'bg-magic-purple/20 border border-magic-purple/20' : 'hover:bg-white/5'}`}
                >
                    <div className={`p-2 rounded-lg ${isActive('/kids/program') ? 'bg-magic-purple text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <div className={`font-bold ${isActive('/kids/program') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>Le QG des Petits Magiciens</div>
                        <div className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400 hidden xl:block">Accéder aux cours et contenus</div>
                    </div>
                </Link>

                {/* 3. 👤 Mes Informations (Combined) */}
                <Link
                    href="/kids/account"
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/kids/account') ? 'bg-magic-purple/20 border border-magic-purple/20' : 'hover:bg-white/5'}`}
                >
                    <div className={`p-2 rounded-lg ${isActive('/kids/account') ? 'bg-magic-purple text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <div className={`font-bold ${isActive('/kids/account') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>Mes Informations</div>
                        <div className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400 hidden xl:block">Ma carte, ma progression et mes secrets</div>
                    </div>
                </Link>

                {/* 📦 Mes Coffres (Dynamic) */}
                {hasPurchases && (
                    <Link
                        href="/kids/courses?filter=owned"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5`}
                    >
                        <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-brand-gold">Mes Coffres</div>
                            <div className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400 hidden xl:block">Tes trésors magiques</div>
                        </div>
                    </Link>
                )}    {isAdmin && (
                    <>
                        <div className="my-2 border-t border-white/10"></div>
                        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Admin</p>

                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Espace Adulte
                        </Link>

                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin') ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Shield className="w-5 h-5" />
                            Accès Admin
                        </Link>
                    </>
                )}

            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20 text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </aside >
    );
}
