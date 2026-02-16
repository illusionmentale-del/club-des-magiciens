"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, Settings, Video, LogOut, Star } from "lucide-react";
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
        <div className="md:hidden bg-[#0F1014] border-b border-white/5 sticky top-0 z-50 shadow-lg shadow-black/50">
            <div className="flex items-center justify-between p-4">
                <Link href="/kids" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
                        CM
                    </div>
                    <span className="font-bold text-white uppercase tracking-widest text-xs">Club des Magiciens</span>
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-white/5"
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
                    <div className="relative w-72 h-full bg-[#0F1014] border-r border-white/5 flex flex-col p-6 animate-in slide-in-from-left duration-300 shadow-2xl">
                        {/* Geometric Accent Line */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-600 via-purple-600 to-transparent opacity-50"></div>

                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Menu Principal</span>
                                <span className="text-white font-bold text-lg uppercase tracking-tight">Navigation</span>
                            </div>
                            <button onClick={close} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="space-y-4 flex-1">
                            <Link
                                href="/kids"
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${isActive('/kids')
                                    ? 'border-blue-500 bg-blue-500/10 text-white'
                                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Star className={`w-5 h-5 ${isActive('/kids') ? 'text-blue-500 fill-blue-500/20' : 'text-slate-500 group-hover:text-blue-400'}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">Quartier Général</span>
                            </Link>

                            <Link
                                href="/kids/courses"
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${isActive('/kids/courses')
                                    ? 'border-blue-500 bg-blue-500/10 text-white'
                                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <BookOpen className={`w-5 h-5 ${isActive('/kids/courses') ? 'text-blue-500' : 'text-slate-500 group-hover:text-blue-400'}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">Grimoire</span>
                            </Link>

                            <Link
                                href="/kids/live"
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${isActive('/kids/live')
                                    ? 'border-purple-500 bg-purple-500/10 text-white'
                                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Video className={`w-5 h-5 ${isActive('/kids/live') ? 'text-purple-500 animate-pulse' : 'text-slate-500 group-hover:text-purple-400'}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">Live & Replay</span>
                            </Link>

                            <div className="w-full h-[1px] bg-white/5 my-4"></div>

                            <Link
                                href="/kids/account"
                                onClick={close}
                                className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${isActive('/kids/account')
                                    ? 'border-blue-500 bg-blue-500/10 text-white'
                                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Settings className={`w-5 h-5 ${isActive('/kids/account') ? 'text-blue-500' : 'text-slate-500 group-hover:text-blue-400'}`} />
                                <span className="font-bold text-sm tracking-wide uppercase">Mon Espace</span>
                            </Link>
                        </nav>

                        <div className="pt-6 border-t border-white/5 mt-auto">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors border border-red-500/20 text-xs font-bold uppercase tracking-widest"
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
