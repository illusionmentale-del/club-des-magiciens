"use client";

import { useState } from "react";
import { Save, Trash2, Calendar, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateCourse, deleteCourse, createCourse } from "@/app/admin/actions";

interface CourseFormProps {
    course?: {
        id: string;
        title: string;
        description: string | null;
        image_url: string | null;
        audience: string;
        status: string;
        published_at: string | null;
    } | null;
    isEditing?: boolean;
}

export default function CourseForm({ course, isEditing = false }: CourseFormProps) {
    const router = useRouter();
    const [status, setStatus] = useState(course?.status || 'published');
    const [isDeleting, setIsDeleting] = useState(false);

    // Format date for datetime-local input
    const formatDate = (isoStr: string | null) => {
        if (!isoStr) return '';
        const date = new Date(isoStr);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible et supprimera également toutes les vidéos associées.")) {
            setIsDeleting(true);
            try {
                if (course?.id) await deleteCourse(course.id);
            } catch (error) {
                console.error("Failed to delete course", error);
                setIsDeleting(false);
            }
        }
    };

    // Client-side wrapper to pass ID for update
    const handleSubmit = async (formData: FormData) => {
        if (isEditing && course?.id) {
            await updateCourse(course.id, formData);
        } else {
            await createCourse(formData);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="bg-brand-card p-6 md:p-8 rounded-xl border border-brand-border space-y-6">

                {/* Basic Info Header */}
                <h2 className="text-xl font-bold text-brand-text mb-4">Informations Générales</h2>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-text-muted">Titre du cours</label>
                    <input
                        name="title"
                        required
                        defaultValue={course?.title || ""}
                        placeholder="Ex: Mentalisme Pro"
                        className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-text-muted">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        defaultValue={course?.description || ""}
                        placeholder="Une description accrocheuse..."
                        className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50"
                    ></textarea>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-text-muted mb-2 block">Audience Cible</label>
                    <div className="grid grid-cols-3 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="audience" value="adults" defaultChecked={course?.audience === 'adults' || !course} className="hidden peer" />
                            <div className="bg-brand-surface border border-brand-border rounded-lg p-4 text-center peer-checked:bg-brand-purple peer-checked:border-brand-purple peer-checked:text-white transition-all hover:bg-white/5">
                                <span className="block text-2xl mb-1">👨‍👩‍👧</span>
                                <span className="font-bold text-sm">Adultes</span>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="audience" value="kids" defaultChecked={course?.audience === 'kids'} className="hidden peer" />
                            <div className="bg-brand-surface border border-brand-border rounded-lg p-4 text-center peer-checked:bg-white peer-checked:text-purple-600 peer-checked:border-white transition-all hover:bg-white/5">
                                <span className="block text-2xl mb-1">👶</span>
                                <span className="font-bold text-sm">Kids</span>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="audience" value="all" defaultChecked={course?.audience === 'all'} className="hidden peer" />
                            <div className="bg-brand-surface border border-brand-border rounded-lg p-4 text-center peer-checked:bg-gradient-to-r peer-checked:from-brand-purple peer-checked:to-pink-500 peer-checked:text-white peer-checked:border-transparent transition-all hover:bg-white/5">
                                <span className="block text-2xl mb-1">🌍</span>
                                <span className="font-bold text-sm">Tous</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-text-muted">Image de couverture (URL)</label>
                    <input
                        name="imageUrl"
                        defaultValue={course?.image_url || ""}
                        placeholder="https://..."
                        className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50"
                    />
                </div>
            </div>

            {/* Publication Settings */}
            <div className="bg-brand-card p-6 md:p-8 rounded-xl border border-brand-border space-y-6">
                <h2 className="text-xl font-bold text-brand-text mb-4">Paramètres de Publication</h2>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-text-muted mb-2 block">Statut de Visibilité</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="status" value="published" checked={status === 'published'} onChange={(e) => setStatus(e.target.value)} className="hidden peer" />
                            <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex items-center gap-3 peer-checked:bg-green-500/20 peer-checked:border-green-500 peer-checked:text-green-400 text-brand-text-muted transition-all">
                                <Eye className="w-5 h-5 shrink-0" />
                                <span className="font-bold text-sm">Publié</span>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="status" value="draft" checked={status === 'draft'} onChange={(e) => setStatus(e.target.value)} className="hidden peer" />
                            <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex items-center gap-3 peer-checked:bg-amber-500/20 peer-checked:border-amber-500 peer-checked:text-amber-400 text-brand-text-muted transition-all">
                                <EyeOff className="w-5 h-5 shrink-0" />
                                <span className="font-bold text-sm">Brouillon</span>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="status" value="scheduled" checked={status === 'scheduled'} onChange={(e) => setStatus(e.target.value)} className="hidden peer" />
                            <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex items-center gap-3 peer-checked:bg-blue-500/20 peer-checked:border-blue-500 peer-checked:text-blue-400 text-brand-text-muted transition-all">
                                <Calendar className="w-5 h-5 shrink-0" />
                                <span className="font-bold text-sm">Planifié</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Conditional Publishing Date */}
                {status === 'scheduled' && (
                    <div className="space-y-2 pt-4 border-t border-brand-border/50 animate-in fade-in slide-in-from-top-4">
                        <label className="text-sm font-medium text-brand-text-muted">Date et heure de publication</label>
                        <input
                            type="datetime-local"
                            name="published_at"
                            required={status === 'scheduled'}
                            defaultValue={formatDate(course?.published_at || null)}
                            className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                        />
                        <p className="text-xs text-brand-text-muted italic">La formation apparaîtra automatiquement à cette date précise.</p>
                    </div>
                )}
            </div>

            {/* Actions Footer */}
            <div className={`pt-6 flex flex-col-reverse md:flex-row gap-4 items-center ${isEditing ? 'justify-between' : 'justify-end'}`}>
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full md:w-auto px-6 py-3 rounded-lg text-brand-error font-medium flex items-center justify-center gap-2 hover:bg-brand-error/10 transition-colors border border-transparent hover:border-brand-error/20 disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? 'Suppression...' : 'Supprimer la formation'}
                    </button>
                )}

                <button
                    type="submit"
                    className="w-full md:w-auto bg-brand-purple hover:bg-brand-purple/90 text-white font-medium px-10 py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-brand-purple/20"
                >
                    <Save className="w-5 h-5" />
                    {isEditing ? 'Sauvegarder les modifications' : 'Créer la formation'}
                </button>
            </div>
        </form>
    );
}
