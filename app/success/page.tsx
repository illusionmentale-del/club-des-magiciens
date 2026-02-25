import Link from "next/link";
import { Sparkles, MailOpen, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-[#0F0A1F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Décoration Galaxie */}
            <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/20 via-[#0F0A1F] to-[#0F0A1F] opacity-50 pointer-events-none"></div>

            <div className="w-full max-w-md z-10 text-center">
                <div className="mb-8 relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                    <CheckCircle2 className="w-24 h-24 text-green-400 relative z-10 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-brand-purple"></div>

                    <h1 className="text-3xl font-black mb-4 tracking-tight">Paiement Réussi !</h1>
                    <p className="text-xl text-brand-purple font-bold mb-6 flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Bienvenue au Club
                        <Sparkles className="w-5 h-5" />
                    </p>

                    <div className="bg-black/30 rounded-xl p-5 mb-8 border border-white/5 text-left text-sm text-gray-300 space-y-3">
                        <p>
                            Ton abonnement est validé et ton compte (sans mot de passe) vient d'être généré automatiquement.
                        </p>
                        <p className="font-semibold text-white flex items-center gap-2">
                            <MailOpen className="w-5 h-5 text-brand-purple" />
                            Regarde vite tes emails !
                        </p>
                        <p>
                            Nous t'avons envoyé un message avec un <strong className="text-brand-purple">lien d'accès magique</strong>. Clique dessus pour te connecter en un clic à ton nouvel espace.
                        </p>
                        <p className="text-xs text-gray-500 italic mt-2">
                            (Pense à vérifier tes spams si tu ne le trouves pas)
                        </p>
                    </div>

                    <Link
                        href="/login"
                        className="inline-flex w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all justify-center items-center gap-2 border border-white/10"
                    >
                        Aller vers la page de connexion <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
