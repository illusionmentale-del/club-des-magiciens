"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Trophy, Loader2, Save } from "lucide-react";
import Image from "next/image";

type Badge = {
    id: string;
    name: string;
    description: string;
    image_url: string;
    condition_type: 'count' | 'specific_item' | 'manual';
    condition_value: string;
};

export default function AdminGamificationPage() {
    const supabase = createClient();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // New Badge State
    const [newBadge, setNewBadge] = useState<Partial<Badge>>({
        name: "",
        description: "",
        image_url: "",
        condition_type: "manual",
        condition_value: ""
    });

    const fetchBadges = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("badges").select("*").order("created_at", { ascending: false });
        if (error) console.error("Error fetching badges:", error);
        else setBadges(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchBadges();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce badge ?")) return;
        const { error } = await supabase.from("badges").delete().eq("id", id);
        if (error) alert("Erreur lors de la suppression");
        else fetchBadges();
    };

    const handleCreate = async () => {
        if (!newBadge.name) return alert("Nom requis");

        const { error } = await supabase.from("badges").insert([newBadge]);
        if (error) {
            console.error(error);
            alert("Erreur lors de la création");
        } else {
            setShowForm(false);
            setNewBadge({ name: "", description: "", image_url: "", condition_type: "manual", condition_value: "" });
            fetchBadges();
        }
    };

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <span className="text-yellow-400"><Trophy /></span> Gamification
                        </h1>
                        <p className="text-gray-400">Gestion des Badges et Récompenses</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau Badge
                    </button>
                </header>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-magic-card border border-purple-500/30 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-4">
                        <h2 className="font-bold text-lg mb-4 text-purple-300">Créer un Badge</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                placeholder="Nom du Badge (Ex: Premiers Pas)"
                                className="bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                                value={newBadge.name}
                                onChange={e => setNewBadge({ ...newBadge, name: e.target.value })}
                            />
                            <input
                                placeholder="URL Image (icône)"
                                className="bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                                value={newBadge.image_url}
                                onChange={e => setNewBadge({ ...newBadge, image_url: e.target.value })}
                            />
                            <div className="col-span-2">
                                <textarea
                                    placeholder="Description (Ex: Tu as validé ton premier tour !)"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                                    value={newBadge.description}
                                    onChange={e => setNewBadge({ ...newBadge, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Condition</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                                    value={newBadge.condition_type}
                                    onChange={e => setNewBadge({ ...newBadge, condition_type: e.target.value as any })}
                                >
                                    <option value="manual">Manuelle (Admin uniquement)</option>
                                    <option value="count">Nombre d'Ateliers (Compteur)</option>
                                    <option value="specific_item">Atelier Spécifique (ID)</option>
                                </select>
                            </div>
                            {newBadge.condition_type !== 'manual' && (
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Valeur (Nombre ou ID)</label>
                                    <input
                                        placeholder={newBadge.condition_type === 'count' ? "Ex: 5" : "Ex: UUID-DE-L-ATELIER"}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                                        value={newBadge.condition_value}
                                        onChange={e => setNewBadge({ ...newBadge, condition_value: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCreate}
                                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Enregistrer
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500 col-span-2">Chargement...</div>
                    ) : badges.map(badge => (
                        <div key={badge.id} className="bg-magic-card border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-colors">
                            <div className="w-16 h-16 bg-black/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                                {badge.image_url ? (
                                    <Image src={badge.image_url} alt={badge.name} fill className="object-contain p-2" />
                                ) : (
                                    <Trophy className="w-8 h-8 text-gray-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white">{badge.name}</h3>
                                <p className="text-xs text-gray-400 mb-1">{badge.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                        {badge.condition_type === 'manual' ? 'Manuel' :
                                            badge.condition_type === 'count' ? `Au bout de ${badge.condition_value} ateliers` :
                                                'Sur atelier spécifique'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(badge.id)}
                                className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {!loading && badges.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
                            Aucun badge configuré.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
