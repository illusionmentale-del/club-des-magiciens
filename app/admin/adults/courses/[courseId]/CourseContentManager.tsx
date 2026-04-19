"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, GripVertical, Save, X, Play } from "lucide-react";
import { addVideoToCourse, updateVideoInCourse, deleteVideoFromCourse } from "./actions";

interface VideoItem {
    id: string;
    course_id: string;
    title: string;
    description: string;
    video_url: string;
    resource_url: string;
    position: number;
}

export default function CourseContentManager({ courseId, initialVideos }: { courseId: string, initialVideos: VideoItem[] }) {
    const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        video_url: "",
        description: "",
        resource_url: "",
        position: 0
    });

    const openAdd = () => {
        setFormData({ title: "", video_url: "", description: "", resource_url: "", position: videos.length });
        setIsAdding(true);
        setIsEditing(null);
    };

    const openEdit = (video: VideoItem) => {
        setFormData({ ...video });
        setIsEditing(video.id);
        setIsAdding(false);
    };

    const cancelEdit = () => {
        setIsAdding(false);
        setIsEditing(null);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.video_url) {
            alert("Le titre et l'URL vidéo sont requis.");
            return;
        }

        setLoading(true);
        try {
            if (isAdding) {
                await addVideoToCourse(courseId, formData);
            } else if (isEditing) {
                await updateVideoInCourse(isEditing, courseId, formData);
            }
            // Temporarily update local state until hard refresh
            window.location.reload(); 
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (videoId: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette vidéo de la formation ?")) return;
        setLoading(true);
        try {
            await deleteVideoFromCourse(videoId, courseId);
            setVideos(videos.filter(v => v.id !== videoId));
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                <h2 className="text-xl font-bold text-white uppercase tracking-widest text-sm">Programme Vidéo</h2>
                <Button onClick={openAdd} className="bg-brand-royal text-black hover:bg-brand-royal/80 font-bold" disabled={isAdding || isEditing !== null}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un chapitre
                </Button>
            </div>

            {/* List of Videos */}
            <div className="space-y-3">
                {videos.map((video) => (
                    <div key={video.id} className="bg-brand-card border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center hover:border-brand-royal/20 transition-colors">
                        
                        <div className="flex items-center justify-center cursor-move text-gray-500 opacity-50 hover:opacity-100">
                            <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="w-16 h-12 bg-black/50 rounded-lg flex items-center justify-center border border-white/10 shrink-0 text-brand-royal">
                            <Play className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate">{video.title}</h3>
                            <p className="text-[10px] text-gray-500 font-mono mt-1 w-full truncate">URL: {video.video_url}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
                            <button onClick={() => openEdit(video)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors" disabled={loading}>
                                <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(video.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors" disabled={loading}>
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {videos.length === 0 && !isAdding && (
                    <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p>Aucune vidéo dans cette formation.</p>
                    </div>
                )}
            </div>

            {/* Edit / Add Form */}
            {(isAdding || isEditing) && (
                <div className="bg-brand-bg border border-brand-royal/30 rounded-2xl p-6 space-y-4 shadow-2xl relative">
                    <button onClick={cancelEdit} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                    
                    <h3 className="text-lg font-bold text-brand-royal mb-4 border-b border-white/10 pb-2">
                        {isAdding ? "Nouveau Chapitre" : "Modifier le Chapitre"}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Titre du chapitre</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50"
                                placeholder="Ex: Les bases de la Cartomagie"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">ID Bunny ou Lien Externe (Vimeo/YT)</label>
                            <input
                                type="text"
                                value={formData.video_url}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50"
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Description (Optionnel)</label>
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white h-24 focus:outline-none focus:border-brand-royal/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Lien PDF (Ressource) - Optionnel</label>
                            <input
                                type="text"
                                value={formData.resource_url || ""}
                                onChange={(e) => setFormData({ ...formData, resource_url: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Position (Ordre)</label>
                            <input
                                type="number"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-4">
                        <Button variant="outline" onClick={cancelEdit} className="border-white/10 text-white hover:bg-white/5">
                            Annuler
                        </Button>
                        <Button onClick={handleSave} disabled={loading} className="bg-brand-royal text-black hover:bg-brand-royal/80 font-bold">
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? "Chargement..." : "Enregistrer"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
