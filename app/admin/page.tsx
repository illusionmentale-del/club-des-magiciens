import Link from "next/link";
import { Sparkles, Users, Lock } from "lucide-react";

export default function AdminHubPage() {
    return (
        <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-4 relative overflow-y-auto">
            {/* Subtle central glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-lg bg-white/5 blur-[120px] rounded-full pointer-events-none fixed"></div>

            <div className="max-w-4xl w-full space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        Console <span className="text-gray-400">Admin</span>
                    </h1>
                    <p className="text-brand-text-muted text-lg max-w-md mx-auto">
                        Le poste de commande du Club des Magiciens. Choisissez votre univers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* KIDS ADMIN */}
                    <Link
                        href="/admin/kids/dashboard"
                        className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles className="w-40 h-40 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-white border border-white/10 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-300 transition-colors tracking-tight">
                                Espace Kids
                            </h2>
                            <p className="text-gray-400 mb-10 flex-1 text-sm leading-relaxed">
                                Gérez les ateliers, la gamification, et suivez la progression magique de vos élèves.
                            </p>
                            <span className="inline-flex items-center text-white font-bold text-sm group-hover:gap-3 transition-all">
                                Entrer dans le Club <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                            </span>
                        </div>
                        {/* Bottom subtle line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10"></div>
                    </Link>

                    {/* ADULTS ADMIN */}
                    <Link
                        href="/admin/adults/dashboard"
                        className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users className="w-40 h-40 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-white border border-white/10 group-hover:scale-110 transition-transform">
                                <Users className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-300 transition-colors tracking-tight">
                                Espace Adultes
                            </h2>
                            <p className="text-gray-400 mb-10 flex-1 text-sm leading-relaxed">
                                Pilotez l'activité business : formations, ventes, analytics et gestion clients.
                            </p>
                            <span className="inline-flex items-center text-white font-bold text-sm group-hover:gap-3 transition-all">
                                Gérer le Business <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                            </span>
                        </div>
                        {/* Bottom subtle line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10"></div>
                    </Link>
                </div>

                <div className="text-center mt-8">
                    <Link href="/" className="text-brand-text-muted hover:text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                        ← Retour au site public
                    </Link>
                </div>
            </div>
        </div>
    );
}
