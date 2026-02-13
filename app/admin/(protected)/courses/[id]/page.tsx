import { createClient } from "@/lib/supabase/server";
import { addVideo, deleteVideo } from "../../../actions";
import Link from "next/link";
import { ArrowLeft, Trash2, Video, Clock, Plus } from "lucide-react";
import { redirect, notFound } from "next/navigation";

// Client Component wrapper for delete button to handle binding
// Or we can just use a form with hidden input
// For simplicity in one file, we'll separate components if needed, 
// but here we can just map and use forms.

export default async function AdminCoursePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!course) notFound();

    const { data: videos } = await supabase
        .from("videos")
        .select("*")
        .eq("course_id", course.id)
        .order("position", { ascending: true });

    // Bind the actions
    const addVideoWithId = addVideo.bind(null, course.id);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <header className="flex flex-col gap-4 border-b border-white/10 pb-6">
                <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-2">
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux cours
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-serif text-white">{course.title}</h1>
                        <p className="text-gray-400 mt-1 max-w-2xl">{course.description}</p>
                    </div>
                    {/* Placeholder for Edit Course button if we make edit page
                    <Link href={`/admin/courses/${course.id}/edit`}>
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm">Modifier le cours</button>
                    </Link>
                    */}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Video List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-medium text-white flex items-center gap-2">
                        <Video className="w-5 h-5 text-magic-purple" />
                        Vidéos du module ({videos?.length || 0})
                    </h2>

                    <div className="space-y-3">
                        {videos?.map((video, index) => {
                            const deleteVideoWithId = deleteVideo.bind(null, course.id, video.id);
                            return (
                                <div key={video.id} className="flex items-center justify-between p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-medium text-gray-400">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">{video.title}</h3>
                                            <p className="text-xs text-gray-500 font-mono">ID: {video.video_url} • {Math.floor(video.duration / 60)} min</p>
                                        </div>
                                    </div>

                                    <form action={deleteVideoWithId}>
                                        <button className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Supprimer la vidéo">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            )
                        })}

                        {(!videos || videos.length === 0) && (
                            <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
                                <p className="text-gray-500">Aucune vidéo. Ajoutez la première ci-contre ! 👉</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Add Video Form */}
                <div className="bg-slate-900 border border-white/10 rounded-xl p-6 h-fit sticky top-6">
                    <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-400" />
                        Ajouter une vidéo
                    </h2>

                    <form action={addVideoWithId} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Titre de la vidéo</label>
                            <input name="title" required placeholder="Ex: Introduction à la magie" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-magic-purple/50 focus:ring-1 focus:ring-magic-purple/50" />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                            <textarea name="description" rows={3} placeholder="Petite explication du contenu..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-magic-purple/50 focus:ring-1 focus:ring-magic-purple/50"></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">ID Viméo / YouTube</label>
                                <input name="videoUrl" required placeholder="Ex: 84930210" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-magic-purple/50 focus:ring-1 focus:ring-magic-purple/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Durée (secondes)</label>
                                <input name="duration" type="number" placeholder="Ex: 300" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-magic-purple/50 focus:ring-1 focus:ring-magic-purple/50" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors mt-2">
                            Ajouter la vidéo
                        </button>

                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Pour Vimeo : l'ID est la fin de l'URL (vimeo.com/<strong>123456</strong>).
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
