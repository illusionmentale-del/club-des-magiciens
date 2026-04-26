"use client";

import { useFormStatus } from "react-dom";
import { addComment } from "@/app/watch/[courseId]/actions";
import { deleteKidsComment } from "@/app/kids/videos/[...videoId]/actions"; // Reuse delete action for now
import { User, MessageCircle, Send, Trash2, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-magic-royal text-black px-6 py-3 rounded-xl font-bold hover:bg-brand-purple transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-wide text-sm"
        >
            <Send className="w-4 h-4" />
            {pending ? "..." : "Publier"}
        </button>
    );
}

export default function AdultComments({ courseId, comments, user }: { courseId: string, comments: any[], user: any }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [localComments, setLocalComments] = useState(comments);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const pathname = usePathname();

    const isAdmin = user?.user_metadata?.role === 'admin' || (user?.email?.includes('admin@') ?? false);

    const handleDelete = async (commentId: string) => {
        if (!confirm("Es-tu sûr de vouloir supprimer définitivement ce message ?")) return;

        setDeletingId(commentId);
        try {
            await deleteKidsComment(commentId, pathname); // This action works for all comments
            setLocalComments(prev => prev.filter(c => c.id !== commentId));
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8 mt-12 bg-[#0a0a0f] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-magic-royal/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                    <MessageCircle className="w-6 h-6 text-magic-royal" />
                    Cercle d'échanges ({comments.length})
                </h3>
            </div>

            {/* Comment Form */}
            <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden shadow-lg">
                    {user?.user_metadata?.avatarUrl ? (
                        <Image src={user.user_metadata.avatarUrl} alt="Avatar" width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                        user?.user_metadata?.username?.[0]?.toUpperCase() || <User className="w-5 h-5 text-gray-400" />
                    )}
                </div>
                <form
                    ref={formRef}
                    action={async (formData) => {
                        await addComment(courseId, formData.get("content") as string);
                        formRef.current?.reset();
                        // Ideally we would fetch the new comment and append it here, but server actions will trigger a revalidatePath.
                    }}
                    className="flex-1 flex flex-col gap-3"
                >
                    <textarea
                        name="content"
                        placeholder="Partage ton ressenti, pose une question ou donne un conseil à la communauté..."
                        className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-magic-royal/50 focus:ring-1 focus:ring-magic-royal/30 transition-all text-white min-h-[100px] shadow-inner resize-y placeholder:text-gray-600"
                        required
                    />
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500 font-light flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                            Espace visible par tous les membres
                        </p>
                        <SubmitButton />
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6 mt-10 relative z-10">
                {localComments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <div className="w-12 h-12 rounded-full border border-white/10 bg-[#111] flex items-center justify-center text-gray-400 font-bold shrink-0 overflow-hidden relative shadow-lg">
                            {/* @ts-ignore */}
                            {comment.profiles?.avatar_url ? (
                                /* @ts-ignore */
                                <img src={comment.profiles.avatar_url} alt="Avatar" className="object-cover w-full h-full" />
                            ) : (
                                /* @ts-ignore */
                                comment.profiles?.username ? (
                                    /* @ts-ignore */
                                    <span className="text-sm">{comment.profiles.username.substring(0, 2).toUpperCase()}</span>
                                ) : (
                                    <User className="w-5 h-5" />
                                )
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="bg-[#111] rounded-2xl rounded-tl-none px-6 py-5 border border-white/5 shadow-md">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-base">
                                            {/* @ts-ignore */}
                                            {comment.profiles?.username || "Illusionniste"}
                                        </span>
                                        {/* Optional "Admin" badge if Jérémy replies */}
                                        {/* @ts-ignore */}
                                        {comment.profiles?.role === 'admin' && (
                                            <span className="text-[10px] bg-magic-royal text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Lecteur / Jérémy</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 font-light whitespace-nowrap">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-300 leading-relaxed font-light text-[15px] whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>

                        {/* Admin Delete Button */}
                        {isAdmin && (
                            <button
                                onClick={() => handleDelete(comment.id)}
                                disabled={deletingId === comment.id}
                                className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl text-gray-600 hover:text-red-400 self-center ${deletingId === comment.id ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
                                title="Supprimer ce message"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
                
                {localComments.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <MessageCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400 font-light">Sois le premier à ouvrir la discussion sur ce sujet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
