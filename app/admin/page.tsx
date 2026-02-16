import Link from "next/link";
import { Sparkles, Users, Lock } from "lucide-react";

export default function AdminHubPage() {
    return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 -left-20 w-80 h-80 bg-brand-purple/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-brand-blue/10 blur-[120px] rounded-full"></div>

            <div className="max-w-4xl w-full space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        Console <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue">Admin</span>
                    </h1>
                    <p className="text-brand-text-muted text-lg max-w-md mx-auto">
                        Le poste de commande du Club des Magiciens. Choisissez votre univers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* KIDS ADMIN */}
                    <Link
                        href="/admin/kids/dashboard"
                        className="group relative bg-brand-card/50 backdrop-blur-xl border border-brand-purple/30 rounded-3xl p-8 hover:border-brand-purple transition-all shadow-2xl hover:shadow-brand-purple/20 hover:-translate-y-2 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-40 h-40 text-brand-purple" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-20 h-20 bg-brand-purple/20 rounded-2xl flex items-center justify-center mb-8 text-brand-purple shadow-inner group-hover:scale-110 transition-transform">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-brand-purple transition-colors uppercase tracking-tight">
                                Espace Kids
                            </h2>
                            <p className="text-brand-text-muted mb-10 flex-1 text-lg leading-relaxed">
                                Gérez les ateliers, la gamification, et suivez la progression magique de vos élèves.
                            </p>
                            <span className="inline-flex items-center text-brand-purple font-black uppercase tracking-widest text-sm group-hover:gap-3 transition-all">
                                Entrer dans le Club <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                            </span>
                        </div>
                        {/* Bottom Glow Effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent"></div>
                    </Link>

                    {/* ADULTS ADMIN */}
                    <Link
                        href="/admin/adults/dashboard"
                        className="group relative bg-brand-card/50 backdrop-blur-xl border border-brand-border rounded-3xl p-8 hover:border-brand-gold transition-all shadow-2xl hover:shadow-brand-gold/20 hover:-translate-y-2 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                            <Users className="w-40 h-40 text-brand-gold" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-20 h-20 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-8 text-brand-gold shadow-inner group-hover:scale-110 transition-transform">
                                <Users className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors uppercase tracking-tight">
                                Espace Adultes
                            </h2>
                            <p className="text-brand-text-muted mb-10 flex-1 text-lg leading-relaxed">
                                Pilotez l'activité business : formations, ventes, analytics et gestion clients.
                            </p>
                            <span className="inline-flex items-center text-brand-gold font-black uppercase tracking-widest text-sm group-hover:gap-3 transition-all">
                                Gérer le Business <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                            </span>
                        </div>
                        {/* Bottom Glow Effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
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
