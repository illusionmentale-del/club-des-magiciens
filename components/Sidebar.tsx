"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, BookOpen, Settings, Shield, Video, Star, Youtube, Instagram, Facebook, GraduationCap, ShoppingBag, User, Sparkles } from "lucide-react";

export default function Sidebar({ isAdmin, socialLinks, logoUrl, hasKidsAccess, toggles, xpBalance = 0, lifetimeXP = 0, magicLevel = "Apprenti", avatarUrl = "", userName = "", uiLabels }: {
    isAdmin: boolean;
    socialLinks?: { youtube: string; instagram: string; facebook: string; tiktok: string };
    logoUrl?: string;
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
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login"); // Explicit redirect
    };

    const isActive = (path: string) => pathname === path;



    return (
        <aside className="w-64 bg-magic-card border-r border-white/10 hidden md:flex flex-col flex-shrink-0 h-full">
            {/* Profile Area */}
            <div className="p-6 border-b border-white/10 flex flex-col items-center gap-4 text-center">
                <Link href="/dashboard/account" className="flex flex-col items-center gap-2 group relative w-full rounded-2xl p-2 hover:bg-white/5 transition-colors">
                    <div className="relative w-24 h-24 mb-2">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt="Avatar"
                                fill
                                className="object-cover rounded-full border-2 border-magic-royal group-hover:border-magic-gold transition-colors shadow-lg"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center border-2 border-magic-royal group-hover:border-magic-gold transition-colors shadow-lg">
                                <User className="w-10 h-10 text-gray-400" />
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full text-center px-2">
                        <h2 className="font-bold text-white text-sm leading-tight group-hover:text-magic-gold transition-colors truncate">{userName || "Illusionniste"}</h2>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                            <p className="text-[10px] text-gray-500 font-mono truncate">Cliquez pour configurer</p>
                        </div>
                    </div>
                </Link>

                <div className="flex items-center gap-3 text-gray-500 mt-2">
                    <a href={socialLinks?.youtube || "#"} target="_blank" className="hover:text-red-500 transition-colors"><Youtube className="w-4 h-4" /></a>
                    <a href={socialLinks?.instagram || "#"} target="_blank" className="hover:text-pink-500 transition-colors"><Instagram className="w-4 h-4" /></a>
                    <a href={socialLinks?.facebook || "#"} target="_blank" className="hover:text-blue-500 transition-colors"><Facebook className="w-4 h-4" /></a>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                >
                    <Star className="w-5 h-5" />
                    {uiLabels?.nav_actu || "L'Actu du Club"}
                </Link>

                {toggles?.enable_adults_program !== false && (
                    <Link
                        href="/dashboard/library"
                        className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/library') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                    >
                        <BookOpen className="w-5 h-5" />
                        {uiLabels?.nav_videos || "Mes Vidéos"}
                    </Link>
                )}

                {toggles?.enable_adults_masterclass !== false && (
                    <Link
                        href="/dashboard/masterclass"
                        className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/masterclass') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                    >
                        <Video className="w-5 h-5" />
                        {uiLabels?.nav_formations || "Mes Formations"}
                    </Link>
                )}

                <Link
                    href="/dashboard/shop"
                    className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/shop') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                >
                    <Sparkles className="w-5 h-5" />
                    {uiLabels?.nav_boutique || "La Boutique"}
                </Link>

                {toggles?.enable_adults_account !== false && (
                    <Link
                        href="/dashboard/account?view=settings"
                        className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${(isActive('/dashboard/account') || searchParams?.get('view') === 'settings') ? 'bg-gradient-to-r from-magic-royal/20 to-transparent text-magic-royal border-l-2 border-magic-royal' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                    >
                        <Settings className="w-5 h-5" />
                        {uiLabels?.nav_settings || "Mes Paramètres"}
                    </Link>
                )}

                {(isAdmin || hasKidsAccess) && (
                    <>
                        <div className="my-2 border-t border-white/10"></div>
                        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Passerelle</p>
                        <Link
                            href="/kids"
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
                        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Admin</p>
                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/admin') ? 'bg-red-500/20 text-red-400 border-l-2 border-red-500' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
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
        </aside>
    );
}
