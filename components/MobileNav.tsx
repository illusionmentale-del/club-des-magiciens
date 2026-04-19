"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, Settings, Video, LogOut, Shield, Star, GraduationCap, ShoppingBag, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MobileNav({ isAdmin, hasKidsAccess, toggles, xpBalance = 0, lifetimeXP = 0, magicLevel = "Initié", avatarUrl = "", userName = "" }: {
    isAdmin: boolean;
    hasKidsAccess?: boolean;
    toggles?: {
        enable_adults_program: boolean;
        enable_adults_masterclass: boolean;
        enable_adults_account: boolean;
        enable_adults_catalog: boolean;
    };
    xpBalance?: number;
    lifetimeXP?: number;
    magicLevel?: string;
    avatarUrl?: string;
    userName?: string;
    uiLabels?: Record<string, string>;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const isActive = (path: string) => pathname === path;

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
        <div className="md:hidden bg-magic-card border-b border-white/10 sticky top-0 z-50">
            <div className="flex items-center justify-between p-4">
                <Link href="/dashboard">
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
                    onClick={handleOpen}
                    disabled={isOpening}
                    className="p-2 text-white hover:bg-white/10 active:scale-95 transition-transform rounded-lg"
                >
                    {isOpening ? (
                        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
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
                        <div className="flex justify-end mb-2">
                            <button onClick={close} className="p-2 text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Profile Area */}
                        <div className="pb-4 border-b border-white/10 flex flex-col items-center gap-2 text-center mb-4">
                            <Link href="/dashboard/account" onClick={close} className="flex flex-col items-center gap-2 group w-full rounded-2xl hover:bg-white/5 transition-colors p-2">
                                <div className="relative w-16 h-16">
                                    {avatarUrl ? (
                                        <Image
                                            src={avatarUrl}
                                            alt="Avatar"
                                            fill
                                            className="object-cover rounded-full border border-magic-royal group-hover:border-magic-gold transition-colors"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center border border-magic-royal group-hover:border-magic-gold transition-colors">
                                            <LogOut className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="w-full text-center px-1">
                                    <h2 className="font-bold text-white text-xs leading-tight group-hover:text-magic-gold transition-colors truncate">{userName || "Illusionniste"}</h2>
                                    <div className="flex items-center justify-center gap-1.5 mt-1">
                                        <p className="text-[9px] text-gray-500 font-mono truncate">Paramètres</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <nav className="space-y-2 flex-1">
                            <Link
                                href="/dashboard"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                            >
                                <Star className="w-5 h-5" />
                                {uiLabels?.nav_actu || "L'Actu du Club"}
                            </Link>

                            {toggles?.enable_adults_program !== false && (
                                <Link
                                    href="/dashboard/library"
                                    onClick={close}
                                    className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/library') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    {uiLabels?.nav_videos || "Mes Vidéos"}
                                </Link>
                            )}

                            {toggles?.enable_adults_masterclass !== false && (
                                <Link
                                    href="/dashboard/masterclass"
                                    onClick={close}
                                    className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/masterclass') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                                >
                                    <Video className="w-5 h-5" />
                                    {uiLabels?.nav_formations || "Mes Formations"}
                                </Link>
                            )}

                            <Link
                                href="/dashboard/shop"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/shop') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                            >
                                <Sparkles className="w-5 h-5" />
                                {uiLabels?.nav_boutique || "La Boutique"}
                            </Link>

                            {toggles?.enable_adults_account !== false && (
                                <Link
                                    href="/dashboard/account?view=settings"
                                    onClick={close}
                                    className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${(isActive('/dashboard/account') || searchParams?.get('view') === 'settings') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                                >
                                    <Settings className="w-5 h-5" />
                                    {uiLabels?.nav_settings || "Mes Paramètres"}
                                </Link>
                            )}

                            {(isAdmin || hasKidsAccess) && (
                                <>
                                    <div className="my-2 border-t border-white/10"></div>
                                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Passerelle</p>
                                    <Link
                                        href="/kids"
                                        onClick={close}
                                        className={`flex items-center gap-3 px-4 py-3 font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent`}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center">👶</div>
                                        Espace Kids
                                    </Link>
                                </>
                            )}

                            {isAdmin && (
                                <>
                                    <div className="my-2 border-t border-white/10"></div>
                                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admin</p>
                                    <Link
                                        href="/admin"
                                        onClick={close}
                                        className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/admin') ? 'bg-red-500/20 text-red-400 border-l-2 border-red-500' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                                    >
                                        <Shield className="w-5 h-5" />
                                        Accès Admin
                                    </Link>
                                </>
                            )}
                        </nav>

                        <div className="pt-4 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20 text-sm font-medium"
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
