"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, BookOpen, Settings, Video, Star, Youtube, Instagram, Facebook, LayoutDashboard, Shield, Wand2, ShoppingBag, Trophy, Map, Package, Sparkles, Store, ChevronRight } from "lucide-react";
import MagicAvatar from "@/components/kids/MagicAvatar";

export default function KidsSidebar({ socialLinks, logoUrl, isAdmin, hasPurchases, hasUnreadFormation, hasUnreadAtelier, hasAdultsAccess, enableProgram = true, enableMasterclass = true, enableAccount = true, enableShop = true, xpBalance = 0, lifetimeXP = 0, magicLevel = "Apprenti", avatarUrl = "", userName = "" }: {
    socialLinks?: { youtube: string; instagram: string; facebook: string; tiktok: string };
    logoUrl?: string;
    isAdmin?: boolean;
    hasPurchases?: boolean;
    hasUnreadFormation?: boolean;
    hasUnreadAtelier?: boolean;
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
        <aside className={`w-72 bg-[#000000] border-r border-white/5 ${isForcedMobile ? 'hidden' : (isForcedDesktop ? 'flex' : 'hidden md:flex')} flex-col flex-shrink-0 h-full`}>
            {/* Profil Enfant Bento */}
            <div className="p-6 border-b border-white/5 flex flex-col items-center gap-4 text-center">
                <Link href="/kids/account" className="flex flex-col items-center gap-3 group relative w-full bg-[#1c1c1e] border border-white/5 rounded-[24px] p-4 hover:border-brand-purple/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all ease-[0.16,1,0.3,1] duration-500">
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10">
                        <ChevronRight className="w-4 h-4 text-brand-purple" />
                    </div>
                    
                    <div className="transform group-hover:scale-105 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                        <MagicAvatar imageUrl={avatarUrl} levelName={magicLevel} size="lg" />
                    </div>
                    
                    <div className="w-full text-center px-1 mt-1">
                        <h2 className="font-bold text-[#f5f5f7] text-base leading-tight group-hover:text-white transition-colors truncate">{userName}</h2>
                        <div className="flex flex-col items-center justify-center gap-1.5 mt-2">
                            <p className="text-[10px] text-brand-purple uppercase tracking-widest font-bold truncate">{magicLevel}</p>
                            <div className="flex items-center gap-1.5 bg-[#000000] rounded-full px-2.5 py-1 border border-white/10 shrink-0">
                                <Sparkles className="w-3 h-3 text-brand-purple" />
                                <span className="text-[10px] font-bold text-white leading-none">{xpBalance} XP</span>
                            </div>
                        </div>
                        {/* Mini Progress Bar */}
                        <div className="h-1.5 w-full bg-[#000000] rounded-full overflow-hidden border border-white/5 mt-3 mx-auto max-w-[80%] relative">
                            <div
                                className={`h-full absolute left-0 top-0 rounded-full ${isLegendary ? "bg-gradient-to-r from-indigo-600 to-cyan-400" : isHolo ? "bg-gradient-to-r from-purple-600 to-brand-blue" : "bg-gradient-to-r from-brand-blue to-cyan-400"}`}
                                style={{ width: `${Math.max(progressPercent, 2)}%` }}
                            />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-3 overflow-y-auto flex flex-col font-medium">

                {/* 1. 🏰 Le Club (Home) */}
                <Link
                    href="/kids"
                    className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isHomeActive ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isHomeActive ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-white shadow-lg shadow-brand-purple/20' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <div>
                            <div className={`font-semibold ${isHomeActive ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>L'Actu du Club</div>
                            <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Retrouve les nouveautés</div>
                        </div>
                    </div>
                </Link>

                {/* 2. 📖 Le Grimoire (Archives) */}
                {enableProgram && (
                    <Link href="/kids/program" className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/program') ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/program') ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-white shadow-lg shadow-brand-purple/20' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                <BookOpen className="w-5 h-5" />
                                {hasUnreadFormation && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#000000]"></span>
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className={`font-semibold flex items-center gap-2 ${isActive('/kids/program') ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>
                                    La Formation
                                    {hasUnreadFormation && <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none tracking-widest uppercase">Nouveau</span>}
                                </div>
                                <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Accéder aux cours</div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* 3. 🎬 Les Ateliers */}
                {enableMasterclass && (
                    <Link href="/kids/videos" className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/videos') ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/videos') ? 'bg-gradient-to-br from-brand-blue to-cyan-500 text-white shadow-lg shadow-brand-blue/20' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                <Video className="w-5 h-5" />
                                {hasUnreadAtelier && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#000000]"></span>
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className={`font-semibold flex items-center gap-2 ${isActive('/kids/videos') ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>
                                    Les Ateliers
                                    {hasUnreadAtelier && <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none tracking-widest uppercase">Nouveau</span>}
                                </div>
                                <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Approfondir la magie</div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* 5. 🏪 La Boutique */}
                {enableShop && (
                    <Link href="/kids/shop" className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/shop') ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/shop') ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-black shadow-lg shadow-brand-purple/20' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-semibold ${isActive('/kids/shop') ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>La Boutique</div>
                                <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Découvre les trucs</div>
                            </div>
                        </div>
                    </Link>
                )}

                <div className="mt-auto pt-6 pb-2 border-t border-white/5 mx-4"></div>

                {/* 📦 Mes Coffres (Purchases) */}
                {hasPurchases && (
                    <Link href="/kids/purchases" className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/purchases') ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/purchases') ? 'bg-brand-purple text-black shadow-lg' : 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20 group-hover:bg-brand-purple/20'}`}>
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-semibold ${isActive('/kids/purchases') ? 'text-brand-purple' : 'text-brand-purple/80 group-hover:text-brand-purple'}`}>Mes Vidéos</div>
                                <div className="text-[10px] text-brand-purple/50 font-normal mt-0.5">Tes tours débloqués</div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* ⚙️ Mes Paramètres */}
                {enableAccount && (
                    <Link href="/kids/account?view=settings" className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/account') && searchParams.get('view') === 'settings' ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/account') && searchParams.get('view') === 'settings' ? 'bg-[#2c2c2e] text-white border border-white/10' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                <Settings className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-semibold ${isActive('/kids/account') && searchParams.get('view') === 'settings' ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>Mes Paramètres</div>
                                <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Mot de passe et alertes</div>
                            </div>
                        </div>
                    </Link>
                )}

                {(isAdmin || hasAdultsAccess) && (
                    <>
                        <div className="my-2 border-t border-white/5"></div>
                        <p className="px-4 text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1 mt-2">Passerelle</p>

                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded-[12px] font-medium transition-all text-[#86868b] hover:bg-white/5 hover:text-white`}
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-[12px] font-medium transition-all text-[#86868b] hover:bg-white/5 hover:text-white`}
                        >
                            <Shield className="w-5 h-5" />
                            Accès Admin
                        </Link>
                    </>
                )}

            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-white/5 bg-[#000000]">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#1c1c1e] hover:bg-white/10 text-[#86868b] hover:text-[#f5f5f7] transition-all text-sm font-medium border border-white/5"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </aside >
    );
}
