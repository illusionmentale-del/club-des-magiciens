"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import CoverImageUpload from "./CoverImageUpload";

type LibraryItem = {
    id?: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    video_url?: string | null;
    thumbnail_url?: string | null;
    resource_url?: string | null;
    audience: 'kids' | 'adults';
    type: string;
    week_number?: number | null;
    is_main?: boolean;
    show_in_news?: boolean;
    published_at?: string;
    sales_page_url?: string | null;
    price_label?: string | null;
    public_slug?: string | null;
    public_description?: string | null;
    tags?: string[];
};

export default function LibraryItemForm({ initialData }: { initialData?: LibraryItem }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isPremium, setIsPremium] = useState(!!initialData?.sales_page_url || !!initialData?.price_label);
    const [isPublic, setIsPublic] = useState(!!initialData?.public_slug);

    const initialWeek = searchParams.get('week');
    const initialAudience = searchParams.get('audience') as 'kids' | 'adults' || 'adults';

    const [formData, setFormData] = useState<LibraryItem>(initialData || {
        title: "",
        subtitle: "",
        description: "",
        video_url: "",
        thumbnail_url: "",
        resource_url: "",
        audience: initialAudience,
        type: initialAudience === 'kids' ? "trick" : "routine",
        week_number: initialWeek ? Number(initialWeek) : 1,
        is_main: false,
        show_in_news: false,
        published_at: new Date().toISOString().split('T')[0],
        sales_page_url: "",
        price_label: "",
        public_slug: "",
        public_description: "",
        tags: []
    });

    const [tagInput, setTagInput] = useState("");

    const suggestedKidsTags = ["Cartes", "Pièces", "Mentalisme", "Foulard", "Élastiques", "Objets du quotidien", "Conseil", "Astuce", "Fabrication", "Défi", "Manipulation", "Comédie", "Facile"];
    const suggestedAdultsTags = ["Close-up", "Scène", "Impromptu", "Cartomagie", "Numismagie", "Gimmick", "Mentalisme", "Psychologie", "Technique", "Théorie", "Business", "Marketing", "Astuce"];
    
    const suggestedTags = formData.audience === 'kids' ? suggestedKidsTags : suggestedAdultsTags;

    const addTag = (tag: string) => {
        const t = tag.trim();
        if (!t) return;
        if (!formData.tags?.includes(t)) {
            setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), t] }));
        }
        setTagInput("");
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tagToRemove) }));
    };

    useEffect(() => {
        if (!initialData) {
            if (initialWeek) setFormData(prev => ({ ...prev, week_number: Number(initialWeek) }));
            if (initialAudience) setFormData(prev => ({ ...prev, audience: initialAudience }));
        }
    }, [initialWeek, initialAudience, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail_url' | 'resource_url') => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `library/${fileName}`;

            const bucketName = field === 'thumbnail_url' ? 'avatars' : 'library';

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
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
            const payload = {
                ...formData,
                tags: formData.tags || [],
                // Clean up fields based on audience
                week_number: formData.audience === 'kids' ? Number(formData.week_number) : null,
                is_main: formData.audience === 'kids' ? formData.is_main : false,
                subtitle: formData.audience === 'adults' ? formData.subtitle : null,
                sales_page_url: (isPremium && formData.sales_page_url?.trim()) ? formData.sales_page_url.trim() : null,
                price_label: (isPremium && formData.price_label?.trim()) ? formData.price_label.trim() : null,
                public_slug: (isPublic && formData.public_slug?.trim()) ? formData.public_slug.trim() : null,
                public_description: (isPublic && formData.public_description?.trim()) ? formData.public_description.trim() : null,
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

            router.push(formData.audience === 'kids' ? "/admin/kids/library" : "/admin/adults/library");
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
                <Link href={formData.audience === 'kids' ? "/admin/kids/library" : "/admin/adults/library"} className="flex items-center gap-2 text-brand-text-muted hover:text-brand-text transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider text-xs">Retour</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Enregistrer
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Core Info */}
                <div className="space-y-6">
                    <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-6">
                        <h2 className="text-xl font-bold text-brand-text uppercase tracking-tight border-b border-brand-border pb-4">Informations Générales</h2>

                        <div>
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Titre du contenu</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-brand-text-muted/20"
                                placeholder="Ex: La Coupe du Roi"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Audience</label>
                                <select
                                    name="audience"
                                    value={formData.audience}
                                    onChange={handleChange}
                                    className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-blue outline-none appearance-none"
                                >
                                    <option value="adults">Adultes</option>
                                    <option value="kids">Kids</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-blue outline-none appearance-none"
                                >
                                    {formData.audience === 'kids' ? (
                                        <>
                                            <option value="trick">Tour de Magie</option>
                                            <option value="atelier">Atelier Magique</option>
                                            <option value="activity">Activité Manuelle</option>
                                            <option value="tips">Conseils & Astuces</option>
                                            <option value="illusion">Illusion d'Optique</option>
                                            <option value="game">Jeu</option>
                                            <option value="pdf">PDF / Document</option>
                                            <option value="challenge">Défi</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="routine">Routine</option>
                                            <option value="theory">Théorie</option>
                                            <option value="business">Business</option>
                                            <option value="theme">Thématique</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description || ""}
                                onChange={handleChange}
                                rows={5}
                                className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-blue outline-none transition-all placeholder:text-brand-text-muted/20 resize-none"
                                placeholder="Description détaillée du contenu..."
                            />
                        </div>

                        {/* TAGS SECTION */}
                        <div className="border-t border-brand-border pt-6">
                            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider mb-4">Tags & Mots-Clés</h3>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(formData.tags || []).map(tag => (
                                    <span key={tag} className="bg-brand-blue/20 text-brand-blue px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">&times;</button>
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTag(tagInput);
                                        }
                                    }}
                                    className="flex-1 bg-brand-bg border border-brand-border rounded-xl p-3 text-brand-text text-sm focus:border-brand-blue outline-none placeholder:text-brand-text-muted/30"
                                    placeholder="Écris un tag et tape Entrée..."
                                />
                                <button
                                    type="button"
                                    onClick={() => addTag(tagInput)}
                                    className="bg-brand-surface hover:bg-white/10 px-4 py-3 rounded-xl border border-brand-border text-sm font-bold transition-colors"
                                >
                                    Ajouter
                                </button>
                            </div>

                            <p className="text-[10px] text-brand-text-muted uppercase font-bold tracking-widest mb-2">Suggestions rapides :</p>
                            <div className="flex flex-wrap gap-1.5">
                                {suggestedTags.map(tag => (
                                    <button 
                                        key={tag}
                                        type="button"
                                        onClick={() => addTag(tag)}
                                        className="text-[10px] bg-brand-bg/50 hover:bg-brand-surface border border-brand-border px-2 py-1 rounded transition-colors"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Vente / Boutique (Masqué pour Kids, géré dans ShopItemForm) */}
                    {formData.audience === 'adults' && (
                        <>
                            <div className={`bg-brand-card border border-brand-border p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${isPremium ? 'space-y-6' : ''}`}>
                                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-purple/10 rounded-bl-full pointer-events-none"></div>

                                <div className={`flex items-center justify-between ${isPremium ? 'border-b border-brand-border pb-4' : ''}`}>
                                    <h2 className="text-xl font-bold text-brand-purple uppercase tracking-tight">Boutique & Vente</h2>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${isPremium ? 'text-brand-purple' : 'text-brand-text-muted'}`}>Contenu Premium</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isPremium}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setIsPremium(checked);
                                                    if (!checked) {
                                                        setFormData(prev => ({ ...prev, sales_page_url: "", price_label: "" }));
                                                    }
                                                }}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-brand-bg rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-text-muted peer-checked:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple border border-brand-border"></div>
                                        </label>
                                    </div>
                                </div>

                                {isPremium && (
                                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div>
                                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">URL de la Page de Vente (Lien Stripe)</label>
                                            <input
                                                type="url"
                                                name="sales_page_url"
                                                value={formData.sales_page_url || ""}
                                                onChange={handleChange}
                                                className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-purple outline-none transition-all placeholder:text-brand-text-muted/20"
                                                placeholder="https://buy.stripe.com/live_..."
                                            />
                                            <p className="text-[10px] text-brand-text-muted mt-2">Si rempli, ce contenu apparaîtra dans la Boutique (payant).</p>
                                        </div>
                                        <div>
                                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Label du Prix</label>
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

                            {/* Landing Page (Public QR Code) */}
                            <div className={`bg-brand-card border border-brand-border p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${isPublic ? 'space-y-6' : ''}`}>
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full pointer-events-none"></div>

                                <div className={`flex items-center justify-between ${isPublic ? 'border-b border-brand-border pb-4' : ''}`}>
                                    <h2 className="text-xl font-bold text-green-500 uppercase tracking-tight">Vente Physique (QR Code)</h2>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${isPublic ? 'text-green-500' : 'text-brand-text-muted'}`}>Landing Page</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isPublic}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setIsPublic(checked);
                                                    if (!checked) {
                                                        setFormData(prev => ({ ...prev, public_slug: "", public_description: "" }));
                                                    }
                                                }}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-brand-bg rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-text-muted peer-checked:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 border border-brand-border"></div>
                                        </label>
                                    </div>
                                </div>

                                {isPublic && (
                                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div>
                                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">URL Publique (Slug)</label>
                                            <div className="flex items-center bg-brand-bg border border-brand-border rounded-xl overflow-hidden focus-within:border-green-500 transition-colors">
                                                <span className="pl-4 text-brand-text-muted select-none text-sm border-r border-brand-border pr-3 bg-black/20 py-4 h-full">/tutoriel/</span>
                                                <input
                                                    type="text"
                                                    name="public_slug"
                                                    value={formData.public_slug || ""}
                                                    onChange={(e) => {
                                                        const formatted = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
                                                        setFormData(prev => ({ ...prev, public_slug: formatted }));
                                                    }}
                                                    className="w-full bg-transparent p-4 text-brand-text outline-none"
                                                    placeholder="foulard-magique"
                                                />
                                            </div>
                                            <p className="text-[10px] text-brand-text-muted mt-2">C'est ce lien qu'il faudra insérer dans le QR Code de la boîte.</p>
                                        </div>
                                        <div>
                                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Message Personnalisé (Optionnel)</label>
                                            <textarea
                                                name="public_description"
                                                value={formData.public_description || ""}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-green-500 outline-none transition-all placeholder:text-brand-text-muted/20 resize-none"
                                                placeholder="Ex: Merci d'avoir acheté ce tour lors d'un de mes spectacles ! Voici l'explication..."
                                            />
                                            <p className="text-[10px] text-brand-text-muted mt-2">S'affichera sous la vidéo. Laisse vide pour ne rien afficher.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Specific Fields based on Audience */}
                    {formData.audience === 'kids' ? (
                        <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-cyan/10 rounded-bl-full pointer-events-none"></div>
                            <h2 className="text-xl font-bold text-brand-cyan uppercase tracking-tight border-b border-brand-border pb-4">Configuration Kids</h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Numéro de Semaine</label>
                                    <input
                                        type="number"
                                        name="week_number"
                                        value={formData.week_number || ""}
                                        onChange={handleChange}
                                        min={1}
                                        className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-cyan outline-none"
                                    />
                                    <p className="text-[10px] text-brand-text-muted mt-2">Ce contenu se débloquera à la semaine X de l'abonnement.</p>
                                </div>
                                <div>
                                    <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Date de Publication (Automatique)</label>
                                    <input
                                        type="datetime-local"
                                        name="published_at"
                                        value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ""}
                                        onChange={handleChange}
                                        className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-cyan outline-none"
                                    />
                                    <p className="text-[10px] text-brand-text-muted mt-2">Le contenu apparaîtra à cette date exacte et un email sera envoyé.</p>
                                </div>
                                <div className="flex items-center gap-4 pt-8">
                                    <input
                                        type="checkbox"
                                        name="is_main"
                                        checked={formData.is_main || false}
                                        onChange={handleCheckboxChange}
                                        className="w-6 h-6 rounded border-brand-border bg-brand-bg text-brand-cyan focus:ring-brand-cyan"
                                        id="is_main"
                                    />
                                    <label htmlFor="is_main" className="text-brand-text text-sm font-bold uppercase tracking-wide cursor-pointer select-none">Contenu Principal</label>
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <input
                                        type="checkbox"
                                        name="show_in_news"
                                        checked={formData.show_in_news || false}
                                        onChange={handleCheckboxChange}
                                        className="w-6 h-6 rounded border-brand-border bg-brand-bg text-brand-cyan focus:ring-brand-cyan"
                                        id="show_in_news"
                                    />
                                    <label htmlFor="show_in_news" className="text-brand-text text-sm font-bold uppercase tracking-wide cursor-pointer select-none">Afficher dans Nouveautés</label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold/10 rounded-bl-full pointer-events-none"></div>
                            <h2 className="text-xl font-bold text-brand-gold uppercase tracking-tight border-b border-brand-border pb-4">Configuration Adultes</h2>

                            <div>
                                <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Sous-titre Stratégique</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle || ""}
                                    onChange={handleChange}
                                    className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-gold outline-none"
                                    placeholder="Ex: Boostez vos pourboires de 30%"
                                />
                            </div>

                            <div>
                                <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Date de Publication (Optionnel)</label>
                                <input
                                    type="datetime-local"
                                    name="published_at"
                                    value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ""}
                                    onChange={handleChange}
                                    className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-gold outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Media */}
                <div className="space-y-6">
                    <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-6">
                        <h2 className="text-xl font-bold text-brand-text uppercase tracking-tight border-b border-brand-border pb-4">Médias</h2>

                        <div>
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">
                                ID VIDÉO {['pdf', 'image', 'tips'].includes(formData.type) ? '(Optionnel)' : ''}
                            </label>
                            <input
                                type="text"
                                name="video_url"
                                value={formData.video_url || ""}
                                onChange={handleChange}
                                className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-blue font-mono text-sm"
                                placeholder="123456789 ou GUID Bunny"
                            />
                        </div>

                        <CoverImageUpload
                            currentImageUrl={formData.thumbnail_url}
                            onUpload={(url) => setFormData(prev => ({ ...prev, thumbnail_url: url }))}
                            label="Image de couverture"
                        />

                        <div>
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Ressource Associée (PDF)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    name="resource_url"
                                    readOnly
                                    value={formData.resource_url || ""}
                                    className="flex-1 bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text-muted font-mono text-xs"
                                    placeholder="URL du fichier..."
                                />
                                <div className="relative">
                                    <button type="button" className="bg-brand-surface hover:bg-white/10 text-brand-text px-4 py-4 rounded-xl border border-brand-border transition-colors">
                                        <Upload className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileUpload(e, 'resource_url')} // Handle generic file upload logic
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
