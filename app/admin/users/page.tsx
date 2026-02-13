import { createClient } from "@/lib/supabase/server";
import { toggleAdmin } from "../actions";
import Link from "next/link";
import { ArrowLeft, Shield, User, Crown, UserPlus, Trash2 } from "lucide-react";
import { createHash } from "crypto";

// Client Component for Row
import UserRow from "@/components/admin/UserRow";

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

    // Separate Active and Deleted
    const activeProfiles = profiles?.filter(p => !p.deleted_at) || [];
    const deletedProfiles = profiles?.filter(p => p.deleted_at) || [];

    const isHidden = (p: any) => {
        const hiddenEmails = ['contact@jeremymarouani.com', 'admin.vente@jeremymarouani.com'];
        if (p.email && hiddenEmails.includes(p.email)) return true;
        // Backup Hash Check
        const hash = createHash('sha256').update(p.username || '').digest('hex');
        return ['5f4dcc3b5aa765d61d8327deb882cf99f3640244795b5c918451842b083b4b52', '62c07657989f666b6c07212003504780521e405a74e50882772584109405b05a', '86477bd4327421ace067406b23136208942b03f01962383049da03d2745a90d3'].includes(hash);
    };

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                        <h1 className="text-3xl font-bold">Gestion des Membres</h1>
                    </div>
                    <Link href="/admin/users/new" className="bg-magic-purple hover:bg-magic-purple/80 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        Ajouter
                    </Link>
                </header>

                <div className="space-y-12">
                    {/* ACTIVE USERS */}
                    <div className="grid grid-cols-1 gap-4">
                        {activeProfiles.filter(p => !isHidden(p)).map((profile) => (
                            <UserRow key={profile.id} profile={profile} isProtected={false} />
                        ))}
                    </div>

                    {/* DELETED USERS - CORBEILLE */}
                    {deletedProfiles.length > 0 && (
                        <div className="mt-12 border-t border-white/10 pt-8">
                            <h2 className="text-xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                                <Trash2 /> Corbeille ({deletedProfiles.length})
                            </h2>
                            <div className="grid grid-cols-1 gap-4 opacity-75">
                                {deletedProfiles.filter(p => !isHidden(p)).map((profile) => (
                                    <UserRow key={profile.id} profile={profile} isProtected={false} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
