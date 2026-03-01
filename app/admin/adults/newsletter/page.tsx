"use client";

import { useState } from "react";
import { Mail, Send, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function NewsletterAdminPage() {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [targetAudience, setTargetAudience] = useState("all");
    const [isSending, setIsSending] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    const handleSendAction = async (isTest: boolean) => {
        if (!subject.trim()) return toast.error("Le sujet est requis.");
        if (!content.trim()) return toast.error("Le message est vide.");

        if (!isTest) {
            const confirmed = window.confirm(
                `Êtes-vous sûr de vouloir envoyer cet e-mail à tous vos inscrits (${targetAudience}) ?\nC'est IRRÉVERSIBLE !`
            );
            if (!confirmed) return;
        }

        try {
            if (isTest) setIsTesting(true);
            else setIsSending(true);

            const res = await fetch("/api/admin/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject,
                    content,
                    targetAudience,
                    isTest
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");

            toast.success(isTest
                ? "E-mail de test envoyé à votre adresse d'admin."
                : `Newsletter expédiée à ${data.count} membre(s) !`
            );

            if (!isTest) {
                setSubject("");
                setContent("");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsTesting(false);
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="mb-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-gold/20 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                    <Mail className="w-8 h-8 text-brand-gold relative z-10" />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-3">Newsletter</h1>
                <p className="text-brand-text-muted font-light max-w-xl mx-auto">
                    Rédigez et envoyez vos e-mails directement à vos élèves. Seuls les abonnés ayant donné leur accord lors du paiement (RGPD) recevront ces messages.
                </p>
            </div>

            <div className="bg-brand-card border border-white/5 rounded-3xl p-8 relative overflow-hidden group max-w-4xl mx-auto shadow-2xl">
                {/* Glow ambiant */}
                <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"></div>

                <div className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1">Cible</label>
                        <select
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium appearance-none"
                        >
                            <option value="all">Tous les inscrits consentants (Adultes + Enfants)</option>
                            <option value="adults">Uniquement les Adultes (L'Atelier des Magiciens)</option>
                            <option value="kids">Uniquement les Enfants (Club des Petits Magiciens)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1">Sujet de l'e-mail</label>
                        <input
                            type="text"
                            name="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold text-lg"
                            placeholder="Mon nouveau tour de magie incroyable 🎩"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1 flex justify-between">
                            <span>Contenu (Texte / HTML basic autorisé)</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={15}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all text-sm leading-relaxed resize-y font-mono"
                            placeholder={`Bonjour [Prénom],\n\nGrâce à Tailwind et Resend, voici votre nouvelle newsletter...`}
                        />
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-end border-t border-white/5">
                        <button
                            onClick={() => handleSendAction(true)}
                            disabled={isTesting || isSending}
                            className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 text-white flex items-center justify-center transition-all min-w-[150px] disabled:opacity-50"
                        >
                            {isTesting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Envoyer un test"}
                        </button>
                        <button
                            onClick={() => handleSendAction(false)}
                            disabled={isTesting || isSending}
                            className="px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-brand-gold to-orange-500 hover:from-brand-gold/90 hover:to-orange-500/90 text-black flex items-center justify-center transition-all min-w-[200px] shadow-[0_0_20px_rgba(234,179,8,0.2)] disabled:opacity-50"
                        >
                            {isSending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Expédier à la liste
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div className="text-sm font-light text-orange-200/80">
                    <strong className="text-orange-400 font-bold block mb-1">Attention, envoi groupé</strong>
                    Cet outil expédie un message directement dans la boîte mail des utilisateurs. Pour éviter le "Spam Limite" de Resend (compte gratuit), cet expéditeur sera techniquement <strong>contact@clubdespetitsmagiciens.fr</strong>, qu'il s'agisse d'un envoi pour Adultes ou Enfants.
                </div>
            </div>

        </div>
    );
}
