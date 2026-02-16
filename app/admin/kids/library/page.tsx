"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Filter, Eye, Star, Newspaper } from "lucide-react";
import Image from "next/image";

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
    const [filter, setFilter] = useState<'all' | 'kids' | 'adults'>('kids');
    const [search, setSearch] = useState("");

    const fetchItems = async () => {
        setLoading(true);
        let query = supabase
            .from("library_items")
            .select("*")
            .order("week_number", { ascending: true })
            .order("created_at", { ascending: false });

        if (filter !== 'all') {
            query = query.eq("audience", filter);
        }

        const { data, error } = await query;
        if (error) console.error("Error fetching items:", error);
        else setItems(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, [filter]);

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

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <span className="text-purple-400">📚</span> Le Club
                        </h1>
                        <p className="text-gray-400">Gestion des Ateliers et Contenus</p>
                    </div>
                    <Link
                        href="/admin/kids/library/new"
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-900/50"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau Contenu
                    </Link>
                </header>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher un titre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setFilter('kids')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filter === 'kids' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Kids
                        </button>
                        <button
                            onClick={() => setFilter('adults')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filter === 'adults' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Adultes
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Tout
                        </button>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Chargement...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="bg-magic-card border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 hover:border-white/20 transition-colors group">
                                {/* Thumbnail */}
                                <div className="w-full md:w-32 aspect-video bg-black/50 rounded-lg overflow-hidden relative shrink-0">
                                    {item.thumbnail_url ? (
                                        <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-600 text-xs">No Image</div>
                                    )}
                                    {item.is_main && (
                                        <div className="absolute top-1 left-1 bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded">STAR</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                                        <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${item.audience === 'kids' ? 'border-purple-500/30 text-purple-400' : 'border-blue-500/30 text-blue-400'}`}>
                                            {item.audience.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400 flex flex-wrap gap-4 justify-center md:justify-start">
                                        {item.audience === 'kids' && (
                                            <span className="flex items-center gap-1"><span className="text-gray-500">Semaine:</span> <span className="text-white font-mono">{item.week_number}</span></span>
                                        )}
                                        <span className="flex items-center gap-1"><span className="text-gray-500">Type:</span> <span className="text-white capitalize">{item.type}</span></span>
                                    </div>
                                </div>

                                {/* Actions / Flags */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleFlag(item.id, 'show_in_news', item.show_in_news)}
                                        className={`p-2 rounded-lg transition-colors border ${item.show_in_news ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-gray-600 hover:text-white'}`}
                                        title="Afficher dans les Nouveautés"
                                    >
                                        <Newspaper className="w-4 h-4" />
                                    </button>

                                    {/* Only pertinent for Kids mainly, or if we want manual highlight */}
                                    {/* <button
                                        onClick={() => toggleFlag(item.id, 'is_highlighted', item.is_highlighted)}
                                        className={`p-2 rounded-lg transition-colors border ${item.is_highlighted ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 'bg-white/5 border-white/10 text-gray-600 hover:text-white'}`}
                                        title="Mettre en avant"
                                    >
                                        <Star className="w-4 h-4" />
                                    </button> */}

                                    <div className="h-8 w-px bg-white/10 mx-2"></div>

                                    <Link href={`/admin/kids/library/${item.id}`} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredItems.length === 0 && (
                            <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                                Aucun contenu trouvé via les filtres actuels.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
