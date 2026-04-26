"use client";

import { useState } from "react";
import { Mail, Send, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { TemplateSelector, NewsletterTemplate } from "./components/TemplateSelector";
import { CourseSelector, SpaceType } from "./components/CourseSelector";
import { ProductSelector } from "./components/ProductSelector";

export default function NewsletterAdminPage() {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [targetAudience, setTargetAudience] = useState("all");
    const [template, setTemplate] = useState<NewsletterTemplate>('classic');

    // Dynamic Selections
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const [isSending, setIsSending] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    // Determine the space context based on audience for the selectors
    const getSelectorSpace = (): SpaceType => {
        if (targetAudience === 'adults') return 'adults';
        if (targetAudience === 'kids') return 'kids';
        return 'all';
    };

    const handleSendAction = async (isTest: boolean) => {
        if (!subject.trim()) return toast.error("Le sujet est requis.");

        // Validation basique
        if (template === 'classic' && !content.trim()) return toast.error("Le message est vide.");
        if (template === 'course_focus' && !selectedCourseId) return toast.error("Veuillez sélectionner un cours.");
        if (template === 'product_focus' && !selectedProductId) return toast.error("Veuillez sélectionner un produit.");

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
                    template,
                    selectedCourseId,
                    selectedProductId,
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
                setSelectedCourseId(null);
                setSelectedProductId(null);
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
                <div className="w-16 h-16 bg-[#1c1c1e] rounded-[24px] flex items-center justify-center mb-6 border border-white/5 shadow-md">
                    <Mail className="w-8 h-8 text-white relative z-10" />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-3">Le Newsletter Builder</h1>
                <p className="text-brand-text-muted font-light max-w-xl mx-auto">
                    Concevoir des e-mails visuels sans coder. Choisissez une trame, sélectionnez votre contenu et envoyez à votre base abonnée.
                </p>
            </div>

            <div className="bg-brand-card border border-white/5 rounded-3xl p-8 relative overflow-hidden group max-w-4xl mx-auto shadow-2xl">
                <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-[#f5f5f7]/30 to-transparent"></div>

                <div className="space-y-8 relative z-10">

                    {/* Audience & Trame */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1">Audience Cible</label>
                            <select
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 transition-all font-medium appearance-none"
                            >
                                <option value="all">Tous (Adultes + Enfants)</option>
                                <option value="adults">Uniquement les Adultes (L'Atelier)</option>
                                <option value="kids">Uniquement les Enfants (Le Club)</option>
                            </select>
                            <p className="text-[10px] text-brand-text-muted mt-2 ml-1">Filtre appliqué pour la liste d'envoi et la liste des contenus.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1">Sujet de l'e-mail</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 transition-all font-bold"
                                placeholder="La Masterclass de Février est en ligne 🎩"
                            />
                        </div>
                    </div>

                    {/* Sélection de la Trame */}
                    <TemplateSelector selected={template} onSelect={setTemplate} />

                    {/* Contenu Dynamique selon la Trame */}
                    <div className="pt-4 border-t border-white/5 space-y-6">

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1">
                                {template === 'classic' ? 'Message Principal' : 'Texte d\'introduction (Optionnel)'}
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={template === 'classic' ? 12 : 4}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 transition-all text-sm leading-relaxed resize-y font-mono"
                                placeholder={`Bonjour [Prénom],\n\nVoici le texte de votre e-mail...`}
                            />
                        </div>

                        {template === 'course_focus' && (
                            <CourseSelector
                                space={getSelectorSpace()}
                                onSelect={setSelectedCourseId}
                            />
                        )}

                        {template === 'product_focus' && (
                            <ProductSelector
                                space={getSelectorSpace()}
                                onSelect={setSelectedProductId}
                            />
                        )}

                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-end border-t border-white/5">
                        <button
                            onClick={() => handleSendAction(true)}
                            disabled={isTesting || isSending}
                            className="px-6 py-3 rounded-[16px] font-bold uppercase tracking-widest text-xs bg-[#1c1c1e] border border-white/5 text-[#86868b] hover:text-[#f5f5f7] flex items-center justify-center transition-all min-w-[150px] disabled:opacity-50"
                        >
                            {isTesting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "S'envoyer un Test"}
                        </button>
                        <button
                            onClick={() => handleSendAction(false)}
                            disabled={isTesting || isSending}
                            className="px-8 py-3 rounded-[16px] font-bold uppercase tracking-widest text-sm bg-[#f5f5f7] hover:bg-white text-[#1c1c1e] flex items-center justify-center transition-all min-w-[200px] shadow-lg disabled:opacity-50"
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

            <div className="max-w-4xl mx-auto flex items-start gap-3 p-4 bg-blue-700/10 border border-blue-700/20 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm font-light text-orange-200/80">
                    <strong className="text-blue-500 font-bold block mb-1">Protection Anti-Spam (Nouveau Système)</strong>
                    Cet éditeur visuel générera des blocs HTML robustes (Cartes, Boutons) supportés par Gmail/Apple Mail. L'expéditeur technique reste <strong>contact@clubdespetitsmagiciens.fr</strong> sécurisé par Resend. L'ID du cours ou du produit sélectionné est envoyé au serveur qui s'occupe du reste.
                </div>
            </div>

        </div>
    );
}
