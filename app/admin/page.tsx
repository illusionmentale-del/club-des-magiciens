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
                        className="group relative bg-[#100b1a] border border-white/5 rounded-3xl p-10 hover:border-brand-purple/50 transition-all duration-500 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden hover:-translate-y-2"
                    >
                        {/* Background glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                            <Sparkles className="w-48 h-48 text-brand-purple" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-20 h-20 bg-brand-purple/10 rounded-2xl flex items-center justify-center mb-8 text-brand-purple border border-brand-purple/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-brand-purple transition-all duration-500 mb-4 tracking-tight">
                                Espace Kids
                            </h2>
                            <p className="text-brand-text-muted mb-10 flex-1 text-base leading-relaxed">
                                Gérez les ateliers, la gamification, et suivez la progression magique de vos élèves.
                            </p>
                            <span className="inline-flex items-center text-brand-purple font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                                Entrer dans le Club <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                            </span>
                        </div>
                        {/* Bottom neon line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Link>

                    {/* ADULTS ADMIN */}
                    <Link
                        href="/admin/adults/dashboard"
                        className="group relative bg-[#100b1a] border border-white/5 rounded-3xl p-10 hover:border-brand-purple/50 transition-all duration-500 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden hover:-translate-y-2"
                    >
                        {/* Background glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                            <Users className="w-48 h-48 text-brand-purple" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-20 h-20 bg-brand-purple/10 rounded-2xl flex items-center justify-center mb-8 text-brand-purple border border-brand-purple/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                <Users className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-brand-purple transition-all duration-500 mb-4 tracking-tight">
                                Espace Adultes
                            </h2>
                            <p className="text-brand-text-muted mb-10 flex-1 text-base leading-relaxed">
                                Pilotez l'activité business : formations, ventes, analytics et gestion clients.
                            </p>
                            <span className="inline-flex items-center text-brand-purple font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                                Gérer le Business <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                            </span>
                        </div>
                        {/* Bottom neon line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
