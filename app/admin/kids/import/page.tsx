import CsvImporter from "@/components/admin/CsvImporter";
import { Download, Info } from "lucide-react";

export const metadata = {
    title: "Importation Contacts | Administration",
};

export default function ImportUsersPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                    Importation Contacts <span className="text-brand-purple">Systeme.io</span>
                </h1>
                <p className="text-gray-500 text-lg">
                    Transférez vos anciens clients vers la nouvelle plateforme en un clic.
                </p>
            </header>

            <div className="bg-blue-50 border border-blue-100 rounded-[24px] p-6 flex gap-4 items-start">
                <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-blue-900 mb-2">Comment fonctionne cet outil ?</h4>
                    <ul className="text-blue-800 text-sm space-y-2 list-disc list-inside">
                        <li>Exportez vos contacts depuis Systeme.io au format <strong>.csv</strong>.</li>
                        <li>Glissez le fichier ci-dessous et associez les colonnes <strong>E-mail</strong> et <strong>Prénom</strong>.</li>
                        <li>L'outil va automatiquement créer leur compte sécurisé et débloquer leur <strong>accès Enfant (Club des Petits Magiciens)</strong>.</li>
                        <li>Chaque contact recevra un <strong>E-mail Magique d'Activation</strong> l'invitant à choisir son mot de passe pour se connecter immédiatement.</li>
                    </ul>
                </div>
            </div>

            <CsvImporter />

        </div>
    );
}
