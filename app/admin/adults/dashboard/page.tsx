import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, Users, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdultsDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Tableau de bord Business</h1>
                <p className="text-slate-500">Vue d'ensemble de l'activité commerciale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-all border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
                        <Euro className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,450 €</div>
                        <p className="text-xs text-muted-foreground">+12% ce mois-ci</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">340</div>
                        <p className="text-xs text-muted-foreground">Formations & Produits</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventes (Semaine)</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">Principalement "Coffre Découverte"</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3.2%</div>
                        <p className="text-xs text-muted-foreground">Sur la page de vente principale</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
