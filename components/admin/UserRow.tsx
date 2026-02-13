"use client";

import { useState } from "react";
import { User, Crown, Trash2, X, RefreshCcw, Save } from "lucide-react";
import { updateUserAccess, deleteUserEntity, restoreUserEntity, addTag, removeTag, toggleAdmin } from "@/app/admin/actions";

// Need to define props interface based on profile shape
interface UserRowProps {
    profile: any;
    isProtected: boolean;
}

export default function UserRow({ profile, isProtected }: UserRowProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce membre ?\n\nIl ne pourra plus se connecter, mais vous pourrez le restaurer depuis la liste des supprimés.")) {
            setIsDeleting(true);
            await deleteUserEntity(profile.id);
            setIsDeleting(false);
        }
    };

    const handleRestore = async () => {
        if (confirm("Restaurer ce membre et réactiver son accès ?")) {
            await restoreUserEntity(profile.id);
        }
    };

    const isDeleted = !!profile.deleted_at;

    return (
        <div className={`bg-magic-card border ${isDeleted ? 'border-red-900 bg-red-900/10' : 'border-white/10'} rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all`}>
            {/* INFO */}
            <div className="flex items-center gap-4 min-w-[250px]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl relative ${profile.role === 'admin' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-magic-purple text-white'} ${isDeleted ? 'grayscale opacity-50' : ''}`}>
                    {profile.username?.[0]?.toUpperCase() || <User />}
                    {isDeleted && <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"><X className="w-8 h-8 text-red-500" /></div>}
                </div>
                <div>
                    <div className="font-bold text-lg flex items-center gap-2">
                        {profile.username || "Sans Pseudo"}
                        {profile.role === 'admin' && <Crown className="w-4 h-4 text-yellow-400" />}
                        {isDeleted && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">SUPPRIMÉ</span>}
                    </div>
                    <div className="text-sm text-gray-500">ID: {profile.id.slice(0, 8)}...</div>
                    <div className="text-sm text-gray-400">{profile.email || "Email masqué"}</div>
                </div>
            </div>

            {/* ACCESS LEVEL */}
            <div className="flex-1 opacity-100 disabled:opacity-50">
                <form action={updateUserAccess.bind(null, profile.id)} className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            name="access_level"
                            defaultValue={profile.access_level || 'adult'}
                            disabled={isDeleted}
                            className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-sm appearance-none cursor-pointer hover:border-magic-purple transition-colors focus:outline-none focus:border-magic-purple pr-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onChange={(e) => e.target.form?.requestSubmit()}
                        >
                            <option value="adult">Adulte / Standard</option>
                            <option value="kid">Enfant / Kids</option>
                        </select>
                        {!isDeleted && <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>}
                    </div>
                </form>
            </div>

            {/* TAGS */}
            <div className={`flex-1 flex flex-wrap gap-2 items-center ${isDeleted ? 'opacity-50 pointer-events-none' : ''}`}>
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
                        {isDeleted ? (
                            <button
                                onClick={handleRestore}
                                className="text-green-400 hover:text-green-300 text-sm flex items-center justify-end gap-2 w-full transition-colors font-bold"
                            >
                                <RefreshCcw className="w-4 h-4" /> Restaurer
                            </button>
                        ) : (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-red-400 hover:text-red-300 text-sm flex items-center justify-end gap-2 w-full transition-colors"
                            >
                                <Trash2 className="w-4 h-4" /> {isDeleting ? '...' : 'Supprimer'}
                            </button>
                        )}
                    </>
                )}
                {!isDeleted && (
                    <form action={toggleAdmin.bind(null, profile.id, profile.role === 'admin' ? 'user' : 'admin')}>
                        <button className="text-gray-500 hover:text-white text-xs w-full text-right underline">
                            {profile.role === 'admin' ? 'Retirer Admin' : 'Passer Admin'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
