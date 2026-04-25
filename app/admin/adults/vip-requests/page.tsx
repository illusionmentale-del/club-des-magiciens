import { createClient } from "@/lib/supabase/server";
import { Star, ShieldAlert } from "lucide-react";
import RequestItemAdult from "./RequestItemAdult";
import { FadeInUp } from "@/components/adults/MotionWrapper";

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
            <FadeInUp delay={0.1}>
                <header className="flex flex-col gap-4">
                    <h1 className="text-4xl font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-3">
                        <Star className="w-8 h-8 text-[#86868b]" />
                        Demandes Accès Privilège
                    </h1>
                    <p className="text-[#86868b] text-lg max-w-2xl font-light leading-relaxed">
                        Voici la liste des adultes ayant rempli le formulaire d'accès privé à l'Atelier.
                        Vérifiez le contexte pour vous assurer de la légitimité de la demande avant de valider.
                    </p>
                    <div className="flex items-center gap-3 mt-2 bg-[#2c2c2e] border border-white/5 text-[#f5f5f7] px-5 py-4 rounded-[24px] text-sm w-fit shadow-md">
                        <ShieldAlert className="w-5 h-5 text-yellow-500" />
                        Cliquez sur 'Approuver' pour générer automatiquement un accès complet et envoyer l'email d'invitation.
                    </div>
                </header>
            </FadeInUp>

            <div className="space-y-4">
                {error && (
                    <FadeInUp delay={0.2}>
                        <div className="p-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[24px]">
                            Erreur lors du chargement des demandes : {error.message}
                        </div>
                    </FadeInUp>
                )}

                {requests && requests.length === 0 && (
                    <FadeInUp delay={0.2}>
                        <div className="text-center p-16 border border-white/5 bg-[#1c1c1e] rounded-[32px] shadow-2xl">
                            <Star className="w-12 h-12 text-[#86868b] mx-auto mb-4 opacity-50" />
                            <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">Aucune demande en attente</h3>
                            <p className="text-[#86868b] font-light">Toutes les demandes d'accès ont été traitées.</p>
                        </div>
                    </FadeInUp>
                )}

                {requests && requests.map((req, index) => (
                    <FadeInUp key={req.id} delay={0.2 + (index * 0.1)}>
                        <RequestItemAdult request={req} />
                    </FadeInUp>
                ))}
            </div>
        </div>
    );
}
