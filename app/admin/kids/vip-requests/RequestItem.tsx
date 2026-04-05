"use client";

import { useState } from "react";
import { approveVipRequest, rejectVipRequest } from "@/app/admin/actions_vip";
import { Check, X, Mail, MapPin, Calendar, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RequestItem({ request }: { request: any }) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const handleApprove = async () => {
        setIsApproving(true);
        const res = await approveVipRequest(request.id) as any;
        setIsApproving(false);
        
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Demande approuvée avec succès !");
        }
    };

    const handleReject = async () => {
        if (!confirm("Voulez-vous vraiment refuser cette demande ?")) return;
        setIsRejecting(true);
        const res = await rejectVipRequest(request.id) as any;
        setIsRejecting(false);
        
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Demande refusée.");
        }
    };

    if (request.status !== 'en_attente') return null;

    return (
        <div className="bg-brand-card border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-purple/30 transition-colors">
            <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 relative">
                    <div className="w-10 h-10 bg-brand-purple/20 rounded-full flex items-center justify-center text-brand-purple font-bold">
                        {request.child_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{request.child_name}</h3>
                        <p className="text-brand-text-muted text-sm flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {request.parent_email}
                        </p>
                    </div>
                </div>

                <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-2">
                    <p className="text-sm text-brand-text-muted font-bold uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-gold" />
                        Où / Quand m'avez-vous vu ?
                    </p>
                    <p className="text-white italic">"{request.context}"</p>
                </div>
                
                <p className="text-xs text-brand-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Demandé le {new Date(request.created_at).toLocaleDateString("fr-FR", { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            <div className="flex flex-row md:flex-col gap-3">
                <button 
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
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
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                    Refuser
                </button>
            </div>
        </div>
    );
}
