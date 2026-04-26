import { Euro, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { FadeInUp, BentoHoverEffect } from "@/components/adults/MotionWrapper";

export default function AdultsDashboardPage() {
    return (
        <div className="space-y-8">
            <FadeInUp delay={0.1}>
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-brand-text">Tableau de bord Business</h1>
                    <p className="text-xl text-brand-text-muted font-light mt-2">Vue d'ensemble de l'activité commerciale de l'Atelier.</p>
                </div>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FadeInUp delay={0.2} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/30 transition-all rounded-[32px] p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <Euro className="h-6 w-6 text-brand-text opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-brand-text-muted mb-4">Chiffre d'Affaires</h3>
                                <div className="text-4xl font-semibold tracking-tight text-brand-text">12,450 €</div>
                            </div>
                            <div className="mt-6 flex items-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                    +12%
                                </span>
                                <span className="ml-2 text-xs text-brand-text-muted">ce mois-ci</span>
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>

                <FadeInUp delay={0.3} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/30 transition-all rounded-[32px] p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <Users className="h-6 w-6 text-brand-text opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-brand-text-muted mb-4">Clients Actifs</h3>
                                <div className="text-4xl font-semibold tracking-tight text-brand-text">340</div>
                            </div>
                            <div className="mt-6 text-sm font-light text-brand-text-muted">
                                Formations & Produits
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>

                <FadeInUp delay={0.4} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/30 transition-all rounded-[32px] p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <ShoppingBag className="h-6 w-6 text-brand-text opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-brand-text-muted mb-4">Ventes (Semaine)</h3>
                                <div className="text-4xl font-semibold tracking-tight text-brand-text">24</div>
                            </div>
                            <div className="mt-6 text-sm font-light text-brand-text-muted truncate">
                                Coffre Découverte
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>

                <FadeInUp delay={0.5} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/30 transition-all rounded-[32px] p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <TrendingUp className="h-6 w-6 text-brand-text opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-brand-text-muted mb-4">Taux de Conversion</h3>
                                <div className="text-4xl font-semibold tracking-tight text-brand-text">3.2%</div>
                            </div>
                            <div className="mt-6 text-sm font-light text-brand-text-muted">
                                Vitrine Principale
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>
            </div>
        </div>
    );
}
