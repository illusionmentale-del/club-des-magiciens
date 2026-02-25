"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, BookOpen, Settings, Video, LogOut, Star, Play, ShoppingBag, Trophy, Map, Package, Wand2, Shield, LayoutDashboard, Sparkles, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function KidsMobileNav({ logoUrl, hasPurchases, isAdmin, hasUnreadReplies }: { logoUrl?: string; hasPurchases?: boolean; isAdmin?: boolean; hasUnreadReplies?: boolean; }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
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

    const isActive = (path: string) => pathname === path;
    const isHomeActive = isActive('/kids') && (!mounted || !hash);

    const close = () => setIsOpen(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <div className={`${isForcedDesktop ? 'hidden' : (isForcedMobile ? 'block' : 'md:hidden')} bg-magic-card border-b border-white/10 sticky top-0 z-50`}>
            <div className="flex items-center justify-between p-4">
                <Link href="/kids">
                    <div className="relative w-32 h-10">
                        <Image
                            src="/logo.png"
                            alt="Club des Magiciens"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    {hasUnreadReplies && (
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                    )}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 text-white hover:bg-white/10 rounded-lg relative"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Overlay / Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={close}
                    />

                    {/* Menu Content */}
                    <div className="relative w-64 h-full bg-magic-card border-r border-white/10 flex flex-col p-4 animate-in slide-in-from-left duration-200">
                        <div className="flex justify-end mb-4">
                            <button onClick={close} className="p-2 text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="space-y-2 flex-1">
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

                            {/* 2. 📖 Le Grimoire (Archives) */}
                            {/* Menu Programme => La Formation */}
                            <Link href="/kids/program" onClick={close} className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive('/kids/program') || pathname?.startsWith('/kids/courses') ? 'bg-magic-purple/20 border border-magic-purple/20' : 'hover:bg-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/program') || pathname?.startsWith('/kids/courses') ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${isActive('/kids/program') || pathname?.startsWith('/kids/courses') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>La Formation</div>
                                        <div className="text-xs text-gray-500">Accéder aux cours et contenus</div>
                                    </div>
                                </div>
                            </Link>

                            {/* 3. 🎬 Les Masterclass */}
                            <Link href="/kids/videos" onClick={close} className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive('/kids/videos') ? 'bg-magic-purple/20 border border-magic-purple/20' : 'hover:bg-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/videos') ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${isActive('/kids/videos') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>Les Masterclass</div>
                                        <div className="text-xs text-gray-500">Perfectionne-toi en vidéo</div>
                                    </div>
                                </div>
                                {hasUnreadReplies && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-full font-bold">RÉPONSE</span>
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                                    </div>
                                )}
                            </Link>

                            {/* 4. 👤 Mes Informations */}
                            <Link href="/kids/account" onClick={close} className="block group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/account') ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${isActive('/kids/account') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>Mes Informations</div>
                                        <div className="text-xs text-gray-500">Ma progression et mes secrets</div>
                                    </div>
                                </div>
                            </Link>

                            {/* 5. 🏪 La Boutique */}
                            <Link href="/kids/shop" onClick={close} className="block group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/kids/shop') ? 'bg-magic-purple text-white shadow-lg shadow-magic-purple/20' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                        <Store className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${isActive('/kids/shop') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>La Boutique</div>
                                        <div className="text-xs text-gray-500">Découvre les trucs de Jérémy</div>
                                    </div>
                                </div>
                            </Link>

                            {/* 📦 Mes Coffres (Purchases) */}
                            {hasPurchases && (
                                <Link href="/kids/purchases" onClick={close} className="block group">
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
