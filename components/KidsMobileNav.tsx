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
        <div className={`${isForcedDesktop ? 'hidden' : (isForcedMobile ? 'block' : 'md:hidden')} bg-magic-card border-b border-white/10 sticky top-0 z-50`}>
            <div className="flex items-center justify-between p-4">
                <Link href="/kids/account" className="flex items-center gap-3 group">
                    <MagicAvatar imageUrl={avatarUrl} levelName={magicLevel} size="sm" />
                    <div className="min-w-0 pr-1">
                        <h2 className="font-bold text-white text-xs leading-tight line-clamp-1 group-hover:text-brand-purple transition-colors">{userName}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] text-brand-gold font-mono truncate max-w-[80px] sm:max-w-[120px]">{magicLevel}</p>
                            <div className="flex items-center gap-1 bg-black/30 rounded-full px-1.5 py-0.5 border border-white/5 shrink-0">
                                <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
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
                        className="p-2 text-white hover:bg-white/10 active:scale-95 transition-transform rounded-lg relative"
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
                        className="fixed inset-0 bg-black/95 transition-opacity"
                        onClick={close}
                    />

                    {/* Menu Content */}
                    <div className="relative w-64 h-full bg-magic-card border-r border-white/10 flex flex-col p-4 animate-in slide-in-from-left duration-200">
                        <div className="flex items-start justify-between mb-6">
                            <Link href="/kids/account" onClick={close} className="flex items-center gap-3 group">
                                <MagicAvatar imageUrl={avatarUrl} levelName={magicLevel} size="sm" />
                                <div className="min-w-0 pr-1">
                                    <h2 className="font-bold text-white text-xs leading-tight line-clamp-1 group-hover:text-brand-purple transition-colors">{userName}</h2>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <p className="text-[10px] text-brand-gold font-mono truncate max-w-[60px]">{magicLevel}</p>
                                        <div className="flex items-center gap-1 bg-black/30 rounded-full px-1.5 py-0.5 border border-white/5 shrink-0">
                                            <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
                                            <span className="text-[9px] font-bold text-white leading-none">{xpBalance} XP</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <button onClick={close} className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="space-y-2 flex-1 flex flex-col">
                            {/* 1. 🏰 Le Club (Home) */}
                            <Link
                                href="/kids"
                                onClick={close}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isHomeActive ? 'bg-magic-purple/20 border border-magic-purple/20' : 'hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids') && pathname === '/kids' ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${isActive('/kids') && pathname === '/kids' ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>L'Actu du Club</div>
                                        <div className="text-xs text-gray-500">Retrouve toutes les dernières actualités</div>
                                    </div>
                                </div>
                            </Link>

                            {/* 2. 📖 La Formation */}
                            {enableProgram && (
                                <Link href="/kids/program" onClick={() => setIsOpen(false)} className="block group">
                                    <div className="flex items-center gap-4">
                                        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/program') || pathname?.startsWith('/kids/courses') ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                                            <BookOpen className="w-5 h-5" />
                                            {hasUnreadFormation && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-magic-card"></span>
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className={`font-bold flex items-center gap-2 ${isActive('/kids/program') || pathname?.startsWith('/kids/courses') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>
                                                La Formation
                                                {hasUnreadFormation && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none">RÉPONSE</span>}
                                            </div>
                                            <div className="text-xs text-gray-500">Accéder aux cours et contenus</div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* 3. 🎬 Les Ateliers */}
                            {enableMasterclass && (
                                <Link href="/kids/videos" onClick={() => setIsOpen(false)} className="block group">
                                    <div className="flex items-center gap-4">
                                        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/videos') ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                                            <Video className="w-5 h-5" />
                                            {hasUnreadAtelier && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-magic-card"></span>
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className={`font-bold flex items-center gap-2 ${isActive('/kids/videos') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>
                                                Les Ateliers
                                                {hasUnreadAtelier && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none">RÉPONSE</span>}
                                            </div>
                                            <div className="text-xs text-gray-500">Ateliers à thèmes pour approfondir la magie</div>
                                        </div>
                                    </div>
                                </Link>
                            )}



                            {/* 5. 🏪 La Boutique */}
                            {enableShop && (
                                <Link href="/kids/shop" onClick={close} className="block group">
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

                            {/* 📦 Mes Vidéos (Purchases) */}
                            {hasPurchases && (
                                <Link href="/kids/purchases" onClick={close} className="block group mb-2">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-brand-gold/10 text-brand-gold`}>
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-brand-gold">Mes Vidéos</div>
                                            <div className="text-xs text-gray-500">Tes tours débloqués</div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* ⚙️ Mes Paramètres */}
                            {enableAccount && (
                                <Link href="/kids/account?view=settings" onClick={close} className="block group">
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


                            {isAdmin && (
                                <>
                                    <div className="my-2 border-t border-white/10"></div>
                                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Admin</p>

                                    <Link
                                        href="/dashboard"
                                        onClick={close}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white`}
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Espace Adulte
                                    </Link>

                                    <Link
                                        href="/admin"
                                        onClick={close}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin') ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <Shield className="w-5 h-5" />
                                        Accès Admin
                                    </Link>
                                </>
                            )}

                            <div className="pt-4 border-t border-white/10">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20 text-sm font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Déconnexion
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
