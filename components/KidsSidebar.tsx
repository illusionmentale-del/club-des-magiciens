"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, BookOpen, Settings, Video, Star, Youtube, Instagram, Facebook, LayoutDashboard, Shield, Wand2 } from "lucide-react";

export default function KidsSidebar({ socialLinks, logoUrl, isAdmin }: {
    socialLinks?: { youtube: string; instagram: string; facebook: string; tiktok: string };
    logoUrl?: string;
    isAdmin?: boolean;
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
        <aside className="w-64 bg-brand-surface border-r border-brand-border hidden md:flex flex-col flex-shrink-0 h-full shadow-xl text-brand-text">
            {/* Logo Area */}
            <div className="p-6 border-b border-brand-border flex flex-col items-center gap-4 text-center">
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
                    <h2 className="font-bold text-brand-text text-sm">Jérémy Marouani</h2>
                    <p className="text-xs text-brand-cyan font-mono font-bold">@LeMagicienPOV</p>
                </div>

                <div className="flex items-center gap-3 text-brand-text-muted">
                    <a href={socialLinks?.youtube || "#"} target="_blank" className="hover:text-red-500 transition-colors"><Youtube className="w-4 h-4" /></a>
                    <a href={socialLinks?.instagram || "#"} target="_blank" className="hover:text-pink-500 transition-colors"><Instagram className="w-4 h-4" /></a>
                    <a href={socialLinks?.facebook || "#"} target="_blank" className="hover:text-blue-500 transition-colors"><Facebook className="w-4 h-4" /></a>
                    {/* SVG for TikTok - Black/Dark for light theme */}
                    <a href={socialLinks?.tiktok || "#"} target="_blank" className="hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                    </a>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link
                    href="/kids/program"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/program') ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-brand-text-muted hover:bg-white/5 hover:text-brand-text'}`}
                >
                    <Wand2 className="w-5 h-5" />
                    Mon Programme
                </Link>
                <Link
                    href="/kids/courses"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/courses') ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-brand-text-muted hover:bg-white/5 hover:text-brand-text'}`}
                >
                    <BookOpen className="w-5 h-5" />
                    Mes tours de magie
                </Link>

                <Link
                    href="/kids"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids') ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-brand-text-muted hover:bg-white/5 hover:text-brand-text'}`}
                >
                    <Star className="w-5 h-5" />
                    Le QG
                </Link>

                <Link
                    href="/kids/live"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/live') ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : 'text-brand-text-muted hover:bg-white/5 hover:text-brand-text'}`}
                >
                    <Video className="w-5 h-5" />
                    Live Magique <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">LIVE</span>
                </Link>

                <Link
                    href="/kids/account"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/account') ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-brand-text-muted hover:bg-white/5 hover:text-brand-text'}`}
                >
                    <Settings className="w-5 h-5" />
                    Mon Compte
                </Link>

                {isAdmin && (
                    <>
                        <div className="my-2 border-t border-brand-border"></div>
                        <p className="px-4 text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-1">Admin</p>

                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-brand-text-muted hover:bg-white/5 hover:text-brand-text`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Espace Adulte
                        </Link>

                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/admin') ? 'bg-brand-error/10 text-brand-error border border-brand-error/20' : 'text-brand-text-muted hover:bg-white/5 hover:text-brand-text'}`}
                        >
                            <Shield className="w-5 h-5" />
                            Accès Admin
                        </Link>
                    </>
                )}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-brand-border bg-black/20">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-error/10 hover:bg-brand-error/20 text-brand-error transition-colors border border-brand-error/20 text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}
