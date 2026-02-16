"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    published_at?: string;
};

export default function LibraryItemForm({ initialData }: { initialData?: LibraryItem }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<LibraryItem>(initialData || {
        title: "",
        subtitle: "",
        description: "",
        video_url: "",
        thumbnail_url: "",
        resource_url: "",
        audience: "adults",
        type: "routine",
        week_number: 1,
        is_main: false,
        published_at: new Date().toISOString().split('T')[0]
    });

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

            const { error: uploadError } = await supabase.storage
                .from('avatars') // Using existing bucket for now, ideally 'library'
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, [field]: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
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
                // Clean up fields based on audience
                week_number: formData.audience === 'kids' ? Number(formData.week_number) : null,
                is_main: formData.audience === 'kids' ? formData.is_main : false,
                subtitle: formData.audience === 'adults' ? formData.subtitle : null,
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

            router.push("/admin/library");
            router.refresh();
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Erreur lors de la sauvegarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-32">
            {/* Header / Actions */}
            <div className="flex items-center justify-between sticky top-4 z-50 bg-brand-bg/95 backdrop-blur-md p-4 rounded-2xl border border-brand-border shadow-2xl">
                <Link href="/admin/library" className="flex items-center gap-2 text-brand-text-muted hover:text-brand-text transition-colors">
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
                                            <option value="activity">Activité Manuelle</option>
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
                    </div>

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
                                <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Date de Publication</label>
                                <input
                                    type="date"
                                    name="published_at"
                                    value={formData.published_at ? new Date(formData.published_at).toISOString().split('T')[0] : ""}
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
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">ID Vidéo (Vimeo/Mux)</label>
                            <input
                                type="text"
                                name="video_url"
                                value={formData.video_url || ""}
                                onChange={handleChange}
                                className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-brand-text focus:border-brand-blue font-mono text-sm"
                                placeholder="123456789"
                            />
                        </div>

                        <div>
                            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider mb-2">Image de couverture</label>
                            <div className="relative aspect-video bg-brand-bg border-2 border-dashed border-brand-border rounded-xl overflow-hidden group hover:border-brand-blue/50 transition-colors flex items-center justify-center">
                                {formData.thumbnail_url ? (
                                    <>
                                        <Image src={formData.thumbnail_url} alt="Cover" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-white mb-2" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-brand-text-muted">
                                        <Upload className="w-8 h-8" />
                                        <span className="text-xs uppercase font-bold tracking-widest">Uploader une image</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

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
