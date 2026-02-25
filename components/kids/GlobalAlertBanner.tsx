"use client";

import { useState } from "react";
import { Megaphone, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { dismissGlobalAlert } from "@/app/kids/actions_alerts";

type Alert = {
    id: string;
    title: string;
    content: string;
    link_url?: string;
};

export default function GlobalAlertBanner({ alerts }: { alerts: Alert[] }) {
    const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>(alerts);

    if (!visibleAlerts || visibleAlerts.length === 0) return null;

    const handleDismiss = async (alertId: string) => {
        // Optimistic UI hide
        setVisibleAlerts(visibleAlerts.filter(a => a.id !== alertId));
        // Server call
        await dismissGlobalAlert(alertId);
    };

    return (
        <div className="space-y-4 mb-8">
            {visibleAlerts.map(alert => (
                <div key={alert.id} className="relative overflow-hidden bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 border border-brand-purple/50 rounded-2xl p-6 shadow-2xl shadow-brand-purple/10 flex flex-col md:flex-row gap-4 items-start md:items-center">

                    {/* Background Sparkles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-purple/30 blur-3xl rounded-full pointer-events-none mix-blend-screen"></div>

                    <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0 border border-brand-purple/50">
                        <Megaphone className="w-6 h-6 text-brand-purple" />
                    </div>

                    <div className="flex-1 pr-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                            {alert.title}
                        </h3>
                        <p className="text-brand-text-muted text-sm md:text-base leading-relaxed">
                            {alert.content}
                        </p>

                        {alert.link_url && (
                            <div className="mt-4">
                                <Link
                                    href={alert.link_url}
                                    onClick={() => handleDismiss(alert.id)}
                                    className="inline-flex items-center gap-2 bg-brand-purple hover:bg-[#a855f7] text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-purple/30 uppercase tracking-widest"
                                >
                                    Découvrir la surprise <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => handleDismiss(alert.id)}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-brand-text-muted hover:text-white rounded-full transition-colors backdrop-blur-md border border-white/5"
                        title="Masquer l'alerte"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
