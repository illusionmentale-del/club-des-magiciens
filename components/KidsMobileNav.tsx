"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, BookOpen, Settings, Video, LogOut, Star, Play, ShoppingBag, Trophy, Map, Package, Wand2, Shield, LayoutDashboard, Sparkles, Store, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import MagicAvatar from "@/components/kids/MagicAvatar";

export default function KidsMobileNav({ logoUrl, isAdmin, hasPurchases, hasUnreadFormation, hasUnreadAtelier, enableProgram = true, enableMasterclass = true, enableAccount = true, enableShop = true, xpBalance = 0, lifetimeXP = 0, magicLevel = "Apprenti", avatarUrl = "", userName = "" }: {
    logoUrl?: string;
    hasPurchases?: boolean;
    isAdmin?: boolean;
    hasUnreadFormation?: boolean;
    hasUnreadAtelier?: boolean;
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
    const [isOpen, setIsOpen] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();

    const isLegendary = (lifetimeXP || 0) >= 150;
    const isHolo = (lifetimeXP || 0) >= 50 && (lifetimeXP || 0) < 150;
    const maxForLevel = isLegendary ? 500 : (isHolo ? 150 : 50);
    const progressPercent = Math.min(((lifetimeXP || 0) / maxForLevel) * 100, 100);

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

    const isActive = (path: string) => pathname === path;
    const isHomeActive = isActive('/kids') && (!mounted || !hash);

    const close = () => setIsOpen(false);

    const handleOpen = () => {
        setIsOpening(true);
        // Defer rendering the heavy overlay/menu to let the browser paint the loading spinner first
        setTimeout(() => {
            setIsOpen(true);
            setIsOpening(false);
        }, 50);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <div className={`${isForcedDesktop ? 'hidden' : (isForcedMobile ? 'block' : 'md:hidden')} bg-[#000000] border-b border-white/5 sticky top-0 z-50`}>
            <div className="flex items-center justify-between p-4">
                <Link href="/kids/account" className="flex items-center gap-3 group">
                    <MagicAvatar imageUrl={avatarUrl} levelName={magicLevel} size="sm" />
                    <div className="min-w-0 pr-1">
                        <h2 className="font-bold text-[#f5f5f7] text-xs leading-tight line-clamp-1 group-hover:text-white transition-colors">{userName}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] text-brand-purple font-mono truncate max-w-[80px] sm:max-w-[120px]">{magicLevel}</p>
                            <div className="flex items-center gap-1 bg-[#1c1c1e] rounded-full px-1.5 py-0.5 border border-white/5 shrink-0">
                                <Sparkles className="w-2.5 h-2.5 text-brand-purple" />
                                <span className="text-[9px] font-bold text-white leading-none">{xpBalance} XP</span>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    {(hasUnreadFormation || hasUnreadAtelier) && (
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                    )}
                    <button
                        onClick={handleOpen}
                        disabled={isOpening}
                        className="p-2 text-[#f5f5f7] hover:bg-white/10 active:scale-95 transition-transform rounded-lg relative"
                    >
                        {isOpening ? (
                            <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Overlay / Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
                        onClick={close}
                    />

                    {/* Menu Content */}
                    <div className="relative w-72 h-full bg-[#1c1c1e] border-r border-white/5 flex flex-col p-4 animate-in slide-in-from-left duration-300 ease-[0.16,1,0.3,1]">
                        <div className="flex items-start justify-between mb-6">
                            <Link href="/kids/account" onClick={close} className="flex items-center gap-3 group">
                                <MagicAvatar imageUrl={avatarUrl} levelName={magicLevel} size="sm" />
                                <div className="min-w-0 pr-1">
                                    <h2 className="font-bold text-[#f5f5f7] text-xs leading-tight line-clamp-1 group-hover:text-white transition-colors">{userName}</h2>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <p className="text-[10px] text-brand-purple uppercase tracking-widest font-bold truncate max-w-[60px]">{magicLevel}</p>
                                        <div className="flex items-center gap-1 bg-[#000000] rounded-full px-1.5 py-0.5 border border-white/5 shrink-0">
                                            <Sparkles className="w-2.5 h-2.5 text-brand-purple" />
                                            <span className="text-[9px] font-bold text-white leading-none">{xpBalance} XP</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <button onClick={close} className="p-2 -mr-2 -mt-2 text-[#86868b] hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="space-y-2 flex-1 flex flex-col font-medium">
                            {/* 1. 🏰 Le Club (Home) */}
                            <Link
                                href="/kids"
                                onClick={close}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isHomeActive ? 'bg-[#000000] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isHomeActive ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-white shadow-lg shadow-brand-purple/20' : 'bg-[#000000] text-[#86868b] group-hover:text-white border border-white/5'}`}>
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`font-semibold ${isHomeActive ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>L'Actu du Club</div>
                                        <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Retrouve les nouveautés</div>
                                    </div>
                                </div>
                            </Link>

                            {/* 2. 📖 La Formation */}
                            {enableProgram && (
                                <Link href="/kids/program" onClick={() => setIsOpen(false)} className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/program') || pathname?.startsWith('/kids/courses') ? 'bg-[#000000] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/program') || pathname?.startsWith('/kids/courses') ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-white shadow-lg shadow-brand-purple/20' : 'bg-[#000000] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                            <BookOpen className="w-5 h-5" />
                                            {hasUnreadFormation && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#1c1c1e]"></span>
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className={`font-semibold flex items-center gap-2 ${isActive('/kids/program') || pathname?.startsWith('/kids/courses') ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>
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
                                <Link href="/kids/videos" onClick={() => setIsOpen(false)} className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/videos') ? 'bg-[#000000] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/videos') ? 'bg-gradient-to-br from-brand-blue to-cyan-500 text-white shadow-lg shadow-brand-blue/20' : 'bg-[#000000] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                            <Video className="w-5 h-5" />
                                            {hasUnreadAtelier && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-[#1c1c1e]"></span>
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
                                <Link href="/kids/shop" onClick={close} className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/shop') ? 'bg-[#000000] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/shop') ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-black shadow-lg shadow-brand-purple/20' : 'bg-[#000000] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
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

                            {/* 📦 Mes Vidéos (Purchases) */}
                            {hasPurchases && (
                                <Link href="/kids/purchases" onClick={close} className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/purchases') ? 'bg-[#000000] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/purchases') ? 'bg-brand-purple text-black shadow-lg' : 'bg-[#000000] text-brand-purple border border-brand-purple/20 group-hover:bg-brand-purple/10'}`}>
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
                                <Link href="/kids/account?view=settings" onClick={close} className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/kids/account') && searchParams.get('view') === 'settings' ? 'bg-[#000000] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/account') && searchParams.get('view') === 'settings' ? 'bg-[#2c2c2e] text-white border border-white/10' : 'bg-[#000000] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className={`font-semibold ${isActive('/kids/account') && searchParams.get('view') === 'settings' ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>Mes Paramètres</div>
                                            <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Mot de passe et alertes</div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {isAdmin && (
                                <>
                                    <div className="my-2 border-t border-white/5"></div>
                                    <p className="px-4 text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1 mt-2">Admin</p>

                                    <Link
                                        href="/dashboard"
                                        onClick={close}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-[12px] font-medium transition-all text-[#86868b] hover:bg-white/5 hover:text-white`}
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Espace Adulte
                                    </Link>

                                    <Link
                                        href="/admin"
                                        onClick={close}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-[12px] font-medium transition-all text-[#86868b] hover:bg-white/5 hover:text-white`}
                                    >
                                        <Shield className="w-5 h-5" />
                                        Accès Admin
                                    </Link>
                                </>
                            )}
                        </nav>

                        <div className="pt-4 border-t border-white/5 mt-auto px-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#000000] hover:bg-white/10 text-[#86868b] hover:text-[#f5f5f7] transition-all text-sm font-medium border border-white/5"
                            >
                                <LogOut className="w-4 h-4" />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
