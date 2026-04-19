import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShieldAlert, MonitorSmartphone, XCircle, LogOut } from "lucide-react";
import { revokeDevice } from "@/app/actions/devices";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default async function DeviceLimitPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: devices } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', user.id)
        .order('last_active_at', { ascending: false });

    const registeredDevices = devices || [];

    // If somehow they reached here but don't have 2 devices, send them back
    if (registeredDevices.length < 2) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="max-w-xl w-full bg-zinc-950 border border-red-500/30 rounded-3xl p-8 relative z-10 shadow-2xl">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-black mb-2 text-white tracking-tight">Limite d'appareils atteinte</h1>
                    <p className="text-gray-400">
                        Votre compte est strictement personnel. Seuls 2 appareils peuvent être connectés simultanément. Vous utilisez un nouvel appareil non reconnu.
                    </p>
                </div>

                <div className="mb-8">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mb-3">
                        Appareils actuellement connectés (2/2) :
                    </div>
                    <div className="space-y-3">
                        {registeredDevices.map((d) => (
                            <div key={d.device_id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                                        <MonitorSmartphone className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-white leading-tight">{d.device_name || 'Appareil inconnu'}</div>
                                        <div className="text-xs text-gray-500">
                                            Connecté il y a {formatDistanceToNow(new Date(d.last_active_at), { addSuffix: false, locale: fr })}
                                        </div>
                                    </div>
                                </div>
                                <form action={revokeDevice.bind(null, d.device_id)}>
                                    <button 
                                        type="submit"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                                        title="Déconnecter cet appareil"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        <span className="hidden sm:inline">Déconnecter</span>
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-200/80 mb-8 space-y-2">
                    <p><strong>Que faire ?</strong></p>
                    <p>Déconnectez un appareil existant ci-dessus pour libérer la place, ce qui autorisera automatiquement l'appareil que vous utilisez en ce moment.</p>
                </div>

                <div className="flex justify-center border-t border-zinc-800 pt-6">
                    <form action="/auth/signout" method="POST">
                        <button type="submit" className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                            <LogOut className="w-4 h-4" />
                            Me déconnecter d'ici
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
