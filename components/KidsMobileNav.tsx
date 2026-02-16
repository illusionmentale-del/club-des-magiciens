"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, Settings, Video, LogOut, Star, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function KidsMobileNav({ logoUrl }: { logoUrl?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const isActive = (path: string) => pathname === path;

    const close = () => setIsOpen(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <div className="md:hidden bg-brand-card border-b border-brand-border sticky top-0 z-50 shadow-lg shadow-black/50">
            <div className="flex items-center justify-between p-4">
                <Link href="/kids" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-brand-text font-bold text-xs ring-2 ring-brand-border">
                        CM
                    </div>
                    <span className="font-bold text-brand-text uppercase tracking-widest text-xs">Club des Magiciens</span>
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-brand-text-muted hover:text-brand-text hover:bg-white/5 rounded-lg transition-colors border border-brand-border"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Overlay / Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={close}
                    />

                    {/* Menu Content */}
                    <div className="relative w-72 h-full bg-brand-card border-r border-brand-border flex flex-col p-6 animate-in slide-in-from-left duration-300 shadow-2xl">
                        {/* Geometric Accent Line */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-blue via-brand-purple to-transparent opacity-50"></div>

                        <div className="flex justify-between items-center mb-8 border-b border-brand-border pb-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-brand-text-muted uppercase tracking-widest font-bold">Menu Principal</span>
                                <span className="text-brand-text font-bold text-lg uppercase tracking-tight">Navigation</span>
                            </div>
                            <button onClick={close} className="p-2 text-brand-text-muted hover:text-brand-text bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-brand-border">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="space-y-4 flex-1">
                            <Link
                                href="/kids"
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${isActive('/kids')
                                    ? 'border-brand-blue bg-brand-blue/10 text-brand-text'
                                    : 'border-transparent text-brand-text-muted hover:text-brand-text hover:bg-white/5'}`}
                            >
                                <Star className={`w-5 h-5 ${isActive('/kids') ? 'text-brand-blue fill-brand-blue/20' : 'text-brand-text-muted group-hover:text-brand-blue'}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">Quartier Général</span>
                            </Link>

                            <Link
                                href="/kids/program"
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${isActive('/kids/program')
                                    ? 'border-brand-cyan bg-brand-cyan/10 text-brand-text'
                                    : 'border-transparent text-brand-text-muted hover:text-brand-text hover:bg-white/5'}`}
                            >
                                <Play className={`w-5 h-5 ${isActive('/kids/program') ? 'text-brand-cyan' : 'text-brand-text-muted group-hover:text-brand-cyan'}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">Programme</span>
                            </Link>

                            <Link
                                href="/kids/courses"
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${isActive('/kids/courses')
                                    ? 'border-brand-blue bg-brand-blue/10 text-brand-text'
                                    : 'border-transparent text-brand-text-muted hover:text-brand-text hover:bg-white/5'}`}
                            >
                                <BookOpen className={`w-5 h-5 ${isActive('/kids/courses') ? 'text-brand-blue' : 'text-brand-text-muted group-hover:text-brand-blue'}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">Grimoire</span>
                            </Link>

                            <Link
                                href="/kids/live"
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${isActive('/kids/live')
                                    ? 'border-brand-purple bg-brand-purple/10 text-brand-text'
                                    : 'border-transparent text-brand-text-muted hover:text-brand-text hover:bg-white/5'}`}
                            >
                                <Video className={`w-5 h-5 ${isActive('/kids/live') ? 'text-brand-purple animate-pulse' : 'text-brand-text-muted group-hover:text-brand-purple'}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">Live & Replay</span>
                            </Link>

                            <div className="w-full h-[1px] bg-white/5 my-4"></div>

                            <Link
                                href="/kids/account"
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${isActive('/kids/account')
                                    ? 'border-brand-blue bg-brand-blue/10 text-brand-text'
                                    : 'border-transparent text-brand-text-muted hover:text-brand-text hover:bg-white/5'}`}
                            >
                                <Settings className={`w-5 h-5 ${isActive('/kids/account') ? 'text-brand-blue' : 'text-brand-text-muted group-hover:text-brand-blue'}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">Mon Espace</span>
                            </Link>
                        </nav>

                        <div className="pt-6 border-t border-brand-border mt-auto">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-error/10 hover:bg-brand-error/20 text-brand-error hover:text-red-400 transition-colors border border-brand-error/20 text-xs font-bold uppercase tracking-widest"
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
