"use client";

import { useState } from "react";
import { Send, X, Megaphone, Loader2 } from "lucide-react";
import { sendBroadcastAlert } from "@/app/admin/actions_broadcast";

export default function BroadcastModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        setErrorMsg('');

        const formData = new FormData(e.currentTarget);

        try {
            const result = await sendBroadcastAlert(formData);

            if (result.error) {
                setStatus('error');
                setErrorMsg(result.error);
            } else {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                }, 2000);
            }
        } catch (err) {
            setStatus('error');
            setErrorMsg("Une erreur inattendue s'est produite.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-brand-bg relative w-full max-w-lg rounded-2xl border border-brand-purple/50 shadow-2xl shadow-brand-purple/20 overflow-hidden">
                {/* Header */}
                <div className="bg-brand-card border-b border-brand-border p-4 flex items-center justify-between">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-brand-purple" />
                        Alerte Globale
                    </h2>
                    <button onClick={onClose} className="text-brand-text-muted hover:text-white p-2 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="p-12 text-center text-green-400 font-bold flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Send className="w-8 h-8" />
                        </div>
                        Alerte envoyée avec succès !
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <p className="text-brand-text-muted text-sm">
                            Ce message apparaîtra sur l'espace de **tous les enfants** et un email sera envoyé aux parents concernés.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-brand-text mb-2">Titre de l'Alerte</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="Ex: Nouveau Tour Magique Disponible !"
                                    className="w-full bg-brand-card border border-brand-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-brand-text mb-2">Contenu du Message</label>
                                <textarea
                                    name="content"
                                    required
                                    rows={4}
                                    placeholder="Ex: Salut l'apprenti, je viens de poster une nouvelle vidéo dans la section ..."
                                    className="w-full bg-brand-card border border-brand-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-brand-text mb-2">Lien (Optionnel)</label>
                                <input
                                    type="text"
                                    name="linkUrl"
                                    placeholder="Ex: /kids/videos/123-abc"
                                    className="w-full bg-brand-card border border-brand-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-all"
                                />
                            </div>

                            <input type="hidden" name="audience" value="kids" />
                        </div>

                        {status === 'error' && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-bold text-center">
                                {errorMsg}
                            </div>
                        )}

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-border">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-xl text-brand-text-muted hover:text-white font-bold transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-purple hover:bg-[#a855f7] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-purple/30 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                Envoyer le Broadcast
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
