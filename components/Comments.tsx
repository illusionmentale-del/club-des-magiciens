"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addComment } from "@/app/watch/[courseId]/actions";
import { User, MessageCircle, Send } from "lucide-react";
import { useRef } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-magic-purple text-white px-4 py-2 rounded-xl font-bold hover:bg-magic-purple/90 transition-all disabled:opacity-50 flex items-center gap-2"
        >
            <Send className="w-4 h-4" />
            {pending ? "..." : "Envoyer"}
        </button>
    );
}

export default function CommentsSection({ courseId, comments, user }: { courseId: string, comments: any[], user: any }) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <div className="space-y-8 mt-12 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <MessageCircle className="w-6 h-6 text-magic-purple" />
                Questions & Commentaires ({comments.length})
            </h3>

            {/* Comment Form */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">
                    {user?.user_metadata?.username?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                </div>
                <form
                    ref={formRef}
                    action={async (formData) => {
                        await addComment(courseId, formData.get("content") as string);
                        formRef.current?.reset();
                    }}
                    className="flex-1 flex gap-2"
                >
                    <input
                        name="content"
                        placeholder="Pose ta question ou dis ce que tu penses..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-magic-purple/50 transition-all"
                        required
                    />
                    <SubmitButton />
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0 border border-gray-200 overflow-hidden relative">
                            {/* @ts-ignore */}
                            {(comment.profiles?.avatar_url || comment.profiles?.avatar_url_kids) ? (
                                <img
                                    /* @ts-ignore */
                                    src={comment.profiles.avatar_url || comment.profiles.avatar_url_kids}
                                    alt="Avatar"
                                    className="object-cover w-full h-full"
                                />
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
                            <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-100">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-gray-800 text-sm">
                                        {/* @ts-ignore */}
                                        {comment.profiles?.username || "Magicien Mystère"}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                {/* @ts-ignore */}
                                {comment.profiles?.magic_level && (
                                    <div className="text-[10px] text-magic-purple font-bold mb-1 uppercase tracking-wider">
                                        {/* @ts-ignore */}
                                        {comment.profiles.magic_level}
                                    </div>
                                )}
                                <p className="text-gray-700">{comment.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
