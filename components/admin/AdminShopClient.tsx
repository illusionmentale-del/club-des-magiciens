"use client";

import { useState } from "react";
import { updateShopItem } from "@/app/admin/kids/shop/actions";
import { Edit2, Sparkles, AlertCircle, ShoppingBag, EyeOff, Save, X } from "lucide-react";

export default function AdminShopClient({ initialItems }: { initialItems: any[] }) {
    const [items, setItems] = useState(initialItems);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ sales_page_url: "", price_label: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setEditForm({
            sales_page_url: item.sales_page_url || "",
            price_label: item.price_label || ""
        });
        setError(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setError(null);
    };

    const handleSave = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await updateShopItem(id, editForm);

            // Update local state to reflect changes
            setItems(items.map(i => i.id === id ? {
                ...i,
                sales_page_url: editForm.sales_page_url || null,
                price_label: editForm.price_label || null
            } : i));

            setEditingId(null);
        } catch (err: any) {
            setError(err.message || "Failed to save");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="overflow-x-auto">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 mb-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-widest text-brand-text-muted">
                        <th className="p-4 font-bold">Vidéo / Formation</th>
                        <th className="p-4 font-bold">Lien Stripe (Payment Link)</th>
                        <th className="p-4 font-bold">Prix Affiché</th>
                        <th className="p-4 font-bold text-center">Statut boutique</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {items.map((item) => {
                        const isEditing = editingId === item.id;
                        const isPremium = !!item.sales_page_url;

                        return (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                {/* Title */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-black/50 rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center border border-white/10">
                                            {item.thumbnail_url ? (
                                                <img src={item.thumbnail_url} alt="" className="object-cover w-full h-full" />
                                            ) : (
                                                <Sparkles className="w-5 h-5 text-brand-text-muted" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-brand-text-muted">ID: {item.video_url || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* URL Input */}
                                <td className="p-4">
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={editForm.sales_page_url}
                                            onChange={(e) => setEditForm({ ...editForm, sales_page_url: e.target.value })}
                                            placeholder="https://buy.stripe.com/..."
                                            className="w-full bg-black/40 border border-brand-gold/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
                                        />
                                    ) : (
                                        <span className={`text-sm ${item.sales_page_url ? 'text-blue-400 hover:underline' : 'text-gray-500 italic'}`}>
                                            {item.sales_page_url ? (
                                                <a href={item.sales_page_url} target="_blank" rel="noopener noreferrer" className="line-clamp-1 max-w-[200px]" title={item.sales_page_url}>
                                                    {item.sales_page_url}
                                                </a>
                                            ) : (
                                                "Aucun lien"
                                            )}
                                        </span>
                                    )}
                                </td>

                                {/* Price Input */}
                                <td className="p-4">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.price_label}
                                            onChange={(e) => setEditForm({ ...editForm, price_label: e.target.value })}
                                            placeholder="ex: 47€"
                                            className="w-24 bg-black/40 border border-brand-gold/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold text-center"
                                        />
                                    ) : (
                                        <span className={`text-sm font-bold ${item.price_label ? 'text-brand-gold' : 'text-gray-500'}`}>
                                            {item.price_label || "-"}
                                        </span>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="p-4 text-center">
                                    {isPremium ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-xs font-bold">
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            En vente
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-full text-xs font-bold">
                                            <EyeOff className="w-3.5 h-3.5" />
                                            Gratuit
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={isLoading}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Annuler"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleSave(item.id)}
                                                    disabled={isLoading}
                                                    className="p-2 text-white bg-brand-gold hover:bg-yellow-500 rounded-lg shadow-lg shadow-brand-gold/20 transition-all"
                                                    title="Enregistrer"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-brand-text-muted hover:text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                title="Configurer le prix et le lien"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-brand-text-muted">
                                Aucune vidéo trouvée dans la section Kids.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
