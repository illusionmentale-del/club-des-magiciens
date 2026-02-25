"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search, Newspaper, ChevronRight, Calendar } from "lucide-react";
import Image from "next/image";

import BroadcastModal from "@/components/admin/BroadcastModal";
import { Megaphone } from "lucide-react";

type LibraryItem = {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    week_number: number;
    audience: 'kids' | 'adults';
    type: string;
    is_main: boolean;
    show_in_news: boolean;
    is_highlighted: boolean;
};

export default function AdminLibraryPage() {
    const supabase = createClient();
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("library_items")
            .select("*")
            .eq("audience", "kids")
            .order("week_number", { ascending: true })
            .order("created_at", { ascending: false });

        if (error) console.error("Error fetching items:", error);
        else setItems(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cet atelier ?")) return;
        const { error } = await supabase.from("library_items").delete().eq("id", id);
        if (error) alert("Erreur lors de la suppression");
        else fetchItems();
    };

    const toggleFlag = async (id: string, field: 'show_in_news' | 'is_highlighted', currentValue: boolean) => {
        const { error } = await supabase.from("library_items").update({ [field]: !currentValue }).eq("id", id);
        if (error) alert("Erreur lors de la mise à jour");
        else fetchItems();
    };

    const groupedItems = useMemo(() => {
        const filtered = items.filter(item =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );

        const groups: Record<number, LibraryItem[]> = {};
        filtered.forEach(item => {
            const week = item.week_number || 0;
            if (!groups[week]) groups[week] = [];
            groups[week].push(item);
        });

        return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));
    }, [items, search]);

    const maxWeek = useMemo(() => {
        if (items.length === 0) return 0;
        return Math.max(...items.map(i => i.week_number || 0));
    }, [items]);

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <span className="text-purple-400">📚</span> Le Club Kids
                        </h1>
                        <p className="text-gray-400">Gestion du programme hebdomadaire</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsBroadcastOpen(true)}
                            className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 hover:text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                        >
                            <Megaphone className="w-5 h-5" />
                            Alerte Nouveauté
                        </button>
                        <Link
                            href={`/admin/kids/library/new?audience=kids&week=${maxWeek + 1}`}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/50"
                        >
                            <Calendar className="w-5 h-5" />
                            Nouvelle Semaine
                        </Link>
                    </div>
                </header>

                <BroadcastModal isOpen={isBroadcastOpen} onClose={() => setIsBroadcastOpen(false)} />

                {/* Search */}
                <div className="mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher un atelier..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                {/* List grouped by week */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Chargement des semaines...</div>
                ) : (
                    <div className="space-y-12">
                        {groupedItems.map(([week, weekItems]) => (
                            <div key={week} className="space-y-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                        <span className="bg-purple-600/20 text-purple-400 w-8 h-8 rounded-lg flex items-center justify-center text-sm border border-purple-500/30">
                                            {week}
                                        </span>
                                        Semaine {week === '0' ? 'Intro / Général' : week}
                                    </h2>
                                    <Link
                                        href={`/admin/kids/library/new?audience=kids&week=${week}`}
                                        className="text-xs font-bold text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1 uppercase tracking-wider"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Ajouter du contenu
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {weekItems.map((item) => (
                                        <div key={item.id} className="bg-magic-card border border-white/5 rounded-xl p-3 flex items-center gap-4 hover:border-white/20 transition-colors group">
                                            {/* Thumbnail */}
                                            <div className="w-24 aspect-video bg-black/50 rounded-lg overflow-hidden relative shrink-0 border border-white/5">
                                                {item.thumbnail_url ? (
                                                    <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-600 text-[10px]">No Image</div>
                                                )}
                                                {item.is_main && (
                                                    <div className="absolute top-1 left-1 bg-yellow-500 text-black text-[8px] font-bold px-1 rounded">STAR</div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="font-bold text-sm text-white truncate group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-gray-400 uppercase tracking-widest bg-black/20">
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">{item.description || "Aucune description"}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => toggleFlag(item.id, 'show_in_news', item.show_in_news)}
                                                    className={`p-1.5 rounded-lg transition-colors border ${item.show_in_news ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                                                    title="Afficher dans les Nouveautés"
                                                >
                                                    <Newspaper className="w-3.5 h-3.5" />
                                                </button>

                                                <div className="h-6 w-px bg-white/10 mx-1"></div>

                                                <Link href={`/admin/kids/library/${item.id}`} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                                                    <Edit className="w-3.5 h-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {groupedItems.length === 0 && (
                            <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <Plus className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                                <p className="text-lg font-medium">Aucun contenu dans le Club Kids</p>
                                <p className="text-sm mt-1">Commencez par créer la première semaine !</p>
                                <Link
                                    href="/admin/kids/library/new?audience=kids&week=1"
                                    className="inline-flex items-center gap-2 mt-6 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-bold transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    Ajouter un Atelier
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
