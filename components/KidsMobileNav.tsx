"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, Settings, Video, LogOut, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function KidsMobileNav() {
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
        <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between p-4">
                <Link href="/kids">
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
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Overlay / Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={close}
                    />

                    {/* Menu Content */}
                    <div className="relative w-64 h-full bg-white border-r border-gray-200 flex flex-col p-4 animate-in slide-in-from-left duration-200 shadow-xl">
                        <div className="flex justify-end mb-4">
                            <button onClick={close} className="p-2 text-gray-500 hover:text-gray-900">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="space-y-2 flex-1">
                            <Link
                                href="/kids"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids') ? 'bg-magic-purple/10 text-magic-purple border border-magic-purple/20' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                <Star className="w-5 h-5" />
                                Le QG
                            </Link>

                            <Link
                                href="/kids/courses"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/courses') ? 'bg-magic-purple/10 text-magic-purple border border-magic-purple/20' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                <BookOpen className="w-5 h-5" />
                                Mes Formations
                            </Link>

                            <Link
                                href="/kids/account"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/account') ? 'bg-magic-purple/10 text-magic-purple border border-magic-purple/20' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                <Settings className="w-5 h-5" />
                                Mon Compte
                            </Link>

                            <Link
                                href="/kids/live"
                                onClick={close}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/kids/live') ? 'bg-magic-purple/10 text-magic-purple border border-magic-purple/20' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                <Video className="w-5 h-5" />
                                Live Magique <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">LIVE</span>
                            </Link>
                        </nav>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200 text-sm font-medium"
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
