import { createCourse } from "../../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewCoursePage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header>
                <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Link>
                <h1 className="text-3xl font-serif text-white">Créer un nouveau cours</h1>
                <p className="text-gray-400">Remplissez les informations ci-dessous pour créer une nouvelle formation.</p>
            </header>

            <form action={createCourse} className="space-y-6 bg-slate-900 p-8 rounded-xl border border-white/10">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Titre du cours</label>
                    <input
                        name="title"
                        required
                        placeholder="Ex: Mentalisme Pro"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-magic-purple"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="Une description accrocheuse..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-magic-purple"
                    ></textarea>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Image de couverture (URL)</label>
                    <input
                        name="imageUrl"
                        placeholder="https://..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-magic-purple"
                    />
                    <p className="text-xs text-gray-500">Pour l'instant, mettez une URL d'image. L'upload viendra plus tard.</p>
                </div>

                <button type="submit" className="w-full bg-magic-purple hover:bg-magic-purple/90 text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    Créer le cours
                </button>
            </form>
        </div>
    );
}
