"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, Settings, Video, LogOut, Shield, Star, GraduationCap, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MobileNav({ isAdmin, hasKidsAccess }: { isAdmin: boolean; hasKidsAccess?: boolean }) {
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
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Overlay / Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={close}
                    />

                    {/* Menu Content */}
                    <div className="relative w-64 h-full bg-magic-card border-r border-white/10 flex flex-col p-4 animate-in slide-in-from-left duration-200">
                        <div className="flex justify-end mb-4">
                            <button onClick={close} className="p-2 text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="space-y-2 flex-1">
                            <Link
                                href="/dashboard/feed"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/feed') ? 'bg-gradient-to-r from-magic-gold/20 to-transparent text-magic-gold border-l-2 border-magic-gold' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                            >
                                <Video className="w-5 h-5" />
                                Vidéos
                            </Link>

                            <Link
                                href="/dashboard"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard') ? 'bg-gradient-to-r from-magic-gold/20 to-transparent text-magic-gold border-l-2 border-magic-gold' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                            >
                                <Star className="w-5 h-5" />
                                Le QG
                            </Link>

                            <Link
                                href="/dashboard/program"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/program') ? 'bg-gradient-to-r from-magic-gold/20 to-transparent text-magic-gold border-l-2 border-magic-gold' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                            >
                                <GraduationCap className="w-5 h-5" />
                                Mon Programme
                            </Link>

                            <Link
                                href="/dashboard/catalog"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/catalog') ? 'bg-gradient-to-r from-magic-gold/20 to-transparent text-magic-gold border-l-2 border-magic-gold' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Catalogue
                            </Link>

                            <Link
                                href="/dashboard/account"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/account') ? 'bg-gradient-to-r from-magic-gold/20 to-transparent text-magic-gold border-l-2 border-magic-gold' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                            >
                                <Settings className="w-5 h-5" />
                                Mon Compte
                            </Link>

                            <Link
                                href="/dashboard/live"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive('/dashboard/live') ? 'bg-gradient-to-r from-magic-gold/20 to-transparent text-magic-gold border-l-2 border-magic-gold' : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                            >
                                <Video className="w-5 h-5" />
                                Replays / Lives
                            </Link>

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
