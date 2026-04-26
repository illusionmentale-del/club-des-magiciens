"use client";

import { useState } from "react";
import { Send, BellRing, Smartphone, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PushAdminPage() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [url, setUrl] = useState("/");
    const [targetAudience, setTargetAudience] = useState("all");
    const [isSending, setIsSending] = useState(false);
    const [stats, setStats] = useState<{ sent: number; failed: number; staleRemoved: number } | null>(null);

    const [subscribers, setSubscribers] = useState<any[] | null>(null);
    const [isLoadingSubs, setIsLoadingSubs] = useState(false);

    const fetchSubscribers = async () => {
        try {
            setIsLoadingSubs(true);
            const res = await fetch("/api/admin/push/subscribers");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSubscribers(data);
        } catch (e: any) {
            toast.error("Erreur de récupération : " + e.message);
        } finally {
            setIsLoadingSubs(false);
        }
    };

    const handleSendPush = async () => {
        if (!title.trim() || !message.trim()) {
            return toast.error("Le titre et le message sont requis.");
        }

        const confirmed = window.confirm(
            `Êtes-vous sûr de vouloir envoyer cette Nofication Push à tous les appareils abonnés (${targetAudience}) ?\nL'envoi est immédiat.`
        );
        if (!confirmed) return;

        try {
            setIsSending(true);
            setStats(null);

            const reqUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

            const res = await fetch("/api/admin/push", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    message,
                    targetAudience,
                    url: reqUrl
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");

            if (data.count === 0 || data.sent === 0) {
                toast("Aucun appareil n'a reçu la notification. (0 abonnés actifs)", { icon: "ℹ️" });
            } else {
                toast.success(`Push envoyé avec succès à ${data.sent} appareil(s) !`);
            }

            setStats({
                sent: data.sent || 0,
                failed: data.failed || 0,
                staleRemoved: data.staleRemoved || 0
            });

            setTitle("");
            setMessage("");

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="mb-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1c1c1e] rounded-[24px] flex items-center justify-center mb-6 border border-white/5 shadow-md">
                    <BellRing className="w-8 h-8 text-white relative z-10" />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-3">Envoi Rapide Push</h1>
                <p className="text-brand-text-muted font-light max-w-xl mx-auto">
                    Envoyez une alerte native sur l'écran d'accueil des téléphones et ordinateurs de vos élèves abonnés aux notifications.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Formulaire (2/3 largeur) */}
                <div className="lg:col-span-2 bg-brand-card border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-[#f5f5f7]/30 to-transparent"></div>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1">Audience Cible</label>
                            <select
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple/50 transition-all font-medium appearance-none"
                            >
                                <option value="all">Tous (Adultes + Enfants)</option>
                                <option value="adults">Uniquement les Adultes (L'Atelier)</option>
                                <option value="kids">Uniquement les Enfants (Le Club)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1">Titre de l'Alerte</label>
                            <input
                                type="text"
                                value={title}
                                maxLength={50}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-purple/50 transition-all font-bold"
                                placeholder="🔴 Le Live Démarre !"
                            />
                            <p className="text-[10px] text-right text-white/30 mt-1">{title.length} / 50</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1">Message Court</label>
                            <textarea
                                value={message}
                                maxLength={100}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={2}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-purple/50 transition-all text-sm resize-none"
                                placeholder="Jérémy est en direct pour le débriefing d'hier. Rejoignez le chat !"
                            />
                            <p className="text-[10px] text-right text-white/30 mt-1">{message.length} / 100</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-2 ml-1">Lien de redirection (Optionnel)</label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white/70 placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-purple/50 transition-all font-mono text-sm"
                                placeholder="/dashboard/lives"
                            />
                            <p className="text-[10px] text-brand-text-muted mt-1 ml-1">Où l'élève est envoyé quand il clique sur la notification (ex: /kids/lives ou /dashboard/masterclass).</p>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <button
                                onClick={handleSendPush}
                                disabled={isSending}
                                className="w-full py-4 rounded-[16px] font-bold uppercase tracking-widest text-sm bg-[#f5f5f7] hover:bg-white text-[#1c1c1e] flex items-center justify-center transition-all shadow-lg disabled:opacity-50"
                            >
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Expédier l'Alerte Native
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Prévisualisation & Stats (1/3 largeur) */}
                <div className="space-y-6">
                    <div className="bg-black/40 border border-white/5 rounded-3xl p-6 shadow-inner">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-4 flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Aperçu simulé
                        </h3>

                        {/* Fake Mobile Notification Card */}
                        <div className="mx-auto w-[250px] bg-zinc-800/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/10 relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <img src="/icon-512x512.png" className="w-4 h-4 rounded-sm" />
                                <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Club Magiciens</span>
                                <span className="text-[10px] text-white/30 ml-auto select-none">maintenant</span>
                            </div>
                            <h4 className="text-white text-sm font-bold truncate">{title || "Titre de l'alerte"}</h4>
                            <p className="text-white/80 text-xs mt-1 leading-snug break-words line-clamp-2">
                                {message || "Votre message court apparaîtra ici."}
                            </p>
                        </div>
                    </div>

                    {stats && (
                        <div className="bg-brand-card border border-green-500/20 rounded-3xl p-6 shadow-xl">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-green-500 mb-4">Dernier Envoi</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="text-xs text-brand-text-muted tracking-wide">Délivrés :</span>
                                    <span className="font-mono text-green-400 font-bold">{stats.sent}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="text-xs text-brand-text-muted tracking-wide">Échecs temporaires :</span>
                                    <span className="font-mono text-orange-400 font-bold">{stats.failed}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-brand-text-muted tracking-wide">Appareils obsolètes effacés :</span>
                                    <span className="font-mono text-red-400 font-bold">{stats.staleRemoved}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3 p-4 bg-[#1c1c1e] border border-white/5 rounded-[24px]">
                        <AlertTriangle className="w-5 h-5 text-[#86868b] shrink-0 mt-0.5" />
                        <div className="text-[11px] font-light text-[#86868b] leading-relaxed">
                            <strong className="text-[#f5f5f7] font-bold block mb-1">Rappel Apple (iOS)</strong>
                            Pour que les élèves reçoivent ces alertes sur iPhone, ils doivent au préalable enregistrer votre site sur leur écran d'accueil d'iPhone via Safari. Sur ordinateur ou Android, le bouton d'abonnement fonctionne tout seul.
                        </div>
                    </div>
                </div>

            </div>

            {/* Liste des Abonnés */}
            <div className="bg-brand-card border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden mt-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-black uppercase text-white mb-1">Base d'Abonnés Push</h2>
                        <p className="text-sm text-brand-text-muted">Découvrez exactement qui reçoit les alertes de votre plateforme.</p>
                    </div>
                    <button
                        onClick={fetchSubscribers}
                        disabled={isLoadingSubs}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        {isLoadingSubs ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualiser la liste"}
                    </button>
                </div>

                {!subscribers ? (
                    <div className="py-12 text-center text-brand-text-muted border border-dashed border-white/10 rounded-2xl">
                        Cliquez sur le bouton pour analyser la base d'appareils enregistrés.
                    </div>
                ) : subscribers.length === 0 ? (
                    <div className="py-12 text-center text-brand-text-muted border border-dashed border-white/10 rounded-2xl">
                        Aucun abonné aux notifications trouvé pour le moment.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-text-muted">Utilisateur</th>
                                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-text-muted">Appareils</th>
                                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-text-muted">Accès (Formation)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.map((sub, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-white text-sm flex items-center gap-2">
                                                {sub.full_name}
                                                {sub.role === 'admin' && <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest border border-red-500/30">Admin</span>}
                                            </div>
                                            <div className="text-xs text-brand-text-muted font-mono mt-0.5">{sub.email}</div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-brand-purple">{sub.devices} appareil(s)</span>
                                                <span className="text-xs opacity-50">({sub.platforms.join(', ')})</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-xs">
                                            <div className="flex flex-col gap-1">
                                                {sub.access?.adults ? <span className="text-magic-royal">✅ L'Atelier (Adultes)</span> : <span className="text-gray-600">❌ L'Atelier</span>}
                                                {sub.access?.kids ? <span className="text-brand-purple">✅ Le Club (Enfants)</span> : <span className="text-gray-600">❌ Le Club</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
