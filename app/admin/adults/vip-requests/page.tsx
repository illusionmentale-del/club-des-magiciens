import { createClient } from "@/lib/supabase/server";
import { Star, ShieldAlert } from "lucide-react";
import RequestItemAdult from "./RequestItemAdult";

export const dynamic = 'force-dynamic';

export default async function AdultVIPRequestsPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    // Fetch pending VIP requests bypassing RLS (secured by admin layout)
    const { data: requests, error } = await supabaseAdmin
        .from("adult_vip_requests")
        .select("*")
        .eq("status", "en_attente")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    <Star className="w-8 h-8 text-magic-royal" />
                    Demandes Accès Privilège (Atelier)
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Voici la liste des adultes ayant rempli le formulaire d'accès privé.
                    Vérifiez le contexte pour vous assurer que vous avez bien rencontré cette personne avant de valider.
                </p>
                <div className="flex items-center gap-2 mt-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 px-4 py-2 rounded-none text-sm w-fit">
                    <ShieldAlert className="w-4 h-4" />
                    Cliquez sur 'Approuver' pour générer un accès à l'Atelier et envoyer un email d'invitation automatiquement.
                </div>
            </header>

            <div className="space-y-4">
                {error && (
                    <div className="p-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-none">
                        Erreur lors du chargement des demandes : {error.message}
                    </div>
                )}

                {requests && requests.length === 0 && (
                    <div className="text-center p-12 border border-white/5 bg-[#100b1a] rounded-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
                        <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2 font-serif">Aucune demande en attente</h3>
                        <p className="text-slate-400">Toutes les demandes ont été traitées.</p>
                    </div>
                )}

                {requests && requests.map(req => (
                    <RequestItemAdult key={req.id} request={req} />
                ))}
            </div>
        </div>
    );
}
