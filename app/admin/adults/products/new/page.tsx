"use client";

import Link from "next/link";
import { ArrowLeft, Save, ShoppingBag, Info, AlertTriangle } from "lucide-react";
import { createProduct } from "../actions";
import { useSearchParams } from "next/navigation";
import { useAdmin } from "@/app/admin/AdminContext";

export default function NewProductPage() {
    const searchParams = useSearchParams();
    const { audience } = useAdmin(); // We can default space to this, but let user choose.

    // Default space from URL or Context
    const defaultSpace = searchParams.get('space') || audience || 'adults';

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8 font-sans">
            <header className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
                <Link href="/admin/adults/products" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Annuler
                </Link>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-magic-purple" />
                    Nouveau Produit
                </h1>
            </header>

            <div className="max-w-3xl mx-auto">
                <form action={createProduct} className="bg-magic-card border border-white/10 p-8 rounded-2xl shadow-2xl space-y-8">

                    {/* INFO BLOCK */}
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                        <div className="text-sm text-blue-100">
                            <strong>Important :</strong> Avant de créer le produit ici, assurez-vous de l'avoir créé dans votre Dashboard Stripe. Vous aurez besoin de l'ID du prix (commençant par <code>price_...</code>).
                        </div>
                    </div>

                    {/* BASIC INFO */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Informations Générales</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Titre du Produit</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    placeholder="Ex: Pack Mentalisme"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Prix (en €)</label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="Ex: 49.00"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-magic-purple outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="Description courte pour le catalogue..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-magic-purple outline-none"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Image de couverture (URL)</label>
                            <input
                                name="image_url"
                                type="url"
                                placeholder="https://..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-magic-purple outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Utilisez l'URL d'une image hébergée (Supabase Storage ou autre).</p>
                        </div>
                    </div>

                    {/* CONFIGURATION */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Configuration Technique</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Espace (Audience)</label>
                                <select
                                    name="space"
                                    defaultValue={defaultSpace}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-magic-purple outline-none"
                                >
                                    <option value="adults">Adulte</option>
                                    <option value="kids">Enfant (Kids)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Type de Produit</label>
                                <select
                                    name="type"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-magic-purple outline-none"
                                >
                                    <option value="pack">Pack / Formation (Achat unique)</option>
                                    <option value="subscription">Abonnement (Mensuel)</option>
                                    <option value="coaching">Coaching</option>
                                    <option value="course">Cours (Autre)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-yellow-500 mb-1 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                ID Stripe (Price ID)
                            </label>
                            <input
                                name="stripe_price_id"
                                type="text"
                                required
                                placeholder="price_..."
                                className="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 rounded-lg p-3 focus:border-yellow-500 outline-none font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-1">Trouvez cet ID dans la section "Produits" de votre dashboard Stripe. Il commence par <code>price_</code>.</p>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
                            <input
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                defaultChecked
                                className="w-5 h-5 text-magic-purple rounded border-gray-600 bg-black/40 focus:ring-magic-purple"
                            />
                            <label htmlFor="is_active" className="text-white font-medium select-none cursor-pointer">Activer le produit immédiatement</label>
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="pt-6 border-t border-white/10 flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1"
                        >
                            <Save className="w-5 h-5" />
                            Enregistrer le Produit
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
