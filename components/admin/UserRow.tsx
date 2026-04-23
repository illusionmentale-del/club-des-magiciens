"use client";

import { useState } from "react";
import { User, Crown, Trash2, X, Save, Mail } from "lucide-react";
import { updateUserAccess, deleteUserEntity, addTag, removeTag, toggleAdmin, resendWelcomeEmail } from "@/app/admin/actions";
import Link from "next/link";

interface UserRowProps {
    profile: any;
    isProtected: boolean;
    basePath?: string;
}

export default function UserRow({ profile, isProtected, basePath }: UserRowProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleDelete = async () => {
        if (confirm("⚠️ Êtes-vous sûr de vouloir supprimer définitivement ce membre ?\n\nCette action est IRRÉVERSIBLE. L'utilisateur sera supprimé de la base de données.")) {
            setIsDeleting(true);
            await deleteUserEntity(profile.id);
            // On succesful deletion, the row will be unmounted due to list refresh
        }
    };

    const handleResendEmail = async () => {
        if (!profile.email) return;
        if (confirm(`Renvoyer l'email de bienvenue à ${profile.email} ?`)) {
            setIsResending(true);
            const res = await resendWelcomeEmail(profile.email, profile.username || 'Magicien');
            setIsResending(false);
            if (res.error) {
                alert("Erreur lors de l'envoi : " + res.error);
            } else {
                alert("Email renvoyé avec succès ! 📩");
            }
        }
    };

    return (
        <div className="bg-[#100b1a] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
            {/* INFO */}
            <div className="flex items-center gap-4 min-w-[250px]">
                {basePath ? (
                    <Link href={`${basePath}/${profile.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity w-full">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl relative ${profile.role === 'admin' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-magic-purple text-white'}`}>
                            {profile.username?.[0]?.toUpperCase() || profile.full_name?.[0]?.toUpperCase() || <User />}
                        </div>
                        <div>
                            <div className="font-bold text-lg flex items-center gap-2 group-hover:text-magic-gold transition-colors">
                                {profile.username || profile.full_name || "Sans Pseudo"}
                                {profile.role === 'admin' && <Crown className="w-4 h-4 text-yellow-400" />}
                            </div>
                            <div className="text-sm text-gray-500">ID: {profile.id.slice(0, 8)}...</div>
                            <div className="text-sm text-gray-400">{profile.email || "Email masqué"}</div>
                        </div>
                    </Link>
                ) : (
                    <>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl relative ${profile.role === 'admin' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-magic-purple text-white'}`}>
                            {profile.username?.[0]?.toUpperCase() || profile.full_name?.[0]?.toUpperCase() || <User />}
                        </div>
                        <div>
                            <div className="font-bold text-lg flex items-center gap-2">
                                {profile.username || profile.full_name || "Sans Pseudo"}
                                {profile.role === 'admin' && <Crown className="w-4 h-4 text-yellow-400" />}
                            </div>
                            <div className="text-sm text-gray-500">ID: {profile.id.slice(0, 8)}...</div>
                            <div className="text-sm text-gray-400">{profile.email || "Email masqué"}</div>
                        </div>
                    </>
                )}
            </div>

            {/* ACCESS LEVEL */}
            <div className="flex-1 opacity-100 disabled:opacity-50">
                <form action={updateUserAccess.bind(null, profile.id)} className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            key={profile.access_level}
                            name="access_level"
                            defaultValue={profile.access_level || 'adult'}
                            className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-sm appearance-none cursor-pointer hover:border-magic-purple transition-colors focus:outline-none focus:border-magic-purple pr-8 disabled:opacity-50 disabled:cursor-not-allowed"
                            onChange={(e) => e.target.form?.requestSubmit()}
                        >
                            <option value="adult">Adulte / Standard</option>
                            <option value="kid">Enfant / Kids</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                </form>
            </div>

            {/* TAGS */}
            <div className="flex-1 flex flex-wrap gap-2 items-center">
                {profile.tags?.map((tag: string) => (
                    <span key={tag} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        {tag}
                        <form action={removeTag.bind(null, profile.id, tag)}><button className="hover:text-red-400"><X className="w-3 h-3" /></button></form>
                    </span>
                ))}
                <form action={addTag.bind(null, profile.id)} className="flex items-center">
                    <input name="new_tag" placeholder="+ Tag" className="bg-transparent border-b border-white/20 text-xs w-16 focus:w-24 transition-all focus:border-magic-purple outline-none px-1 py-1" />
                </form>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2 min-w-[120px] text-right">
                {!isProtected && (
                    <>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-red-400 hover:text-red-300 text-sm flex items-center justify-end gap-2 w-full transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> {isDeleting ? '...' : 'Supprimer'}
                        </button>

                        {profile.email && !isDeleting && (
                            <button
                                onClick={handleResendEmail}
                                disabled={isResending}
                                className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-end gap-2 w-full transition-colors"
                                title="Renvoyer l'email de bienvenue"
                            >
                                <Mail className="w-4 h-4" /> {isResending ? '...' : 'Renvoyer Email'}
                            </button>
                        )}
                    </>
                )}

                <form action={toggleAdmin.bind(null, profile.id, profile.role === 'admin' ? 'user' : 'admin')}>
                    <button className="text-gray-500 hover:text-white text-xs w-full text-right underline">
                        {profile.role === 'admin' ? 'Retirer Admin' : 'Passer Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
}
