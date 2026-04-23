"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save, Star, CheckCircle, X, Shield, History, Key, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
    adminChangeUserPassword, 
    getAdminAdultUserDetails,
    adminValidateItem,
    adminRevokeItem,
    adminGiveGift,
    adminRevokeGift,
    generateImpersonationLink,
    adminToggleNewsletter
} from "@/app/admin/actions";

// Types
type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string;
    avatar_url_kids: string;
    email?: string; 
    created_at: string;
    newsletter_opt_in?: boolean;
};

type LastVideoInfo = {
    video_id: string;
    updated_at: string;
    progress_percent: number;
    title: string | null;
};

type Progress = {
    id: string;
    item_id: string;
    completed_at: string;
    library_items: {
        title: string;
        week_number: number;
    };
};

type UserPurchase = {
    id: string;
    library_item_id: string;
    created_at: string;
    systeme_io_order_id: string;
    library_items: {
        title: string;
    };
};

type LibraryItem = {
    id: string;
    title: string;
    week_number?: number;
};

export default function AdminAdultUserDetailPage() {
    const params = useParams();
    const router = useRouter();
    
    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

    const [profile, setProfile] = useState<Profile | null>(null);
    const [progress, setProgress] = useState<Progress[]>([]);
    const [purchases, setPurchases] = useState<UserPurchase[]>([]);
    const [lastVideo, setLastVideo] = useState<LastVideoInfo | null>(null);

    // For selection
    const [allItems, setAllItems] = useState<LibraryItem[]>([]);
    const [shopItems, setShopItems] = useState<LibraryItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        if (!id) return;

        try {
            const data = await getAdminAdultUserDetails(id);
            setProfile(data.profile);
            setProgress(data.progress);
            setPurchases(data.purchases);
            setAllItems(data.allItems);
            setShopItems(data.shopItems || []);
            setLastVideo(data.lastVideoInfo || null);
        } catch (err) {
            console.error("Erreur de récupération:", err);
            alert("Erreur de chargement du profil via API admin.");
        }

        setLoading(false);
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    // Actions
    const handleValidateItem = async (itemId: string) => {
        if (!itemId) return;
        const res = await adminValidateItem(id, itemId);
        if (res.error) alert("Erreur: " + res.error);
        else fetchData();
    };

    const handleRevokeItem = async (progressId: string) => {
        if (!confirm("Annuler cette validation ?")) return;
        const res = await adminRevokeItem(progressId);
        if (res.error) alert("Erreur: " + res.error);
        else fetchData();
    };

    const handleGiveGift = async (itemId: string) => {
        if (!itemId) return;
        const res = await adminGiveGift(id, itemId);
        if (res.error) alert("Erreur lors de l'ajout: " + res.error);
        else fetchData();
    };

    const handleRevokeGift = async (purchaseId: string) => {
        if (!confirm("Attention : Retirer l'accès à ce produit de la boutique pour cet adulte ?")) return;
        const res = await adminRevokeGift(purchaseId);
        if (res.error) alert("Erreur: " + res.error);
        else fetchData();
    };

    const handleToggleNewsletter = async () => {
        if (!profile) return;
        const newStatus = !profile.newsletter_opt_in;
        // Optimistic UI update
        setProfile({ ...profile, newsletter_opt_in: newStatus });

        const result = await adminToggleNewsletter(id as string, newStatus);
        if (result.error) {
            alert("Erreur lors de la modification de l'abonnement newsletter");
            fetchData(); // Rollback
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            alert("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }
        if (!confirm(`Confirmer la modification absolue du mot de passe pour cet élève ?`)) return;

        setIsChangingPassword(true);
        const formData = new FormData();
        formData.append("new_password", newPassword);

        const result = await adminChangeUserPassword(id, formData);
        setIsChangingPassword(false);

        if (result.error) {
            alert("Erreur: " + result.error);
        } else {
            alert("Mot de passe modifié avec succès ! L'élève peut s'y connecter.");
            setNewPassword("");
        }
    };

    const handleImpersonate = async () => {
        setIsGeneratingLink(true);
        try {
            const res = await generateImpersonationLink(id as string);
            if (res.success && res.link) {
                window.open(res.link, '_blank');
            } else {
                alert(res.error || "Erreur lors de la génération du lien.");
            }
        } catch (e: any) {
            console.error(e);
            alert(`Erreur réseau/système détaillée: ${e?.message || e}`);
        } finally {
            setIsGeneratingLink(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-brand-bg text-white flex items-center justify-center">Chargement...</div>;
    if (!profile) return <div className="min-h-screen bg-brand-bg text-white flex items-center justify-center">Profil introuvable</div>;

    return (
        <div className="flex flex-col gap-6 md:gap-8 font-sans w-full max-w-full overflow-x-hidden text-brand-text">
            <header className="mb-4 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Link href="/admin/adults/users" className="flex items-center gap-2 text-brand-text-muted hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Retour
                    </Link>
                    <div className="text-right">
                        <div className="text-xs text-brand-text-muted uppercase font-bold tracking-widest">Membre Depuis</div>
                        <div className="text-sm font-mono text-white">{new Date(profile.created_at).toLocaleDateString()}</div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: IDENTITY */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-brand-card/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                            <div className="w-32 h-32 bg-black rounded-full mb-4 relative overflow-hidden border-4 border-brand-royal/20">
                                {profile.avatar_url_kids ? (
                                    <Image src={profile.avatar_url_kids} alt="" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">🎩</div>
                                )}
                            </div>
                            <h1 className="text-2xl font-black text-white mb-1">{profile.first_name || "Sans Nom"}</h1>
                            <p className="text-brand-royal font-bold">@{profile.display_name}</p>
                        </div>

                        {/* STATISTIQUES */}
                        <div className="bg-brand-card/40 border border-white/5 rounded-2xl p-6 text-sm">
                            <h3 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-4">Activité Adulte</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-brand-text-muted uppercase mb-1">Dernière Vidéo Visionnée</div>
                                    {lastVideo ? (
                                        <>
                                            <div className="font-bold text-brand-royal line-clamp-2 leading-tight">
                                                {lastVideo.title || "Vidéo Inconnue"}
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-brand-text-muted">
                                                    Le {new Date(lastVideo.updated_at).toLocaleDateString('fr-FR')}
                                                </span>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${lastVideo.progress_percent >= 90 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-300'}`}>
                                                    {lastVideo.progress_percent}%
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-brand-text-muted italic text-xs">Aucune vidéo visionnée</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS RAPIDES */}
                        <div className="bg-brand-card/40 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-4">Actions Admin</h3>
                            <div className="space-y-4">
                                <div>
                                    <button 
                                        onClick={handleImpersonate}
                                        disabled={isGeneratingLink}
                                        className="w-full flex items-center justify-center gap-2 bg-brand-royal/10 hover:bg-brand-royal/20 text-brand-royal hover:text-white border border-brand-royal/30 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all duration-300"
                                    >
                                        <Eye className="w-4 h-4" />
                                        {isGeneratingLink ? "Génération..." : "Visualiser son espace"}
                                    </button>
                                </div>
                                <div className="border-t border-white/5 pt-4 mt-4">
                                    <label className="text-xs text-brand-royal block mb-1">Valider un Atelier (Manuel)</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm outline-none text-white focus:border-brand-royal transition-colors"
                                        onChange={(e) => handleValidateItem(e.target.value)}
                                        value=""
                                    >
                                        <option value="" disabled>Choisir un atelier...</option>
                                        {allItems.map(item => (
                                            <option key={item.id} value={item.id}>S{item.week_number} - {item.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="border-t border-white/5 pt-4 mt-4">
                                    <label className="text-xs text-green-400 font-bold block mb-1">🎁 Offrir une Formation / Objet</label>
                                    <select
                                        className="w-full bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-sm outline-none text-green-100"
                                        onChange={(e) => handleGiveGift(e.target.value)}
                                        value=""
                                    >
                                        <option value="" disabled>Choisir un contenu premium...</option>
                                        {shopItems.map(item => (
                                            <option key={item.id} value={item.id}>{item.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                                    <label className="text-xs text-white block">Abonné Newsletter</label>
                                    <button
                                        onClick={handleToggleNewsletter}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${profile.newsletter_opt_in ? 'bg-brand-royal' : 'bg-white/10'}`}
                                        role="switch"
                                        aria-checked={profile.newsletter_opt_in}
                                    >
                                        <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${profile.newsletter_opt_in ? 'translate-x-2' : '-translate-x-2'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* SECURITE / MOT DE PASSE */}
                        <div className="bg-brand-card/40 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Key className="w-4 h-4" /> Sécurité
                            </h3>
                            <form onSubmit={handlePasswordChange} className="space-y-3">
                                <div>
                                    <label className="text-[10px] text-brand-text-muted uppercase tracking-wider block mb-1">Nouveau mot de passe</label>
                                    <input
                                        type="text"
                                        placeholder="Min. 6 caractères"
                                        className="w-full bg-black/40 w-full border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-brand-royal transition-colors"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        minLength={6}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newPassword || newPassword.length < 6 || isChangingPassword}
                                    className="w-full bg-brand-royal hover:bg-brand-royal/80 text-black disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-colors"
                                >
                                    {isChangingPassword ? "Modification..." : "Forcer ce Mot de Passe"}
                                </button>
                                <p className="text-[10px] text-brand-text-muted text-center mt-2 leading-tight">
                                    L'ancien mot de passe ne fonctionnera plus. Copiez-le et envoyez-le à l'élève.
                                </p>
                            </form>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: PROGRESS & HISTORY */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* ACHATS DEBOQUÉS (BOUTIQUE) */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                                <span className="text-green-500">🎁</span>
                                Achats & Cadeaux Premium ({purchases.length})
                            </h2>
                            <div className="bg-brand-card/40 border border-white/5 rounded-2xl overflow-x-auto w-full max-w-full">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 text-brand-text-muted font-bold uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Produit Boutique</th>
                                            <th className="p-4">Détail</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {purchases.map((p) => (
                                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <span className="font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]">{p.library_items?.title}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-xs text-brand-text-muted">
                                                        Débloqué le : {new Date(p.created_at).toLocaleDateString()}
                                                    </div>
                                                    {p.systeme_io_order_id === 'admin_gift' && (
                                                        <div className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider mt-1">
                                                            Cadeau Admin
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleRevokeGift(p.id)} className="text-red-500 hover:text-red-400 text-xs uppercase font-bold px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors">
                                                        Retirer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {purchases.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-brand-text-muted italic">Aucune transaction enregistrée.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* PROGRESSION */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                                <History className="text-brand-royal" />
                                Vidéos & Ateliers ({progress.length})
                            </h2>
                            <div className="bg-brand-card/40 border border-white/5 rounded-2xl overflow-x-auto w-full max-w-full">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 text-brand-text-muted font-bold uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Vidéo</th>
                                            <th className="p-4">Date Validation</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {progress.map((p) => (
                                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <span className="text-xs text-brand-text-muted mr-2 font-mono">S{p.library_items?.week_number}</span>
                                                    <span className="font-bold text-white">{p.library_items?.title}</span>
                                                </td>
                                                <td className="p-4 text-brand-text-muted">{new Date(p.completed_at).toLocaleDateString()}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleRevokeItem(p.id)} className="text-red-500 hover:text-red-400 text-xs uppercase font-bold px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors">
                                                        Annuler
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {progress.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-brand-text-muted italic">Aucune progression enregistrée.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                    </div>
                </div>
        </div>
    );
}
