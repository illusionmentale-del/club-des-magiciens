"use client";

import { UserPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import UserRow from "@/components/admin/UserRow";

type Profile = {
    id: string;
    email?: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    role?: string;
    access_level?: string;
    is_kid?: boolean;
    deleted_at?: string;
    created_at?: string;
    has_kids_access?: boolean;
    has_adults_access?: boolean;
};

type AdminUsersClientProps = {
    profiles: Profile[]; // Use any or specific type
};

export default function AdminUsersClient({ profiles }: AdminUsersClientProps) {
    // Force Adult Mode context for this specific route
    const isKidMode = false;

    // Filter by access_level or explicit boolean flag
    const filteredProfiles = profiles.filter(p => p.access_level !== 'kid' || p.has_adults_access === true);

    const activeProfiles = filteredProfiles.filter(p => !p.deleted_at);
    const deletedProfiles = filteredProfiles.filter(p => p.deleted_at);

    const btnColor = 'bg-brand-blue hover:bg-indigo-500 text-white rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all';

    return (
        <div className={`w-full text-white transition-colors duration-500`}>
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Gestion des Élèves (Adultes)</h1>
                            <div className={`text-sm px-2 py-0.5 rounded inline-block mt-1 uppercase font-bold tracking-wider bg-white/5 text-brand-blue border border-white/10 shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all`}>
                                Vue Business
                            </div>
                        </div>
                    </div>
                    <Link href="/admin/adults/users/new" className={`${btnColor} px-6 py-3 font-bold flex items-center gap-2 transition-colors`}>
                        <UserPlus className="w-4 h-4" />
                        Ajouter
                    </Link>
                </header>

                <div className="space-y-12">
                    {/* ACTIVE USERS */}
                    <div className="grid grid-cols-1 gap-4">
                        {activeProfiles.map((profile) => (
                            <UserRow key={profile.id} profile={profile} isProtected={false} basePath="/admin/adults/users" />
                        ))}
                        {activeProfiles.length === 0 && (
                            <div className="text-gray-500 italic p-8 text-center bg-white/5 rounded-2xl">
                                Aucun membre {isKidMode ? 'enfant' : 'adulte'} trouvé.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
