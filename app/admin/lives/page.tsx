import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Video, Calendar, Play, Trash2, StopCircle } from "lucide-react";
import { updateLiveStatus, deleteLive } from "../actions";

export default async function AdminLivesPage() {
    const supabase = await createClient();
    const { data: lives } = await supabase.from("lives").select("*").order("start_date", { ascending: false });

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
                <Link href="/top-secret" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Retour au QG Admin
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                        <Video className="w-6 h-6 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Gestion des Lives</h1>
                </div>
            </header>

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Actions */}
                <div className="flex justify-end">
                    <Link href="/admin/lives/new" className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        <Calendar className="w-5 h-5" />
                        Programmer un Live
                    </Link>
                </div>

                {/* List */}
                <div className="grid gap-4">
                    {lives?.map((live) => (
                        <div key={live.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold">{live.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${live.status === 'en_cours' ? 'bg-red-500 text-white animate-pulse' :
                                        live.status === 'programmé' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {live.status === 'programmé' ? 'Bientôt' : live.status}
                                    </span>
                                </div>
                                <div className="text-gray-400 flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(live.start_date).toLocaleString()}</span>
                                    {live.platform === 'jitsi' && <span className="text-gray-500">Jitsi: {live.platform_id}</span>}
                                    {live.platform === 'vimeo' && <span className="text-gray-500">Replay Vimeo: {live.platform_id}</span>}
                                </div>
                                <div className="mt-4">
                                    <Link href={`/admin/lives/${live.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg font-bold text-sm transition-colors border border-blue-500/20">
                                        <Video className="w-4 h-4" />
                                        Ouvrir la Salle de Contrôle
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {live.status === 'programmé' && (
                                    <form action={updateLiveStatus.bind(null, live.id, 'en_cours', undefined)}>
                                        <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold flex items-center gap-2 text-sm">
                                            <Play className="w-4 h-4" />
                                            Lancer le Live (Go Live)
                                        </button>
                                    </form>
                                )}
                                {live.status === 'en_cours' && (
                                    <form action={updateLiveStatus.bind(null, live.id, 'terminé', undefined)}>
                                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold flex items-center gap-2 text-sm">
                                            <StopCircle className="w-4 h-4" />
                                            Arrêter
                                        </button>
                                    </form>
                                )}
                                {live.status === 'terminé' && live.platform !== 'vimeo' && (
                                    <Link href={`/admin/lives/${live.id}/replay`} className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg font-bold text-sm">
                                        Ajouter Replay
                                    </Link>
                                )}

                                <form action={deleteLive.bind(null, live.id)}>
                                    <button className="p-2 text-gray-500 hover:text-red-500 transition-colors" title="Supprimer">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                    {lives?.length === 0 && (
                        <div className="text-center text-gray-500 py-12 bg-white/5 rounded-2xl">
                            Aucun live programmé.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
