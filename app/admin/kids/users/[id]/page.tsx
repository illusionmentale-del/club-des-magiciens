"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Trophy, Star, CheckCircle, X, Shield, History, Key } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { adminChangeUserPassword } from "@/app/admin/actions";

// Types
type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string;
    avatar_url_kids: string;
    magic_level: string;
    xp: number;
    email?: string; // Often attached to auth user, but maybe we can fetch profile ext
    created_at: string;
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

type UserBadge = {
    id: string;
    badge_id: string;
    awarded_at: string;
    badges: {
        name: string;
        image_url: string;
    };
};

type LibraryItem = {
    id: string;
    title: string;
    week_number: number;
};

type Badge = {
    id: string;
    name: string;
};

export default function AdminUserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [progress, setProgress] = useState<Progress[]>([]);
    const [userBadges, setUserBadges] = useState<UserBadge[]>([]);

    // For selection
    const [allItems, setAllItems] = useState<LibraryItem[]>([]);
    const [allBadges, setAllBadges] = useState<Badge[]>([]);

    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        if (!id) return;

        // Profile
        const { data: p } = await supabase.from("profiles").select("*").eq("id", id).single();
        setProfile(p);

        // Progress
        const { data: pr } = await supabase
            .from("library_progress")
            .select("*, library_items(title, week_number)")
            .eq("user_id", id)
            .order("completed_at", { ascending: false });
        setProgress(pr || []);

        // User Badges
        const { data: ub } = await supabase
            .from("user_badges")
            .select("*, badges(name, image_url)")
            .eq("user_id", id)
            .order("awarded_at", { ascending: false });
        setUserBadges(ub || []);

        // Form Data
        const { data: items } = await supabase.from("library_items").select("id, title, week_number").eq("audience", "kids").order("week_number");
        setAllItems(items || []);

        const { data: badges } = await supabase.from("badges").select("id, name");
        setAllBadges(badges || []);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // Actions
    const handleValidateItem = async (itemId: string) => {
        if (!itemId) return;
        const { error } = await supabase.from("library_progress").insert({ user_id: id, item_id: itemId });
        if (error) alert("Erreur (déjà validé ?)");
        else fetchData();
    };

    const handleRevokeItem = async (progressId: string) => {
        if (!confirm("Annuler cette validation ?")) return;
        const { error } = await supabase.from("library_progress").delete().eq("id", progressId);
        if (error) alert("Erreur");
        else fetchData();
    };

    const handleGiveBadge = async (badgeId: string) => {
        if (!badgeId) return;
        const { error } = await supabase.from("user_badges").insert({ user_id: id, badge_id: badgeId });
        if (error) alert("Erreur (déjà acquis ?)");
        else fetchData();
    };

    const handleRevokeBadge = async (userBadgeId: string) => {
        if (!confirm("Retirer ce badge ?")) return;
        const { error } = await supabase.from("user_badges").delete().eq("id", userBadgeId);
        if (error) alert("Erreur");
        else fetchData();
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

        const result = await adminChangeUserPassword(id as string, formData);
        setIsChangingPassword(false);

        if (result.error) {
            alert("Erreur: " + result.error);
        } else {
            alert("Mot de passe modifié avec succès ! L'élève peut s'y connecter.");
            setNewPassword("");
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Chargement...</div>;
    if (!profile) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Profil introuvable</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <Link href="/admin/kids/users" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Retour
                    </Link>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Membre Depuis</div>
                        <div className="text-sm font-mono">{new Date(profile.created_at).toLocaleDateString()}</div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: IDENTITY */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
                            <div className="w-32 h-32 bg-black rounded-full mb-4 relative overflow-hidden border-4 border-purple-500/20">
                                {profile.avatar_url_kids ? (
                                    <Image src={profile.avatar_url_kids} alt="" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">🪄</div>
                                )}
                            </div>
                            <h1 className="text-2xl font-black text-white mb-1">{profile.first_name || "Sans Nom"}</h1>
                            <p className="text-purple-400 font-bold mb-4">@{profile.display_name}</p>

                            <div className="w-full grid grid-cols-2 gap-2 text-left bg-black/20 p-4 rounded-xl">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase">Grade</div>
                                    <div className="font-bold text-yellow-400">{profile.magic_level || "Apprenti"}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase">XP</div>
                                    <div className="font-bold text-white">{profile.xp || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS RAPIDES */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Actions Admin</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-purple-300 block mb-1">Valider un Atelier (Manuel)</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm outline-none"
                                        onChange={(e) => handleValidateItem(e.target.value)}
                                        value=""
                                    >
                                        <option value="" disabled>Choisir un atelier...</option>
                                        {allItems.map(item => (
                                            <option key={item.id} value={item.id}>S{item.week_number} - {item.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-yellow-300 block mb-1">Attribuer un Badge</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm outline-none"
                                        onChange={(e) => handleGiveBadge(e.target.value)}
                                        value=""
                                    >
                                        <option value="" disabled>Choisir un badge...</option>
                                        {allBadges.map(badge => (
                                            <option key={badge.id} value={badge.id}>{badge.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECURITE / MOT DE PASSE */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Key className="w-4 h-4" /> Sécurité
                            </h3>
                            <form onSubmit={handlePasswordChange} className="space-y-3">
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Nouveau mot de passe</label>
                                    <input
                                        type="text"
                                        placeholder="Min. 6 caractères"
                                        className="w-full bg-black/40 w-full border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-purple-500 transition-colors"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        minLength={6}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newPassword || newPassword.length < 6 || isChangingPassword}
                                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-colors"
                                >
                                    {isChangingPassword ? "Modification..." : "Forcer ce Mot de Passe"}
                                </button>
                                <p className="text-[10px] text-gray-500 text-center mt-2 leading-tight">
                                    L'ancien mot de passe ne fonctionnera plus. Copiez-le et envoyez-le à l'élève.
                                </p>
                            </form>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: PROGRESS & HISTORY */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* PROGRESSION */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <History className="text-purple-500" />
                                Progression ({progress.length} ateliers)
                            </h2>
                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 text-gray-400 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Atelier</th>
                                            <th className="p-4">Date Validation</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {progress.map((p) => (
                                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <span className="text-xs text-gray-500 mr-2 font-mono">S{p.library_items?.week_number}</span>
                                                    <span className="font-bold text-white">{p.library_items?.title}</span>
                                                </td>
                                                <td className="p-4 text-gray-400">{new Date(p.completed_at).toLocaleDateString()}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleRevokeItem(p.id)} className="text-red-500 hover:text-red-400 text-xs uppercase font-bold px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors">
                                                        Annuler
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {progress.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-gray-500 italic">Aucune progression enregistrée.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* BADGES */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Trophy className="text-yellow-500" />
                                Badges ({userBadges.length})
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {userBadges.map((ub) => (
                                    <div key={ub.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center relative group">
                                        <button
                                            onClick={() => handleRevokeBadge(ub.id)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-all"
                                            title="Retirer"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="w-12 h-12 bg-white/10 rounded-full mb-2 flex items-center justify-center">
                                            {ub.badges?.image_url ? (
                                                <Image src={ub.badges.image_url} alt="" width={32} height={32} className="object-contain" />
                                            ) : (
                                                <Trophy className="w-6 h-6 text-yellow-500" />
                                            )}
                                        </div>
                                        <div className="font-bold text-white text-sm text-center">{ub.badges?.name}</div>
                                        <div className="text-[10px] text-gray-500 mt-1">{new Date(ub.awarded_at).toLocaleDateString()}</div>
                                    </div>
                                ))}
                                {userBadges.length === 0 && (
                                    <div className="col-span-3 text-center py-8 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                                        Aucun badge.
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}

