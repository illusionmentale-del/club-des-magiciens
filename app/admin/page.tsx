"use client";

import Link from "next/link";
import { Users, Video, ShoppingBag, Settings, Instagram, FileText, Shield, BookOpen } from "lucide-react";
import { useAdmin } from "./AdminContext";

export default function AdminDashboard() {
    const { audience, setAudience } = useAdmin();

    const menuItems = [
        {
            title: "Formations & Cours",
            description: "Créer et modifier les cours.",
            icon: <BookOpen className="w-6 h-6" />,
            href: "/admin/courses",
            color: "text-green-400",
            bg: "bg-green-500/10",
            alwaysVisible: true
        },
        {
            title: "Membres",
            description: "Gérer les utilisateurs et rôles.",
            icon: <Users className="w-6 h-6" />,
            href: "/admin/users",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            alwaysVisible: true
        },
        {
            title: "Lives & Événements",
            description: "Programmer, lancer et gérer les lives.",
            icon: <Video className="w-6 h-6" />,
            href: "/admin/lives",
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            title: "Réglages Site",
            description: "Configurer l'accueil, les liens, etc.",
            icon: <Settings className="w-6 h-6" />,
            href: "/admin/settings",
            color: "text-gray-400",
            bg: "bg-gray-500/10"
        },
        {
            title: "Contenu (News)",
            description: "Publier des actualités.",
            icon: <FileText className="w-6 h-6" />,
            href: "/admin/news",
            color: "text-yellow-400",
            bg: "bg-yellow-500/10"
        },
        {
            title: "Paramètres QG",
            description: "Titres, Messages, Vidéo.",
            icon: <Shield className="w-6 h-6" />,
            href: "/admin/settings",
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            title: "Boutique",
            description: "Gérer les produits.",
            icon: <ShoppingBag className="w-6 h-6" />,
            href: "/admin/products",
            color: "text-orange-400",
            bg: "bg-orange-500/10"
        },
        {
            title: "Instagram",
            description: "Gérer le feed manuel.",
            icon: <Instagram className="w-6 h-6" />,
            href: "/admin/instagram",
            color: "text-pink-400",
            bg: "bg-pink-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif text-white mb-2">Administration Secrète</h1>
                            <p className="text-gray-400">Section réservée au Grand Maître.</p>
                        </div>
                    </div>

                    {/* GLOBAL CONTEXT SWITCH */}
                    <div className="bg-black/40 p-1.5 rounded-xl flex items-center gap-1 border border-white/10 backdrop-blur-md">
                        <button
                            onClick={() => setAudience('adults')}
                            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${audience === 'adults' ? 'bg-magic-purple text-white shadow-lg shadow-purple-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            👨‍👩‍👧 Espace Adulte
                        </button>
                        <button
                            onClick={() => setAudience('kids')}
                            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${audience === 'kids' ? 'bg-white text-purple-600 shadow-lg shadow-white/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            👶 Espace Kids
                        </button>
                    </div>
                </header>

                {/* Banner to show current context */}
                <div className={`mb-8 p-4 rounded-xl border ${audience === 'adults' ? 'bg-magic-purple/10 border-magic-purple/20' : 'bg-white/10 border-white/20'} flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${audience === 'adults' ? 'bg-magic-purple shadow-[0_0_10px_#8b5cf6]' : 'bg-white shadow-[0_0_10px_white]'}`} />
                        <span className="text-white font-medium">
                            Vous éditez actuellement l'univers : <span className={`font-bold uppercase ${audience === 'adults' ? 'text-magic-gold' : 'text-white'}`}>{audience === 'adults' ? 'Adulte' : 'Enfant'}</span>
                        </span>
                    </div>
                    <div className="text-xs text-white/50 bg-black/20 px-3 py-1 rounded-full">
                        Les changements s'appliquent uniquement à cet univers
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="group bg-magic-card border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all hover:border-white/10 hover:shadow-2xl hover:-translate-y-1 block relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} blur-2xl rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`}></div>

                            <div className="flex items-start justify-between mb-4 relative">
                                <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5`}>
                                    {item.icon}
                                </div>
                                {(audience === 'kids' && !item.alwaysVisible) && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-purple-600 px-2 py-1 rounded-full shadow-sm">
                                        Mode Kids
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-magic-gold transition-colors relative">{item.title}</h3>
                            <p className="text-gray-400 text-sm relative leading-relaxed">{item.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
