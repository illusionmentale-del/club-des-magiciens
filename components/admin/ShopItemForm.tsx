"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type ShopItem = {
    id?: string;
    title: string;
    description?: string | null;
    video_url?: string | null;
    thumbnail_url?: string | null;
    sales_page_url?: string | null;
    price_label?: string | null;
    public_slug?: string | null;
    public_description?: string | null;
};

export default function ShopItemForm({ initialData }: { initialData?: ShopItem }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<ShopItem>(initialData || {
        title: "",
        description: "",
        video_url: "",
        thumbnail_url: "",
        sales_page_url: "",
        price_label: "",
        public_slug: "",
        public_description: ""
    });

    const [isPremium, setIsPremium] = useState(!!initialData?.sales_page_url || !!initialData?.price_label);
    const [isPublic, setIsPublic] = useState(!!initialData?.public_slug);

    useEffect(() => {
        if (initialData) {
            setIsPremium(!!initialData.sales_page_url || !!initialData.price_label);
            setIsPublic(!!initialData.public_slug);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail_url') => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `library/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, [field]: publicUrl }));
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Automatically set fields needed for correct database functioning but hidden from UX
            const payload = {
                ...formData,
                audience: 'kids',
                type: 'trick',
                is_main: false,
                show_in_news: false,
                week_number: null,
                // cleanup fields
                sales_page_url: isPremium ? formData.sales_page_url : null,
                price_label: isPremium ? formData.price_label : null,
                public_slug: isPublic ? formData.public_slug : null,
                public_description: isPublic ? formData.public_description : null,
            };

            if (initialData?.id) {
                const { error } = await supabase
                    .from("library_items")
                    .update(payload)
                    .eq("id", initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("library_items")
                    .insert([payload]);
                if (error) throw error;
            }

            router.push("/admin/kids/shop");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving item:", error);
            alert("Erreur lors de la sauvegarde : " + (error?.message || "Erreur inconnue"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-32">
            {/* Header / Actions */}
            <div className="flex items-center justify-between sticky top-4 z-50 bg-brand-bg/95 backdrop-blur-md p-4 rounded-2xl border border-brand-border shadow-2xl">
                <Link href="/admin/kids/shop" className="flex items-center gap-2 text-brand-text-muted hover:text-brand-text transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider text-xs">Retour Boutiques</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-brand-purple hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Enregistrer Produit
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Core Info */}
                <div className="space-y-6">
                    <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-6">
                        <h2 className="text-xl font-bold text-brand-text uppercase tracking-tight border-b border-brand-border pb-4">Informations du Produit</h2>

                        <div>
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Titre du produit / Tour</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder:text-brand-text-muted/20"
                                placeholder="Ex: La Coupe du Roi"
                            />
                        </div>

                        <div>
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Description / Argumentaire</label>
                            <textarea
                                name="description"
                                value={formData.description || ""}
                                onChange={handleChange}
                                rows={5}
                                className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-purple outline-none transition-all placeholder:text-brand-text-muted/20 resize-none"
                                placeholder="Description qui s'affichera sous la vidéo..."
                            />
                        </div>
                    </div>

                    <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-6">
                        <h2 className="text-xl font-bold text-brand-text uppercase tracking-tight border-b border-brand-border pb-4">Média Produit</h2>
                        
                        <div>
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">ID Vidéo Bunny.net (Explication)</label>
                            <input
                                type="text"
                                name="video_url"
                                value={formData.video_url || ""}
                                onChange={handleChange}
                                className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-purple outline-none font-mono"
                                placeholder="ex: a1b2c3d4-e5f6-g7h8..."
                            />
                            <p className="text-[10px] text-brand-text-muted mt-2">N'upload pas cette vidéo dans la collection "Replays" de Bunny ! Crée un dossier "Boutique".</p>
                        </div>

                        <div>
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Image Miniature</label>
                            <div className="flex items-start gap-4">
                                {formData.thumbnail_url && (
                                    <div className="relative w-32 aspect-video bg-black rounded-lg overflow-hidden shrink-0 border border-brand-border">
                                        <img src={formData.thumbnail_url} alt="Thumbnail preview" className="object-cover w-full h-full" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
                                        className="hidden"
                                        id="thumbnail-upload"
                                    />
                                    <label
                                        htmlFor="thumbnail-upload"
                                        className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-brand-border bg-brand-bg hover:bg-white/5 hover:border-brand-purple text-brand-text-muted rounded-xl p-4 cursor-pointer transition-all h-full min-h-[72px]"
                                    >
                                        <span className="text-xs uppercase tracking-wider font-bold">Changer l'image</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Ventes */}
                <div className="space-y-6">
                    {/* Vente Digitale */}
                    <div className={`bg-brand-card border ${isPremium ? 'border-brand-purple shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'border-brand-border opacity-60'} p-6 rounded-2xl relative overflow-hidden transition-all duration-300`}>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-purple/10 rounded-bl-full pointer-events-none"></div>

                        <div className={`flex items-center justify-between ${isPremium ? 'border-b border-brand-border pb-4 mb-4' : ''}`}>
                            <h2 className="text-xl font-bold flex items-center gap-2 text-brand-purple uppercase tracking-tight">
                                <ShoppingBag className="w-5 h-5" />
                                Boutique Digitale
                            </h2>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPremium}
                                    onChange={(e) => setIsPremium(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-brand-bg rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-text-muted peer-checked:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple border border-brand-border"></div>
                            </label>
                        </div>

                        {isPremium && (
                            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div>
                                    <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">URL de Paiement Stripe (Payment Link)</label>
                                    <input
                                        type="url"
                                        name="sales_page_url"
                                        value={formData.sales_page_url || ""}
                                        onChange={handleChange}
                                        className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-purple outline-none transition-all placeholder:text-brand-text-muted/20"
                                        placeholder="https://buy.stripe.com/live_..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Prix Affiché en vitrine</label>
                                    <input
                                        type="text"
                                        name="price_label"
                                        value={formData.price_label || ""}
                                        onChange={handleChange}
                                        className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-purple outline-none transition-all placeholder:text-brand-text-muted/20"
                                        placeholder="Ex: 49,00 €"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vente Physique */}
                    <div className={`bg-brand-card border ${isPublic ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-brand-border opacity-60'} p-6 rounded-2xl relative overflow-hidden transition-all duration-300`}>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full pointer-events-none"></div>

                        <div className={`flex items-center justify-between ${isPublic ? 'border-b border-brand-border pb-4 mb-4' : ''}`}>
                            <h2 className="text-xl font-bold flex items-center gap-2 text-green-500 uppercase tracking-tight">
                                <Sparkles className="w-5 h-5" />
                                Boîte Physique (QR)
                            </h2>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-brand-bg rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-text-muted peer-checked:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 border border-brand-border"></div>
                            </label>
                        </div>

                        {isPublic && (
                            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div>
                                    <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Mot de l'URL (Slug du QR Code)</label>
                                    <div className="flex items-center bg-brand-bg border border-brand-border rounded-xl overflow-hidden focus-within:border-green-500 transition-colors">
                                        <span className="pl-4 text-brand-text-muted select-none text-sm border-r border-brand-border pr-3 bg-black/20 py-4 h-full">.../tutoriel/</span>
                                        <input
                                            type="text"
                                            name="public_slug"
                                            value={formData.public_slug || ""}
                                            onChange={(e) => {
                                                const formatted = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
                                                setFormData(prev => ({ ...prev, public_slug: formatted }));
                                            }}
                                            className="w-full bg-transparent p-4 text-brand-text outline-none"
                                            placeholder="gobelets-magiques"
                                        />
                                    </div>
                                    <p className="text-[10px] text-brand-text-muted mt-2">C'est ce qui définit le lien final du QR code de ton produit physique.</p>
                                </div>
                                <div>
                                    <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Message de félicitation (Optionnel)</label>
                                    <textarea
                                        name="public_description"
                                        value={formData.public_description || ""}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-green-500 outline-none transition-all placeholder:text-brand-text-muted/20 resize-none"
                                        placeholder="Ex: Merci d'avoir acheté cette boîte à la fin de mon spectacle !"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
