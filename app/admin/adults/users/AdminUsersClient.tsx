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
    is_kid?: boolean;
    deleted_at?: string;
    created_at?: string;
};

type AdminUsersClientProps = {
    profiles: Profile[]; // Use any or specific type
};

export default function AdminUsersClient({ profiles }: AdminUsersClientProps) {
    // Force Adult Mode context for this specific route
    const isKidMode = false;

    // Separate Active and Deleted, and filter by audience (is_kid)
    const filteredProfiles = profiles.filter(p => !p.is_kid);

    const activeProfiles = filteredProfiles.filter(p => !p.deleted_at);
    const deletedProfiles = filteredProfiles.filter(p => p.deleted_at);

    const btnColor = 'bg-brand-gold text-black hover:bg-brand-gold/90';

    return (
        <div className={`w-full text-white transition-colors duration-500`}>
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Gestion des Élèves (Adultes)</h1>
                            <div className={`text-sm px-2 py-0.5 rounded inline-block mt-1 uppercase font-bold tracking-wider bg-brand-gold/20 text-brand-gold`}>
                                Vue Business
                            </div>
                        </div>
                    </div>
                    <Link href="/admin/adults/users/new" className={`${btnColor} px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors`}>
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

                    {/* DELETED USERS - CORBEILLE */}
                    {deletedProfiles.length > 0 && (
                        <div className="mt-12 border-t border-white/10 pt-8">
                            <h2 className="text-xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                                <Trash2 /> Corbeille ({deletedProfiles.length})
                            </h2>
                            <div className="grid grid-cols-1 gap-4 opacity-75">
                                {deletedProfiles.map((profile) => (
                                    <UserRow key={profile.id} profile={profile} isProtected={false} basePath="/admin/adults/users" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
