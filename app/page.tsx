export const dynamic = 'force-dynamic';

export default function Home() {
  // Le middleware gère la redirection racine pour tout le monde :
  // Non-connecté => /tarifs/kids
  // Connecté Enfant => /kids
  // Connecté Admin => /dashboard
  // Ce composant ne s'affichera donc théoriquement jamais en production.

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-magic-purple border-t-transparent rounded-full"></div>
    </div>
  );
}
