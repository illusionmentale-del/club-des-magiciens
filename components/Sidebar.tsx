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
        <aside className="w-64 bg-[#000000] border-r border-white/5 hidden md:flex flex-col flex-shrink-0 h-full">
            {/* Profile Area */}
            <div className="p-6 border-b border-white/5 flex flex-col items-center gap-4 text-center">
                <Link href="/dashboard/account" className="flex flex-col items-center gap-2 group relative w-full rounded-[16px] p-2 hover:bg-white/5 transition-colors">
                    <div className="relative w-24 h-24 mb-2">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt="Avatar"
                                fill
                                className="object-cover rounded-full border border-white/10 group-hover:border-white/30 transition-colors shadow-lg"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-[#1c1c1e] flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors shadow-lg">
                                <User className="w-10 h-10 text-[#86868b]" />
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full text-center px-2">
                        <h2 className="font-semibold text-[#f5f5f7] text-base leading-tight group-hover:text-white transition-colors truncate">{userName || "Illusionniste"}</h2>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                            <p className="text-[10px] text-[#86868b] uppercase tracking-widest truncate">Cliquez pour configurer</p>
                        </div>
                    </div>
                </Link>


            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto font-medium">
                {/* 1. L'Actu du Club */}
                <Link
                    href="/dashboard"
                    className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/dashboard') ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/dashboard') ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-white shadow-lg shadow-brand-purple/20' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                            <Star className="w-5 h-5" />
                        </div>
                        <div>
                            <div className={`font-semibold ${isActive('/dashboard') ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>
                                {uiLabels?.nav_actu || "L'Actu du Club"}
                            </div>
                            <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Retrouvez les nouveautés</div>
                        </div>
                    </div>
                </Link>

                {/* 2. Mes Vidéos */}
                {toggles?.enable_adults_program !== false && (
                    <Link
                        href="/dashboard/library"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/dashboard/library') ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/dashboard/library') ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-white shadow-lg shadow-brand-purple/20' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-semibold ${isActive('/dashboard/library') ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>
                                    {uiLabels?.nav_videos || "Mes Vidéos"}
                                </div>
                                <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Accéder à vos parcours</div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* 3. Mes Formations */}
                {toggles?.enable_adults_masterclass !== false && (
                    <Link
                        href="/dashboard/masterclass"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/dashboard/masterclass') ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/dashboard/masterclass') ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-white shadow-lg shadow-brand-purple/20' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                <Video className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-semibold ${isActive('/dashboard/masterclass') ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>
                                    {uiLabels?.nav_formations || "Mes Formations"}
                                </div>
                                <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Masterclass premium</div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* 4. La Boutique */}
                <Link
                    href="/dashboard/shop"
                    className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${isActive('/dashboard/shop') ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive('/dashboard/shop') ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-white shadow-lg shadow-brand-purple/20' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className={`font-semibold ${isActive('/dashboard/shop') ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>
                                {uiLabels?.nav_boutique || "La Boutique"}
                            </div>
                            <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Accessoires et secrets</div>
                        </div>
                    </div>
                </Link>

                {/* 5. Mes Paramètres */}
                {toggles?.enable_adults_account !== false && (
                    <Link
                        href="/dashboard/account?view=settings"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 ease-[0.16,1,0.3,1] ${(isActive('/dashboard/account') || searchParams?.get('view') === 'settings') ? 'bg-[#1c1c1e] border border-white/5 shadow-md' : 'hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${(isActive('/dashboard/account') || searchParams?.get('view') === 'settings') ? 'bg-gradient-to-br from-brand-purple to-indigo-500 text-white shadow-lg shadow-brand-purple/20' : 'bg-[#1c1c1e] text-[#86868b] group-hover:bg-white/10 group-hover:text-white border border-white/5'}`}>
                                <Settings className="w-5 h-5" />
                            </div>
                            <div>
                                <div className={`font-semibold ${(isActive('/dashboard/account') || searchParams?.get('view') === 'settings') ? 'text-white' : 'text-[#86868b] group-hover:text-white'}`}>
                                    {uiLabels?.nav_settings || "Mes Paramètres"}
                                </div>
                                <div className="text-[10px] text-[#86868b] font-normal mt-0.5">Gérer mon compte</div>
                            </div>
                        </div>
                    </Link>
                )}

                {(isAdmin || hasKidsAccess) && (
                    <>
                        <div className="my-4 border-t border-white/5"></div>
                        <p className="px-4 text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-2">Passerelle</p>
                        <Link
                            href="/kids"
                            className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all text-[#86868b] hover:bg-brand-purple/10 hover:text-brand-purple`}
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/admin') ? 'bg-brand-purple/20 border border-brand-purple/30 text-brand-purple' : 'text-[#86868b] hover:bg-brand-purple/10 hover:text-brand-purple'}`}
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#1c1c1e] hover:bg-white/10 text-[#86868b] hover:text-[#f5f5f7] transition-all text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}
