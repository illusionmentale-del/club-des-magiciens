"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, BookOpen, Settings, Video, Star, Youtube, Instagram, Facebook, LayoutDashboard, Shield, Wand2, ShoppingBag, Trophy, Map, Package, Sparkles, Store, ChevronRight } from "lucide-react";
import MagicAvatar from "@/components/kids/MagicAvatar";

export default function KidsSidebar({ socialLinks, logoUrl, isAdmin, hasPurchases, hasUnreadReplies, hasAdultsAccess, enableProgram = true, enableMasterclass = true, enableAccount = true, enableShop = true, xpBalance = 0, lifetimeXP = 0, magicLevel = "Apprenti", avatarUrl = "", userName = "" }: {
    socialLinks?: { youtube: string; instagram: string; facebook: string; tiktok: string };
    logoUrl?: string;
    isAdmin?: boolean;
    hasPurchases?: boolean;
    hasUnreadReplies?: boolean;
    hasAdultsAccess?: boolean;
    enableProgram?: boolean;
    enableMasterclass?: boolean;
    enableAccount?: boolean;
    enableShop?: boolean;
    xpBalance?: number;
    lifetimeXP?: number;
    magicLevel?: string;
    avatarUrl?: string;
    userName?: string;
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

    const isLegendary = (lifetimeXP || 0) >= 150;
    const isHolo = (lifetimeXP || 0) >= 50 && (lifetimeXP || 0) < 150;
    const maxForLevel = isLegendary ? 500 : (isHolo ? 150 : 50);
    const progressPercent = Math.min(((lifetimeXP || 0) / maxForLevel) * 100, 100);

    return (
        <aside className={`w-64 bg-magic-card border-r border-white/10 ${isForcedMobile ? 'hidden' : (isForcedDesktop ? 'flex' : 'hidden md:flex')} flex-col flex-shrink-0 h-full`}>
            <div className="p-6 border-b border-white/10 flex flex-col items-center gap-4 text-center">
                <Link href="/kids/account" className="flex flex-col items-center gap-2 group relative w-full rounded-2xl p-2 hover:bg-white/5 transition-colors">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <ChevronRight className="w-5 h-5 text-brand-purple" />
                    </div>
                    <MagicAvatar imageUrl={avatarUrl} levelName={magicLevel} size="lg" className="group-hover:scale-105 transition-transform" />
                    <div className="w-full text-center px-2">
                        <h2 className="font-bold text-white text-sm leading-tight group-hover:text-brand-purple transition-colors truncate">{userName}</h2>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                            <p className="text-[10px] text-brand-gold font-mono truncate">{magicLevel}</p>
                            <div className="flex items-center gap-1 bg-black/30 rounded-full px-1.5 py-0.5 border border-white/5 shrink-0">
                                <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
                                <span className="text-[9px] font-bold text-white leading-none">{xpBalance} XP</span>
                            </div>
                        </div>
                        {/* Mini Progress Bar */}
                        <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 mt-2 mx-auto max-w-[80%]">
                            <div
                                className={`h-full relative ${isLegendary ? "bg-gradient-to-r from-amber-600 to-yellow-400" : isHolo ? "bg-gradient-to-r from-purple-600 to-blue-400" : "bg-gradient-to-r from-blue-600 to-cyan-400"}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </Link>

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
            <nav className="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col">


                {/* 1. 🏰 Le Club (Home) */}
                <Link
                    href="/kids"
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isHomeActive ? 'bg-magic-purple/20 border border-magic-purple/20' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids') && pathname === '/kids' ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <div>
                            <div className={`font-bold ${isActive('/kids') && pathname === '/kids' ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>L'Actu du Club</div>
                            <div className="text-xs text-gray-500">Retrouve les nouveautés</div>
                        </div>
                    </div>
                </Link>

                {/* 2. 📖 Le Grimoire (Archives) */}
                {enableProgram && (
                    <Link href="/kids/program" className="block group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/program') ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-bold ${isActive('/kids/program') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>La Formation</div>
                                <div className="text-xs text-gray-500">Accéder aux cours et contenus</div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* 3. 🎬 Les Ateliers */}
                {enableMasterclass && (
                    <Link href="/kids/videos" className="block group">
                        <div className="flex items-center gap-4">
                            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/videos') ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                                <Video className="w-5 h-5" />
                                {hasUnreadReplies && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-magic-card"></span>
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className={`font-bold flex items-center gap-2 ${isActive('/kids/videos') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>
                                    Les Ateliers
                                    {hasUnreadReplies && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">RÉPONSE</span>}
                                </div>
                                <div className="text-xs text-gray-500">Ateliers à thèmes pour approfondir la magie</div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* 4. 🏪 La Boutique */}
                {enableShop && (
                    <Link href="/kids/shop" className="block group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/shop') ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-bold ${isActive('/kids/shop') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>La Boutique</div>
                                <div className="text-xs text-gray-500">Découvre les trucs de Jérémy</div>
                            </div>
                        </div>
                    </Link>
                )}

                <div className="mt-auto pt-8 pb-2 border-t border-white/10 mx-4"></div>

                {/* 📦 Mes Coffres (Purchases) */}
                {hasPurchases && (
                    <Link href="/kids/purchases" className="block group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-brand-gold/10 text-brand-gold`}>
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-brand-gold">Mes Coffres</div>
                                <div className="text-xs text-gray-500">Tes trésors magiques</div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* ⚙️ Mes Paramètres */}
                {enableAccount && (
                    <Link href="/kids/account?view=settings" className="block group mt-2">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/account') && searchParams.get('view') === 'settings' ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                                <Settings className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-bold ${isActive('/kids/account') && searchParams.get('view') === 'settings' ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>Mes Paramètres</div>
                                <div className="text-xs text-gray-500">Mot de passe et alertes</div>
                            </div>
                        </div>
                    </Link>
                )}

                {(isAdmin || hasAdultsAccess) && (
                    <>
                        <div className="my-2 border-t border-white/10"></div>
                        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Passerelle</p>

                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Espace Adulte
                        </Link>
                    </>
                )}

                {isAdmin && (
                    <>
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
