"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, BookOpen, Settings, Video, LogOut, Star, Play, ShoppingBag, Trophy, Map, Package, Wand2, Shield, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function KidsMobileNav({ logoUrl, hasPurchases, isAdmin }: { logoUrl?: string; hasPurchases?: boolean; isAdmin?: boolean; }) {
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
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
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
                                <div className={`p-2 rounded-lg ${isHomeActive ? 'bg-magic-purple text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                    <Wand2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`font-bold ${isHomeActive ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>Le Club</div>
                                    <div className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400">Retrouve toutes les dernières actualités</div>
                                </div>
                            </Link>

                            {/* 2. 📖 Le Grimoire (Archives) */}
                            <Link
                                href="/kids/program"
                                onClick={close}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/kids/program') ? 'bg-magic-purple/20 border border-magic-purple/20' : 'hover:bg-white/5'}`}
                            >
                                <div className={`p-2 rounded-lg ${isActive('/kids/program') ? 'bg-magic-purple text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`font-bold ${isActive('/kids/program') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>Le QG des Petits Magiciens</div>
                                    <div className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400">Accéder aux cours et contenus</div>
                                </div>
                            </Link>

                            {/* 3. 👤 Mes Informations (Combined) */}
                            <Link
                                href="/kids/account"
                                onClick={close}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/kids/account') ? 'bg-magic-purple/20 border border-magic-purple/20' : 'hover:bg-white/5'}`}
                            >
                                <div className={`p-2 rounded-lg ${isActive('/kids/account') ? 'bg-magic-purple text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`font-bold ${isActive('/kids/account') ? 'text-magic-purple' : 'text-gray-300 group-hover:text-white'}`}>Mes Informations</div>
                                    <div className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400">Ma carte, ma progression et mes secrets</div>
                                </div>
                            </Link>

                            {/* 📦 Mes Coffres */}
                            {hasPurchases && (
                                <Link
                                    href="/kids/courses?filter=owned"
                                    onClick={close}
                                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5`}
                                >
                                    <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-brand-gold">Mes Coffres</div>
                                        <div className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400">Tes trésors magiques</div>
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
