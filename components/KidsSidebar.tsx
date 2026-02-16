"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, BookOpen, Settings, Video, Star, Youtube, Instagram, Facebook, LayoutDashboard, Shield, Wand2, ShoppingBag, Trophy, Map, Package } from "lucide-react";

export default function KidsSidebar({ socialLinks, logoUrl, isAdmin, hasPurchases }: {
    socialLinks?: { youtube: string; instagram: string; facebook: string; tiktok: string };
    logoUrl?: string;
    isAdmin?: boolean;
    hasPurchases?: boolean;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login"); // Explicit redirect
    };

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-magic-card border-r border-white/10 hidden md:flex flex-col flex-shrink-0 h-full">
            {/* Logo Area */}
            <div className="p-6 border-b border-white/10 flex flex-col items-center gap-4 text-center">
                <Link href="/kids">
                    <div className="relative w-32 h-32 hover:scale-105 transition-transform">
                        <Image
                            src={logoUrl || "/logo.png"}
                            alt="Club des Magiciens"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                <div>
                    <h2 className="font-bold text-white text-sm">Jérémy Marouani</h2>
                    <p className="text-xs text-magic-gold font-mono">@LeMagicienPOV</p>
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                    <a href={socialLinks?.youtube || "#"} target="_blank" className="hover:text-red-500 transition-colors"><Youtube className="w-4 h-4" /></a>
                    <a href={socialLinks?.instagram || "#"} target="_blank" className="hover:text-pink-500 transition-colors"><Instagram className="w-4 h-4" /></a>
                    <a href={socialLinks?.facebook || "#"} target="_blank" className="hover:text-blue-500 transition-colors"><Facebook className="w-4 h-4" /></a>
                    {/* SVG for TikTok */}
                    <a href={socialLinks?.tiktok || "#"} target="_blank" className="hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                    </a>
                </div>
            </div>

            {/* Navigation */}
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {/* 1. 🏰 Le Club (Home) */}
                <Link
                    href="/kids"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids') && !window.location.hash ? 'bg-magic-purple/20 text-magic-purple border border-magic-purple/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <Wand2 className="w-5 h-5" />
                    Le Club
                </Link>

                {/* 2. 🎩 L’Atelier de la Semaine (Anchor) */}
                <Link
                    href="/kids#atelier"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white`}
                >
                    <span className="text-xl">🎩</span>
                    L'Atelier
                </Link>

                {/* 3. 📖 Le Grimoire (Archives) */}
                <Link
                    href="/kids/program"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/program') ? 'bg-magic-purple/20 text-magic-purple border border-magic-purple/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <BookOpen className="w-5 h-5" />
                    Le Grimoire
                </Link>

                {/* 4. 🏅 Mon Parcours (Profile/Stats) */}
                <Link
                    href="/kids/account"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/account') && !pathname.includes('view=settings') ? 'bg-magic-purple/20 text-magic-purple border border-magic-purple/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <Trophy className="w-5 h-5" />
                    Mon Parcours
                </Link>

                {/* 5. 👤 Mon Compte (Settings) */}
                <Link
                    href="/kids/account?view=settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/account') && pathname.includes('view=settings') ? 'bg-magic-purple/20 text-magic-purple border border-magic-purple/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <Settings className="w-5 h-5" />
                    Mon Compte
                </Link>

                {/* 📦 Mes Coffres (Dynamic) */}
                {hasPurchases && (
                    <Link
                        href="/kids/courses?filter=owned"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-brand-gold hover:bg-white/5 hover:text-white`}
                    >
                        <Package className="w-5 h-5" />
                        Mes Coffres
                    </Link>
                )}    {isAdmin && (
                    <>
                        <div className="my-2 border-t border-white/10"></div>
                        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Admin</p>

                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Espace Adulte
                        </Link>

                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin') ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
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
        </aside >
    );
}
