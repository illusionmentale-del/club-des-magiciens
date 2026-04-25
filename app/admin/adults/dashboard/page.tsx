import { Euro, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { FadeInUp, BentoHoverEffect } from "@/components/adults/MotionWrapper";

export default function AdultsDashboardPage() {
    return (
        <div className="space-y-8">
            <FadeInUp delay={0.1}>
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-[#f5f5f7]">Tableau de bord Business</h1>
                    <p className="text-xl text-[#86868b] font-light mt-2">Vue d'ensemble de l'activité commerciale de l'Atelier.</p>
                </div>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FadeInUp delay={0.2} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#1c1c1e] rounded-[32px] p-6 h-full flex flex-col justify-between border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <Euro className="h-6 w-6 text-[#f5f5f7] opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#86868b] mb-4">Chiffre d'Affaires</h3>
                                <div className="text-4xl font-semibold tracking-tight text-[#f5f5f7]">12,450 €</div>
                            </div>
                            <div className="mt-6 flex items-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                    +12%
                                </span>
                                <span className="ml-2 text-xs text-[#86868b]">ce mois-ci</span>
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>

                <FadeInUp delay={0.3} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#1c1c1e] rounded-[32px] p-6 h-full flex flex-col justify-between border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <Users className="h-6 w-6 text-[#f5f5f7] opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#86868b] mb-4">Clients Actifs</h3>
                                <div className="text-4xl font-semibold tracking-tight text-[#f5f5f7]">340</div>
                            </div>
                            <div className="mt-6 text-sm font-light text-[#86868b]">
                                Formations & Produits
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>

                <FadeInUp delay={0.4} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#1c1c1e] rounded-[32px] p-6 h-full flex flex-col justify-between border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <ShoppingBag className="h-6 w-6 text-[#f5f5f7] opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#86868b] mb-4">Ventes (Semaine)</h3>
                                <div className="text-4xl font-semibold tracking-tight text-[#f5f5f7]">24</div>
                            </div>
                            <div className="mt-6 text-sm font-light text-[#86868b] truncate">
                                Coffre Découverte
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>

                <FadeInUp delay={0.5} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#1c1c1e] rounded-[32px] p-6 h-full flex flex-col justify-between border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <TrendingUp className="h-6 w-6 text-[#f5f5f7] opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#86868b] mb-4">Taux de Conversion</h3>
                                <div className="text-4xl font-semibold tracking-tight text-[#f5f5f7]">3.2%</div>
                            </div>
                            <div className="mt-6 text-sm font-light text-[#86868b]">
                                Vitrine Principale
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>
            </div>
        </div>
    );
}
