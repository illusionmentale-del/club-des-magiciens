"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addComment } from "@/app/watch/[courseId]/actions";
import { User, MessageSquare, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-6 py-3 bg-magic-purple hover:bg-magic-purple/80 text-white font-bold rounded-xl transition-all disabled:opacity-50"
        >
            {pending ? "Envoi..." : "Poster le commentaire"}
        </button>
    );
}

export default function CommentsSection({ courseId, comments, userId }: { courseId: string, comments: any[], userId: string }) {
    // @ts-ignore
    const [state, formAction] = useFormState(addComment.bind(null, courseId), null);

    return (
        <div className="space-y-8 mt-12 bg-magic-card border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-serif text-white flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-magic-purple" />
                Discussion ({comments.length})
            </h3>

            {/* Comment Form */}
            <form action={formAction} className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-magic-purple/20 flex items-center justify-center text-magic-purple border border-magic-purple/30">
                            <User className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <textarea
                            name="content"
                            placeholder="Partagez votre avis, vos difficultés ou vos réussites..."
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-magic-purple focus:outline-none text-white resize-none"
                            required
                        />
                    </div>
                </div>

                {state?.error && (
                    <div className="ml-14 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {state.error}
                    </div>
                )}

                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                <span className="font-bold text-sm">
                                    {comment.profiles?.username ? comment.profiles.username.substring(0, 2).toUpperCase() : <User className="w-5 h-5" />}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-magic-gold">
                                    {comment.profiles?.username || "Apprenti Anonyme"}
                                </span>
                                {comment.profiles?.magic_level && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                                        {comment.profiles.magic_level}
                                    </span>
                                )}
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                                </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
