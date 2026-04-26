"use client";

import { useState } from "react";
import { approveAdultVipRequest, rejectAdultVipRequest } from "@/app/admin/actions_vip_adults";
import { Check, X, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { BentoHoverEffect } from "@/components/adults/MotionWrapper";

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
        <div className="bg-[#100b1a] bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-blue/30 transition-all rounded-[32px] p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-brand-blue/30 transition-colors">
            <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4 relative">
                    <div className="w-14 h-14 bg-[#2c2c2e] flex items-center justify-center text-brand-text font-semibold text-xl rounded-full shadow-md">
                        {request.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-brand-text text-xl tracking-tight">{request.full_name}</h3>
                        <p className="text-brand-text-muted text-sm flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4" /> {request.email}
                        </p>
                    </div>
                </div>

                <div className="bg-black/30 rounded-[24px] p-5 border border-white/5 space-y-2">
                    <p className="text-sm text-brand-text font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-text-muted" />
                        Contexte de rencontre
                    </p>
                    <p className="text-brand-text-muted font-light leading-relaxed">"{request.context}"</p>
                </div>
                
                <p className="text-xs text-brand-text-muted flex items-center gap-2 font-medium">
                    <Clock className="w-3 h-3" /> Demandé le {new Date(request.created_at).toLocaleDateString("fr-FR", { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            <div className="flex flex-row md:flex-col gap-3">
                <button 
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-blue hover:bg-indigo-500 text-black shadow-lg hover:shadow-brand-blue/30 hover:scale-105 px-6 py-4 rounded-full font-medium transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:scale-105"
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
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-transparent hover:bg-red-500/10 text-red-500 border border-red-500/30 px-6 py-4 rounded-full font-medium transition-all disabled:opacity-50 hover:scale-105"
                >
                    <X className="w-5 h-5" />
                    Refuser
                </button>
            </div>
        </div>
    );
}
