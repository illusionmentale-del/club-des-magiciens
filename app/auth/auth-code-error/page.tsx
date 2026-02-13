import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-magic-bg flex items-center justify-center p-4">
            <div className="bg-magic-card border border-white/10 rounded-xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>

                <h1 className="text-2xl font-serif text-white">Lien Expiré ou Invalide</h1>

                <p className="text-gray-400 leading-relaxed">
                    Le lien de connexion que vous avez utilisé semble ne plus fonctionner. Cela arrive souvent si :
                </p>

                <ul className="text-left text-sm text-gray-400 list-disc pl-6 space-y-2">
                    <li>Le lien a déjà été utilisé une fois.</li>
                    <li>Le lien a expiré (il est valable 1h).</li>
                    <li>Vous avez ouvert le lien sur un autre appareil/navigateur.</li>
                </ul>

                <div className="pt-4">
                    <Link href="/login">
                        <button className="w-full py-3 px-4 rounded-lg bg-magic-purple hover:bg-magic-purple/90 text-white font-medium transition-all shadow-lg shadow-magic-purple/20">
                            Demander un nouveau lien
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
