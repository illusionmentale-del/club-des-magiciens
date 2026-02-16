import Link from "next/link";
import { Sparkles, Users, Lock } from "lucide-react";

export default function AdminHubPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Console d'Administration</h1>
                    <p className="text-slate-500">Choisissez l'univers que vous souhaitez gérer.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* KIDS ADMIN */}
                    <Link
                        href="/admin/kids/dashboard"
                        className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-brand-purple transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-32 h-32 text-brand-purple" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-brand-purple/10 rounded-xl flex items-center justify-center mb-6 text-brand-purple">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-brand-purple transition-colors">
                                Espace Kids
                            </h2>
                            <p className="text-slate-500 mb-8 flex-1">
                                Gestion du Club des Magiciens : Ateliers, Gamification, Progression des élèves et Contenus.
                            </p>
                            <span className="inline-flex items-center text-brand-purple font-bold uppercase tracking-wider text-sm">
                                Accéder à la console <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </div>
                    </Link>

                    {/* ADULTS ADMIN */}
                    <Link
                        href="/admin/adults/dashboard"
                        className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="w-32 h-32 text-slate-800" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-800">
                                <Users className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
                                Espace Adultes
                            </h2>
                            <p className="text-slate-500 mb-8 flex-1">
                                Gestion Business : Formations, Ventes, Abonnements, Analytics et Clients.
                            </p>
                            <span className="inline-flex items-center text-slate-800 font-bold uppercase tracking-wider text-sm">
                                Accéder à la console <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="text-center mt-12">
                    <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">
                        ← Retour au site public
                    </Link>
                </div>
            </div>
        </div>
    );
}
