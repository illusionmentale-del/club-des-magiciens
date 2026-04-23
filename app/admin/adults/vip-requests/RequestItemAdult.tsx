"use client";

import { useState } from "react";
import { approveAdultVipRequest, rejectAdultVipRequest } from "@/app/admin/actions_vip_adults";
import { Check, X, Mail, MapPin, Calendar, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RequestItemAdult({ request }: { request: any }) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const handleApprove = async () => {
        setIsApproving(true);
        const res = await approveAdultVipRequest(request.id) as any;
        setIsApproving(false);
        
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success(res.message || "Demande approuvée avec succès ! Un accès vient d'être généré.");
        }
    };

    const handleReject = async () => {
        if (!confirm("Voulez-vous vraiment refuser cette demande ?")) return;
        setIsRejecting(true);
        const res = await rejectAdultVipRequest(request.id) as any;
        setIsRejecting(false);
        
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Demande refusée.");
        }
    };

    if (request.status !== 'en_attente') return null;

    return (
        <div className="bg-[#100b1a] border border-white/10 rounded-none p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-magic-royal/30 transition-colors">
            <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 relative">
                    <div className="w-10 h-10 bg-magic-royal/20 flex items-center justify-center text-magic-royal font-bold rounded-none">
                        {request.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg font-serif">{request.full_name}</h3>
                        <p className="text-slate-400 text-sm flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3" /> {request.email}
                        </p>
                    </div>
                </div>

                <div className="bg-black rounded-none p-4 border border-white/5 space-y-2">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-magic-royal" />
                        Où / Quand m'avez-vous vu ?
                    </p>
                    <p className="text-white italic">"{request.context}"</p>
                </div>
                
                <p className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> Demandé le {new Date(request.created_at).toLocaleDateString("fr-FR", { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            <div className="flex flex-row md:flex-col gap-3">
                <button 
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 px-6 py-3 rounded-none font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50"
                >
                    {isApproving ? "Création..." : (
                        <>
                            <Check className="w-5 h-5" />
                            Approuver
                        </>
                    )}
                </button>
                <button 
                    onClick={handleReject}
                    disabled={isApproving || isRejecting}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-3 rounded-none font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                    Refuser
                </button>
            </div>
        </div>
    );
}
