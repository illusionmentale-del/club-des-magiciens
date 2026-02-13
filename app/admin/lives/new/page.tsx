import { createLive } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewLivePage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <Link href="/admin/lives" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                </Link>

                <div className="bg-magic-card border border-white/10 p-8 rounded-2xl">
                    <h1 className="text-3xl font-bold mb-8 text-magic-gold">Programmer un Live</h1>

                    <form action={createLive} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Titre de l'événement</label>
                            <input name="title" required placeholder="Ex: Masterclass Cartomagie #4" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Cible (Audience)</label>
                            <select name="audience" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors">
                                <option value="adults">Adultes (Standard)</option>
                                <option value="kids">Enfants (Club des Petits Magiciens)</option>
                                <option value="all">Tout le monde</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Date et Heure</label>
                                <input name="start_date" type="datetime-local" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors [color-scheme:dark]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Nom de la Salle Jitsi (Lien)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-gray-500 select-none">meet.jit.si/</span>
                                    <input name="platform_id" required placeholder="ClubMagiciens-Live-Secret" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-32 text-white placeholder-gray-600 focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 mt-8">
                            <Save className="w-5 h-5" />
                            Confirmer la programmation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
