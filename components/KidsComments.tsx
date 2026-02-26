"use client";

import { Send, Sparkles, File, CheckCircle, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { addKidsComment, deleteKidsComment } from "@/app/kids/videos/[videoId]/actions";
import { usePathname } from "next/navigation";

export default function KidsCommentsSection({ videoId, comments, isAdmin }: { videoId: string, comments: any[], isAdmin: boolean }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [localComments, setLocalComments] = useState(comments);
    const pathname = usePathname();

    const handleCommentSubmit = async (formData: FormData) => {
        setIsSuccess(false);
        await addKidsComment(videoId, formData.get("content") as string, pathname);
        formRef.current?.reset();
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Es-tu sûr de vouloir supprimer définitivement ce message (et sa réponse) ?")) return;

        setDeletingId(commentId);
        try {
            await deleteKidsComment(commentId, pathname);
            // Optimistically update the UI to remove the deleted comment
            setLocalComments(prev => prev.filter(c => c.id !== commentId));
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8 bg-magic-card border border-white/5 p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] mt-12">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                    <Sparkles className="w-6 h-6 text-magic-gold" />
                    Questions au Magicien ({comments.length})
                </h3>
                <p className="text-gray-400 text-sm">
                    Pose ta question en dessous ! Le chat est <strong>privé</strong>, les autres petits magiciens ne verront jamais ton nom.
                </p>
            </div>

            {/* Success Message */}
            {isSuccess && (
                <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-2xl flex items-center gap-3 text-green-400 font-bold mb-4 animate-in slide-in-from-top-2">
                    <CheckCircle className="w-6 h-6 shrink-0" />
                    <p>Ta question a été envoyée à Jérémy !</p>
                </div>
            )}

            {/* Comment Form */}
            <form
                ref={formRef}
                action={(formData) => {
                    startTransition(async () => {
                        await handleCommentSubmit(formData);
                    });
                }}
                className="flex flex-col md:flex-row gap-3 items-end"
            >
                <div className="w-full relative">
                    <div className="absolute left-4 top-4 text-2xl drop-shadow-md">🪄</div>
                    <textarea
                        name="content"
                        placeholder="Une question sur ce tour ? Demande à Jérémy..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder-gray-500 shadow-inner resize-none min-h-[50px]"
                        required
                        rows={1}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full md:w-auto h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shrink-0 group transform hover:scale-105"
                >
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    {isPending ? "..." : "Envoyer"}
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6 pt-6">
                {localComments.map((comment) => {
                    // Detect if the message is from Jérémy (the admin)
                    // For kids security logic, the real admin email check on DB is best,
                    // but we can check if the full_name is 'Jérémy Marouani' or 'Admin' as a workaround
                    const isFromAdmin = comment.profiles?.role === 'admin' || comment.profiles?.email?.includes('admin@');

                    return (
                        <div key={comment.id} className={`flex gap-4 group animate-in slide-in-from-bottom-2 duration-500 ${isFromAdmin ? 'flex-row-reverse' : ''}`}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 border border-white/10 overflow-hidden relative shadow-inner" style={{ background: isFromAdmin ? 'rgba(250, 204, 21, 0.2)' : 'rgba(0, 0, 0, 0.4)' }}>
                                {isFromAdmin ? (
                                    <span className="text-2xl drop-shadow-md">🎩</span>
                                ) : (
                                    <span className="text-2xl drop-shadow-md opacity-80">🕵️‍♂️</span>
                                )}
                            </div>

                            <div className={`flex flex-col max-w-[85%] ${isFromAdmin ? 'items-end' : 'items-start'}`}>
                                <div className={`px-5 py-4 text-[15px] shadow-lg relative ${isFromAdmin
                                    ? `bg-gradient-to-br from-amber-500 to-orange-600 border border-orange-400/50 text-white rounded-2xl rounded-tr-sm`
                                    : 'bg-white/5 border border-white/5 text-gray-200 rounded-2xl rounded-tl-sm backdrop-blur-md'
                                    }`}>
                                    <div className={`flex items-center justify-between mb-2 gap-4 ${isFromAdmin ? 'flex-row-reverse' : ''}`}>
                                        <span className={`font-black text-xs uppercase tracking-widest flex items-center gap-2 ${isFromAdmin ? 'text-orange-100' : 'text-gray-400'}`}>
                                            {isFromAdmin ? 'Le Magicien !' : 'Un Petit Magicien'}
                                        </span>
                                        <span className={`text-[10px] ${isFromAdmin ? 'text-orange-200' : 'text-gray-600'}`}>
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Text Content */}
                                    {comment.content && (
                                        <p className={`leading-relaxed mb-3 ${isFromAdmin ? 'font-medium' : ''}`}>
                                            {comment.content}
                                        </p>
                                    )}

                                    {/* Rich Media Attachments */}
                                    {isFromAdmin && comment.media_type === 'video_bunny' && comment.media_url && (
                                        <div className="mt-3 bg-black/40 rounded-xl overflow-hidden shadow-inner border border-white/10 w-full md:w-[400px]">
                                            <div className="p-2 bg-black/60 text-xs font-bold text-orange-400 capitalize flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                                Réponse Vidéo : {comment.media_title || 'Explication magique'}
                                            </div>
                                            <div className="relative pt-[56.25%] w-full bg-black">
                                                {/* Hardcoded Kids Library ID (603266) since env vars aren't exposed to client components by default */}
                                                <iframe
                                                    src={`https://iframe.mediadelivery.net/embed/603266/${comment.media_url}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
                                                    className="absolute inset-0 w-full h-full"
                                                    frameBorder="0"
                                                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}

                                    {isFromAdmin && comment.media_type === 'pdf' && comment.media_url && (
                                        <a
                                            href={comment.media_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all group"
                                        >
                                            <div className="bg-white/20 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                                                <File className="w-4 h-4 text-white" />
                                            </div>
                                            Télécharger : {comment.media_title || 'Document PDF'}
                                        </a>
                                    )}
                                </div>
                                {isAdmin && !isFromAdmin && (
                                    <div className="mt-1 text-[10px] text-gray-600 ml-2">
                                        👤 Vrai identité : {comment.profiles?.full_name || 'Inconnu'} ({comment.profiles?.email})
                                    </div>
                                )}
                            </div>

                            {/* Admin Delete Button */}
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    disabled={deletingId === comment.id}
                                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 self-center ${deletingId === comment.id ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
                                    title="Supprimer ce message"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    );
                })}

                {localComments.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl bg-black/20">
                        Sois le premier à poser une question ! 🪄
                    </div>
                )}
            </div>
        </div>
    );
}
