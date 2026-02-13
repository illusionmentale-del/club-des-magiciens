import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-magic-bg flex items-center justify-center p-4 text-white">
            <div className="max-w-md w-full bg-magic-card border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-magic-gold to-transparent"></div>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-serif text-white">Devenir Membre</h1>
                    <p className="text-gray-400">Accédez à l'élite du mentalisme.</p>
                </div>

                <div className="text-center py-4">
                    <span className="text-5xl font-serif text-magic-gold">97€</span>
                    <span className="text-gray-500 text-sm block mt-2">Paiement unique</span>
                </div>

                <ul className="space-y-4">
                    {["Accès illimité à Mentalisme Pro", "Nouveaux modules chaque mois", "Support prioritaire 7j/7", "Communauté privée"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-magic-purple/20 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-magic-purple" />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="space-y-3">
                    {/* Placeholder button until user provides sales page URL */}
                    <Button className="w-full bg-magic-gold hover:bg-magic-gold/90 text-black font-bold py-6 text-lg">
                        Rejoindre le Club
                    </Button>
                    <p className="text-center text-xs text-gray-500">
                        Redirection vers la page de paiement sécurisée.
                    </p>
                </div>

                <div className="text-center pt-4">
                    <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    )
}
