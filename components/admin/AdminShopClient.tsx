"use client";

import { useState } from "react";
import { updateShopItem } from "@/app/admin/kids/shop/actions";
import { Edit2, Sparkles, AlertCircle, ShoppingBag, EyeOff, Save, X, Zap } from "lucide-react";
import Link from "next/link";

export default function AdminShopClient({ initialItems }: { initialItems: any[] }) {
    const [items, setItems] = useState(initialItems);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ sales_page_url: "", price_label: "", public_slug: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setEditForm({
            sales_page_url: item.sales_page_url || "",
            price_label: item.price_label || "",
            public_slug: item.public_slug || ""
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
                price_label: editForm.price_label || null,
                public_slug: editForm.public_slug || null
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
                        <th className="p-4 font-bold">Vente Digitale (Stripe)</th>
                        <th className="p-4 font-bold">Tutoriel QR (Accès Offert)</th>
                        <th className="p-4 font-bold text-center">Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {items.map((item) => {
                        const isEditing = editingId === item.id;
                        const isPremium = !!item.sales_page_url;
                        const isPhysical = !!item.public_slug;

                        return (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                {/* Title */}
                                <td className="p-4 min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-black/50 rounded-[12px] overflow-hidden shrink-0 relative flex items-center justify-center border border-white/10">
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

                                {/* Digital Sales (Stripe + Price) */}
                                <td className="p-4">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <input
                                                type="url"
                                                value={editForm.sales_page_url}
                                                onChange={(e) => setEditForm({ ...editForm, sales_page_url: e.target.value })}
                                                placeholder="Lien Stripe (https://...)"
                                                className="w-full bg-black/40 border border-brand-purple/50 rounded-[16px] px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.price_label}
                                                onChange={(e) => setEditForm({ ...editForm, price_label: e.target.value })}
                                                placeholder="Prix (ex: 47€)"
                                                className="w-full bg-black/40 border border-brand-purple/50 rounded-[16px] px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-sm ${item.sales_page_url ? 'text-blue-400 hover:underline' : 'text-gray-500 italic'}`}>
                                                {item.sales_page_url ? (
                                                    <a href={item.sales_page_url} target="_blank" rel="noopener noreferrer" className="line-clamp-1 max-w-[200px]" title={item.sales_page_url}>
                                                        {item.sales_page_url}
                                                    </a>
                                                ) : (
                                                    "Aucun lien digital"
                                                )}
                                            </span>
                                            {item.price_label && <span className="text-xs font-bold text-brand-gold">{item.price_label}</span>}
                                        </div>
                                    )}
                                </td>

                                {/* Physical Sales (Public URL) */}
                                <td className="p-4">
                                    {isEditing ? (
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 pr-1">/tutoriel/</span>
                                            <input
                                                type="text"
                                                value={editForm.public_slug}
                                                onChange={(e) => setEditForm({ ...editForm, public_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') })}
                                                placeholder="nom-du-tour"
                                                className="w-full bg-black/40 border border-green-500/50 rounded-[16px] px-2 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
                                            />
                                        </div>
                                    ) : (
                                        item.public_slug ? (
                                            <a 
                                                href={`/tutoriel/${item.public_slug}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-green-400 font-medium hover:text-green-300 hover:underline transition-colors flex items-center gap-1"
                                                title="Ouvrir la page du tutoriel"
                                            >
                                                /tutoriel/{item.public_slug}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-500 italic">Pas de Page Publique</span>
                                        )
                                    )}
                                </td>

                                {/* Status */}
                                <td className="p-4 text-center">
                                    <div className="flex flex-col gap-2 items-center justify-center">
                                        {isPremium && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 rounded-full text-[10px] font-bold">
                                                <ShoppingBag className="w-3 h-3" />
                                                La Boutique
                                            </span>
                                        )}
                                        {isPhysical && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-bold">
                                                <Sparkles className="w-3 h-3" />
                                                QR Box
                                            </span>
                                        )}
                                        {!isPremium && !isPhysical && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-full text-[10px] font-bold">
                                                <EyeOff className="w-3 h-3" />
                                                Standard
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="p-4 text-right align-top">
                                    <div className="flex items-center justify-end gap-2 pt-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={isLoading}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-[12px] transition-colors"
                                                    title="Annuler"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleSave(item.id)}
                                                    disabled={isLoading}
                                                    className="p-2 text-white bg-brand-gold hover:bg-yellow-500 rounded-[12px] shadow-lg shadow-brand-gold/20 transition-all"
                                                    title="Enregistrer"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-brand-text-muted hover:text-brand-purple hover:bg-brand-purple/10 rounded-[12px] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    title="Configuration Rapide (Prix/Lien)"
                                                >
                                                    <Zap className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/admin/kids/shop/${item.id}`}
                                                    className="p-2 text-brand-text-muted hover:text-blue-400 hover:bg-blue-400/10 rounded-[12px] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    title="Modifier le Produit Complet"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                            </>
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
