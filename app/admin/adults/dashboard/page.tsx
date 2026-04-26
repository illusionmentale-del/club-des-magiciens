import { Euro, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { FadeInUp, BentoHoverEffect } from "@/components/adults/MotionWrapper";

export default function AdultsDashboardPage() {
    return (
        <div className="space-y-8">
            <FadeInUp delay={0.1}>
                <div>
                    <h1 className="text-3xl font-black text-brand-text tracking-tighter uppercase">Tableau de bord <span className="text-brand-purple">Business</span></h1>
                    <p className="text-xl text-brand-text-muted font-light mt-2">Vue d'ensemble de l'activité commerciale de l'Atelier.</p>
                </div>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FadeInUp delay={0.2} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 rounded-[32px] p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-0 right-0 p-6 z-10">
                                <Euro className="h-6 w-6 text-brand-purple opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-widest mb-4 group-hover:text-gray-300 transition-colors">Chiffre d'Affaires</h3>
                                <div className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-brand-purple transition-all duration-500">12,450 €</div>
                            </div>
                            <div className="mt-6 flex items-center relative z-10">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                    +12%
                                </span>
                                <span className="ml-2 text-xs text-brand-text-muted font-medium">ce mois-ci</span>
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>

                <FadeInUp delay={0.3} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 rounded-[32px] p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-0 right-0 p-6 z-10">
                                <Users className="h-6 w-6 text-brand-purple opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-widest mb-4 group-hover:text-gray-300 transition-colors">Clients Actifs</h3>
                                <div className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-brand-purple transition-all duration-500">340</div>
                            </div>
                            <div className="mt-6 text-sm font-bold text-brand-text-muted relative z-10">
                                Formations & Produits
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>

                <FadeInUp delay={0.4} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 rounded-[32px] p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-0 right-0 p-6 z-10">
                                <ShoppingBag className="h-6 w-6 text-brand-purple opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-widest mb-4 group-hover:text-gray-300 transition-colors">Ventes (Semaine)</h3>
                                <div className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-brand-purple transition-all duration-500">24</div>
                            </div>
                            <div className="mt-6 text-sm font-bold text-brand-text-muted truncate relative z-10">
                                Coffre Découverte
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>

                <FadeInUp delay={0.5} className="h-full">
                    <BentoHoverEffect className="h-full">
                        <div className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 rounded-[32px] p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-0 right-0 p-6 z-10">
                                <TrendingUp className="h-6 w-6 text-brand-purple opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-widest mb-4 group-hover:text-gray-300 transition-colors">Taux de Conv.</h3>
                                <div className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-brand-purple transition-all duration-500">3.2%</div>
                            </div>
                            <div className="mt-6 text-sm font-bold text-brand-text-muted relative z-10">
                                Vitrine Principale
                            </div>
                        </div>
                    </BentoHoverEffect>
                </FadeInUp>
            </div>
        </div>
    );
}
