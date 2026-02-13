"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, BookOpen, Settings, Video, Star, Youtube, Instagram, Facebook } from "lucide-react";

export default function KidsSidebar({ socialLinks, logoUrl }: {
    socialLinks?: { youtube: string; instagram: string; facebook: string; tiktok: string };
    logoUrl?: string;
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
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 h-full shadow-sm text-gray-800">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-200 flex flex-col items-center gap-4 text-center">
                <Link href="/kids">
                    <div className="relative w-32 h-32 hover:scale-105 transition-transform">
                        <Image
                            src={logoUrl || "/logo.png"}
                            alt="Club des Magiciens"
                            fill
                            className="object-contain filter brightness-110" // Make colors pop on white
                            priority
                        />
                    </div>
                </Link>

                <div>
                    <h2 className="font-bold text-gray-900 text-sm">Jérémy Marouani</h2>
                    <p className="text-xs text-magic-purple font-mono font-bold">@LeMagicienPOV</p>
                </div>

                <div className="flex items-center gap-3 text-gray-500">
                    <a href={socialLinks?.youtube || "#"} target="_blank" className="hover:text-red-500 transition-colors"><Youtube className="w-4 h-4" /></a>
                    <a href={socialLinks?.instagram || "#"} target="_blank" className="hover:text-pink-500 transition-colors"><Instagram className="w-4 h-4" /></a>
                    <a href={socialLinks?.facebook || "#"} target="_blank" className="hover:text-blue-500 transition-colors"><Facebook className="w-4 h-4" /></a>
                    {/* SVG for TikTok - Black/Dark for light theme */}
                    <a href={socialLinks?.tiktok || "#"} target="_blank" className="hover:text-black transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                    </a>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link
                    href="/kids"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids') ? 'bg-magic-purple/10 text-magic-purple border border-magic-purple/20 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    <Star className="w-5 h-5" />
                    Le QG
                </Link>

                <Link
                    href="/kids/courses"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/courses') ? 'bg-magic-purple/10 text-magic-purple border border-magic-purple/20 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    <BookOpen className="w-5 h-5" />
                    Mes Formations
                </Link>

                <Link
                    href="/kids/account"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/account') ? 'bg-magic-purple/10 text-magic-purple border border-magic-purple/20 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    <Settings className="w-5 h-5" />
                    Mon Compte
                </Link>

                <Link
                    href="/kids/live"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/live') ? 'bg-magic-purple/10 text-magic-purple border border-magic-purple/20 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    <Video className="w-5 h-5" />
                    Live Magique <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">LIVE</span>
                </Link>
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200 text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}
