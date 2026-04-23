import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, Users, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdultsDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-white">Tableau de bord Business</h1>
                <p className="text-gray-400">Vue d'ensemble de l'activité commerciale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#100b1a] border border-white/10 hover:border-white/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] transition-all border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Chiffre d'Affaires</CardTitle>
                        <Euro className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">12,450 €</div>
                        <p className="text-xs text-gray-400">+12% ce mois-ci</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#100b1a] border border-white/10 hover:border-white/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Clients Actifs</CardTitle>
                        <Users className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">340</div>
                        <p className="text-xs text-gray-400">Formations & Produits</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#100b1a] border border-white/10 hover:border-white/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Ventes (Semaine)</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">24</div>
                        <p className="text-xs text-gray-400">Principalement "Coffre Découverte"</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#100b1a] border border-white/10 hover:border-white/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Taux de Conversion</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">3.2%</div>
                        <p className="text-xs text-gray-400">Sur la page de vente principale</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
