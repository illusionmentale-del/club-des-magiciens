"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search, Newspaper, ChevronRight, Calendar } from "lucide-react";
import Image from "next/image";

import BroadcastModal from "@/components/admin/BroadcastModal";
import { Megaphone } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/admin/SortableItem';
import { updateLibraryItemsOrder } from '@/app/admin/actions';

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
    published_at?: string | null;
    position?: number;
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
            .eq("audience", "adults")
            .is("sales_page_url", null)
            .is("public_slug", null)
            .order("week_number", { ascending: true })
            .order("position", { ascending: true })
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

        Object.keys(groups).forEach(key => {
            groups[Number(key)].sort((a, b) => (a.position || 0) - (b.position || 0));
        });

        return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));
    }, [items, search]);

    const maxWeek = useMemo(() => {
        if (items.length === 0) return 0;
        return Math.max(...items.map(i => i.week_number || 0));
    }, [items]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent, currentItems: LibraryItem[]) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = currentItems.findIndex(i => i.id === active.id);
        const newIndex = currentItems.findIndex(i => i.id === over.id);

        const newItems = arrayMove(currentItems, oldIndex, newIndex);
        
        // Optimistic update
        setItems(prevItems => {
            const updated = [...prevItems];
            newItems.forEach((item, index) => {
                const globalIndex = updated.findIndex(i => i.id === item.id);
                if (globalIndex !== -1) updated[globalIndex].position = index;
            });
            return updated;
        });

        // Save to DB
        const payload = newItems.map((item, index) => ({ id: item.id, position: index }));
        const { error } = await updateLibraryItemsOrder(payload);
        if (error) {
            alert("Erreur de sauvegarde de l'ordre: " + error);
            fetchItems(); // revert
        }
    };

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <span className="text-brand-blue">📚</span> L'Atelier des Magiciens
                        </h1>
                        <p className="text-brand-text-muted">Gestion de la Bibliothèque Adulte</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsBroadcastOpen(true)}
                            className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 hover:text-white px-6 py-3 rounded-[16px] font-bold flex items-center gap-2 transition-all shadow-lg"
                        >
                            <Megaphone className="w-5 h-5" />
                            Alerte Nouveauté
                        </button>
                        <Link
                            href={`/admin/adults/library/new?audience=adults&week=${maxWeek + 1}`}
                            className="bg-brand-blue hover:bg-indigo-500 text-white px-6 py-3 rounded-[16px] font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                        >
                            <Calendar className="w-5 h-5" />
                            Nouvelle Semaine
                        </Link>
                    </div>
                </header>

                <BroadcastModal isOpen={isBroadcastOpen} onClose={() => setIsBroadcastOpen(false)} />

                {/* Search */}
                <div className="mb-8 bg-black/20 p-4 rounded-[24px] border border-white/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher un atelier..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-[16px] pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
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
                                        <span className="bg-brand-blue/20 text-brand-blue w-8 h-8 rounded-[12px] flex items-center justify-center text-sm border border-brand-blue/30">
                                            {week}
                                        </span>
                                        Catégorie {week === '0' ? 'Intro / Général' : week}
                                    </h2>
                                    <Link
                                        href={`/admin/adults/library/new?audience=adults&week=${week}`}
                                        className="text-xs font-bold text-gray-400 hover:text-brand-blue transition-colors flex items-center gap-1 uppercase tracking-wider"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Ajouter du contenu
                                    </Link>
                                </div>

                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, weekItems)}>
                                    <SortableContext items={weekItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                                        <div className="flex flex-col gap-3">
                                            {weekItems.map((item) => (
                                                <SortableItem key={item.id} id={item.id}>
                                                    <div className="bg-magic-card border border-white/5 rounded-[24px] p-3 flex items-center gap-4 hover:border-white/20 transition-colors group w-full">
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
                                                    <h3 className="font-bold text-sm text-white truncate group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-gray-400 uppercase tracking-widest bg-black/20">
                                                        {item.type}
                                                    </span>
                                                    {item.published_at && new Date(item.published_at) > new Date() && (
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded border border-yellow-500/30 text-yellow-500 uppercase tracking-widest bg-yellow-500/10 flex items-center gap-1">
                                                            <Calendar className="w-2.5 h-2.5" /> Programmée
                                                        </span>
                                                    )}
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

                                                <Link href={`/admin/adults/library/${item.id}`} className="p-1.5 bg-brand-blue/20 text-brand-blue rounded-lg hover:bg-brand-blue/30 transition-colors">
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
                                    </SortableItem>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                            </div>
                        ))}

                        {groupedItems.length === 0 && (
                            <div className="text-center py-20 text-gray-500 bg-white/5 rounded-[24px] border border-dashed border-white/10">
                                <Plus className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                                <p className="text-lg font-medium">Aucun contenu dans l'Atelier</p>
                                <p className="text-sm mt-1">Commencez par créer la première vidéo !</p>
                                <Link
                                    href="/admin/adults/library/new?audience=adults&week=1"
                                    className="inline-flex items-center gap-2 mt-6 bg-brand-blue hover:bg-indigo-500 text-white px-6 py-3 rounded-[16px] font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                                >
                                    <Plus className="w-5 h-5" />
                                    Ajouter une Vidéo
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
