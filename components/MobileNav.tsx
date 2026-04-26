"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, BookOpen, Settings, Video, LogOut, Shield, Star, GraduationCap, ShoppingBag, Sparkles, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MobileNav({ isAdmin, hasKidsAccess, toggles, xpBalance = 0, lifetimeXP = 0, magicLevel = "Initié", avatarUrl = "", userName = "", uiLabels }: {
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
    const searchParams = useSearchParams();
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
        <div className="md:hidden bg-[#000000] border-b border-white/5 sticky top-0 z-50">
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
                    className="p-2 text-[#f5f5f7] hover:bg-white/10 active:scale-95 transition-transform rounded-lg"
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
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
                        onClick={close}
                    />

                    {/* Menu Content */}
                    <div className="relative w-72 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col p-4 animate-in slide-in-from-left duration-300 ease-[0.16,1,0.3,1]">
                        <div className="flex justify-end mb-2">
                            <button onClick={close} className="p-2 text-[#86868b] hover:text-[#f5f5f7]">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Profile Area */}
                        <div className="pb-4 border-b border-white/5 flex flex-col items-center gap-2 text-center mb-6">
                            <Link href="/dashboard/account" onClick={close} className="flex flex-col items-center gap-3 group w-full rounded-[16px] hover:bg-white/5 transition-colors p-3">
                                <div className="relative w-20 h-20">
                                    {avatarUrl ? (
                                        <Image
                                            src={avatarUrl}
                                            alt="Avatar"
                                            fill
                                            className="object-cover rounded-full border border-white/10 group-hover:border-white/30 transition-colors shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors shadow-lg">
                                            <User className="w-8 h-8 text-[#86868b]" />
                                        </div>
                                    )}
                                </div>
                                <div className="w-full text-center px-1">
                                    <h2 className="font-semibold text-[#f5f5f7] text-base leading-tight group-hover:text-white transition-colors truncate">{userName || "Illusionniste"}</h2>
                                    <div className="flex items-center justify-center gap-1.5 mt-1">
                                        <p className="text-[10px] text-[#86868b] uppercase tracking-widest truncate">Paramètres</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <nav className="space-y-2 flex-1 overflow-y-auto font-medium px-2 min-h-0 pb-4">
                            <Link
                                href="/dashboard"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/dashboard') ? 'bg-white/10 text-[#f5f5f7]' : 'text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7]'}`}
                            >
                                <Star className="w-5 h-5" />
                                {uiLabels?.nav_actu || "L'Actu du Club"}
                            </Link>

                            {toggles?.enable_adults_program !== false && (
                                <Link
                                    href="/dashboard/library"
                                    onClick={close}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/dashboard/library') ? 'bg-white/10 text-[#f5f5f7]' : 'text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7]'}`}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    {uiLabels?.nav_videos || "Mes Vidéos"}
                                </Link>
                            )}

                            {toggles?.enable_adults_masterclass !== false && (
                                <Link
                                    href="/dashboard/masterclass"
                                    onClick={close}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/dashboard/masterclass') ? 'bg-white/10 text-[#f5f5f7]' : 'text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7]'}`}
                                >
                                    <Video className="w-5 h-5" />
                                    {uiLabels?.nav_formations || "Mes Formations"}
                                </Link>
                            )}

                            <Link
                                href="/dashboard/shop"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/dashboard/shop') ? 'bg-white/10 text-[#f5f5f7]' : 'text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7]'}`}
                            >
                                <Sparkles className="w-5 h-5" />
                                {uiLabels?.nav_boutique || "La Boutique"}
                            </Link>

                            {toggles?.enable_adults_account !== false && (
                                <Link
                                    href="/dashboard/account?view=settings"
                                    onClick={close}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${(isActive('/dashboard/account') || searchParams?.get('view') === 'settings') ? 'bg-white/10 text-[#f5f5f7]' : 'text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7]'}`}
                                >
                                    <Settings className="w-5 h-5" />
                                    {uiLabels?.nav_settings || "Mes Paramètres"}
                                </Link>
                            )}

                            {(isAdmin || hasKidsAccess) && (
                                <>
                                    <div className="my-4 border-t border-white/5"></div>
                                    <p className="px-4 text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-2">Passerelle</p>
                                    <Link
                                        href="/kids"
                                        onClick={close}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7]`}
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center">👶</div>
                                        Espace Kids
                                    </Link>
                                </>
                            )}

                            {isAdmin && (
                                <>
                                    <div className="my-4 border-t border-white/5"></div>
                                    <p className="px-4 text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-2">Admin</p>
                                    <Link
                                        href="/admin"
                                        onClick={close}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/admin') ? 'bg-white/10 text-[#f5f5f7]' : 'text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7]'}`}
                                    >
                                        <Shield className="w-5 h-5" />
                                        Accès Admin
                                    </Link>
                                </>
                            )}
                        </nav>

                        <div className="pt-4 border-t border-white/5 mt-auto px-2 shrink-0">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-black hover:bg-white/10 text-[#86868b] hover:text-[#f5f5f7] transition-all text-sm font-medium"
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
