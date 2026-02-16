import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Film, Trophy, Sparkles } from "lucide-react";

export default function KidsDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Tableau de bord Kids</h1>
                <p className="text-slate-500">Bienvenue dans le centre de commande du Club des Magiciens.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-all border-l-4 border-l-brand-purple">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Membres Actifs</CardTitle>
                        <Users className="h-4 w-4 text-brand-purple" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">124</div>
                        <p className="text-xs text-muted-foreground">+4% depuis le mois dernier</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ateliers en Ligne</CardTitle>
                        <Film className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">48</div>
                        <p className="text-xs text-muted-foreground">3 nouveaux cette semaine</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Badges Décernés</CardTitle>
                        <Trophy className="h-4 w-4 text-brand-gold" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">850</div>
                        <p className="text-xs text-muted-foreground">La motivation est haute !</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-brand-purple to-brand-blue text-white shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/80">Niveau Moyen</CardTitle>
                        <Sparkles className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Niv. 4</div>
                        <p className="text-xs text-white/60">Apprenti Magicien</p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Dernières Validations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 text-sm">Chargement des activités récentes...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
