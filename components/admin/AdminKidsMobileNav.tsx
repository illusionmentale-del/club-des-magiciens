"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Film, Lock, Calendar, MessageCircle, Users, Trophy, Settings, BookOpen, LogOut, Star, Sparkles } from "lucide-react";

export default function AdminKidsMobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;
    const close = () => setIsOpen(false);

    return (
        <div className="md:hidden bg-brand-bg/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-lg bg-brand-purple/20 text-brand-purple">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest">Club <span className="text-brand-purple">Kids</span></span>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 text-white bg-white/5 rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/95 transition-opacity" onClick={close} />
                    <div className="relative w-64 h-full bg-brand-card flex flex-col p-4 animate-in slide-in-from-left overflow-y-auto">
                        <div className="flex justify-end mb-4">
                            <button onClick={close} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg gap-2 flex items-center">
                                <span className="text-[10px] uppercase font-bold tracking-widest">Fermer</span>
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <nav className="space-y-1 flex-1">
                            <Link href="/admin/kids/dashboard" onClick={close} className={`flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-widest text-[10px] rounded-xl ${isActive('/admin/kids/dashboard') ? 'text-brand-purple bg-brand-purple/10' : 'text-gray-400 hover:bg-white/5'}`}>
                                <LayoutDashboard className="w-4 h-4" /> Tableau de bord
                            </Link>
                            
                            <div className="my-4 border-t border-white/5 px-4"><span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">Contenu</span></div>
                            <Link href="/admin/kids/library" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><Film className="w-4 h-4" /> Vidéos & Ateliers</Link>
                            <Link href="/admin/kids/settings/masterclass" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><Sparkles className="w-4 h-4" /> Page "Les Ateliers"</Link>
                            <Link href="/admin/kids/shop" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><Lock className="w-4 h-4" /> La Boutique</Link>
                            <Link href="/admin/kids/lives" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><Calendar className="w-4 h-4" /> Lives</Link>

                            <div className="my-4 border-t border-white/5 px-4"><span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Communauté</span></div>
                            <Link href="/admin/kids/inbox" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><MessageCircle className="w-4 h-4" /> Questions</Link>
                            <Link href="/admin/kids/vip-requests" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><Star className="w-4 h-4" /> Demandes VIP</Link>
                            <Link href="/admin/kids/users" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><Users className="w-4 h-4" /> Élèves</Link>

                            <div className="my-4 border-t border-white/5 px-4"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pilotes</span></div>
                            <Link href="/admin/kids/gamification" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><Trophy className="w-4 h-4" /> Gamification</Link>
                            <Link href="/admin/kids/settings" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><Settings className="w-4 h-4" /> Vitrine</Link>
                            <Link href="/admin/kids/legal" onClick={close} className="flex items-center gap-3 px-4 py-2 font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/5 rounded-xl"><BookOpen className="w-4 h-4" /> Textes Légaux</Link>
                        </nav>

                        <div className="pt-4 mt-4 border-t border-white/10">
                            <Link href="/admin" onClick={close} className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-brand-text-muted hover:text-white bg-white/5 rounded-xl"><LogOut className="w-4 h-4" /> Changer Univers</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
