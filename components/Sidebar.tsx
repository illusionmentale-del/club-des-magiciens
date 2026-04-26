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

                <div className="flex items-center gap-4 text-[#86868b] mt-2">
                    <a href={socialLinks?.youtube || "#"} target="_blank" className="hover:text-white transition-colors"><Youtube className="w-4 h-4" /></a>
                    <a href={socialLinks?.instagram || "#"} target="_blank" className="hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
                    <a href={socialLinks?.facebook || "#"} target="_blank" className="hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto font-medium">
                <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/dashboard') ? 'bg-brand-purple/20 border border-brand-purple/30 text-brand-purple' : 'text-[#86868b] hover:bg-brand-purple/10 hover:text-brand-purple'}`}
                >
                    <Star className="w-5 h-5" />
                    {uiLabels?.nav_actu || "L'Actu du Club"}
                </Link>

                {toggles?.enable_adults_program !== false && (
                    <Link
                        href="/dashboard/library"
                        className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/dashboard/library') ? 'bg-brand-purple/20 border border-brand-purple/30 text-brand-purple' : 'text-[#86868b] hover:bg-brand-purple/10 hover:text-brand-purple'}`}
                    >
                        <BookOpen className="w-5 h-5" />
                        {uiLabels?.nav_videos || "Mes Vidéos"}
                    </Link>
                )}

                {toggles?.enable_adults_masterclass !== false && (
                    <Link
                        href="/dashboard/masterclass"
                        className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/dashboard/masterclass') ? 'bg-brand-purple/20 border border-brand-purple/30 text-brand-purple' : 'text-[#86868b] hover:bg-brand-purple/10 hover:text-brand-purple'}`}
                    >
                        <Video className="w-5 h-5" />
                        {uiLabels?.nav_formations || "Mes Formations"}
                    </Link>
                )}

                <Link
                    href="/dashboard/shop"
                    className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${isActive('/dashboard/shop') ? 'bg-brand-purple/20 border border-brand-purple/30 text-brand-purple' : 'text-[#86868b] hover:bg-brand-purple/10 hover:text-brand-purple'}`}
                >
                    <Sparkles className="w-5 h-5" />
                    {uiLabels?.nav_boutique || "La Boutique"}
                </Link>

                {toggles?.enable_adults_account !== false && (
                    <Link
                        href="/dashboard/account?view=settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${(isActive('/dashboard/account') || searchParams?.get('view') === 'settings') ? 'bg-brand-purple/20 border border-brand-purple/30 text-brand-purple' : 'text-[#86868b] hover:bg-brand-purple/10 hover:text-brand-purple'}`}
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
