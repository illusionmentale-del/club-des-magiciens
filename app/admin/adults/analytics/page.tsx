import { BarChart } from "lucide-react";

export default function AnalyticsPlaceholderPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-blue/30 transition-all rounded-[24px] flex items-center justify-center mb-6 shadow-md">
                <BarChart className="w-10 h-10 text-white relative z-10" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-4">Analytics</h1>
            <p className="text-brand-text-muted max-w-md mx-auto">
                Le module de statistiques et d'analyse financière est en cours de développement. Vous pourrez bientôt y retrouver le détail de vos ventes, l'engagement des élèves et l'évolution de l'Atelier.
            </p>
        </div>
    );
}
