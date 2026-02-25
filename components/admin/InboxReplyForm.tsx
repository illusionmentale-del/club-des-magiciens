"use client";

import { useState, useTransition } from "react";
import { markAsReadAndReply, dismissQuestion } from "@/app/admin/kids/inbox/actions";
import { Send, FileText, Video, File, Check, X } from "lucide-react";

export default function InboxReplyForm({
    commentId,
    courseId,
    kidPseudo
}: {
    commentId: string;
    courseId: string;
    kidPseudo: string;
}) {
    const [isPending, startTransition] = useTransition();
    const [mediaType, setMediaType] = useState<'text' | 'video_bunny' | 'pdf'>('text');

    // Form States
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaTitle, setMediaTitle] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await markAsReadAndReply(commentId, courseId, content, mediaType, mediaUrl, mediaTitle);
        });
    };

    const handleDismiss = () => {
        if (confirm(`Marquer la question de ${kidPseudo} comme lue sans répondre ?`)) {
            startTransition(async () => {
                await dismissQuestion(commentId);
            });
        }
    };

    return (
        <div className="bg-black/20 border border-white/5 rounded-xl p-4 mt-4 relative">
            {isPending && (
                <div className="absolute inset-0 bg-brand-bg/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white">Répondre à {kidPseudo}</h4>
                <div className="flex bg-white/5 rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => setMediaType('text')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${mediaType === 'text' ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <FileText className="w-3.5 h-3.5" /> Texte
                    </button>
                    <button
                        type="button"
                        onClick={() => setMediaType('video_bunny')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${mediaType === 'video_bunny' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Video className="w-3.5 h-3.5" /> Vidéo
                    </button>
                    <button
                        type="button"
                        onClick={() => setMediaType('pdf')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${mediaType === 'pdf' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <File className="w-3.5 h-3.5" /> PDF
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Content Field (Always visible) */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Message de réponse</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Bonjour ${kidPseudo} ! Voici l'explication...`}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-white placeholder-gray-600 text-sm min-h-[100px]"
                        required={mediaType === 'text'}
                    />
                </div>

                {/* Video specific fields */}
                {mediaType === 'video_bunny' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                        <div>
                            <label className="block text-xs font-bold text-orange-400 mb-2 uppercase tracking-widest">Titre de la vidéo</label>
                            <input
                                type="text"
                                value={mediaTitle}
                                onChange={(e) => setMediaTitle(e.target.value)}
                                placeholder="Ex: Démo du faux dépôt"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-orange-400 mb-2 uppercase tracking-widest">ID Bunny Stream (GUID)</label>
                            <input
                                type="text"
                                value={mediaUrl}
                                onChange={(e) => setMediaUrl(e.target.value)}
                                placeholder="xxx-yyy-zzz"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* PDF specific fields */}
                {mediaType === 'pdf' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <div>
                            <label className="block text-xs font-bold text-blue-400 mb-2 uppercase tracking-widest">Titre du fichier PDF</label>
                            <input
                                type="text"
                                value={mediaTitle}
                                onChange={(e) => setMediaTitle(e.target.value)}
                                placeholder="Ex: Patron de la boîte magique"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-blue-400 mb-2 uppercase tracking-widest">URL du PDF (Lien direct)</label>
                            <input
                                type="url"
                                value={mediaUrl}
                                onChange={(e) => setMediaUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-3 justify-end pt-2">
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        <X className="w-4 h-4" /> Ignorer (Lu)
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-lg hover:shadow-brand-purple/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" /> Envoyer la réponse
                    </button>
                </div>
            </form>
        </div>
    );
}
