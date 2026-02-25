import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Film, Trophy, Sparkles, Clock, AlertTriangle, PlayCircle } from "lucide-react";
import { getKidsDashboardStats } from "./actions";

export default async function KidsDashboardPage() {
    const stats = await getKidsDashboardStats();

    if (!stats) {
        return (
            <div className="p-8 text-center text-brand-text-muted">
                Impossible de charger les statistiques du tableau de bord.
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-brand-text tracking-tighter uppercase">Tableau de Bord <span className="text-brand-purple">Kids</span></h1>
                <p className="text-brand-text-muted mt-2">Bienvenue dans le centre de commande de ton école de magie.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-brand-card border-brand-border hover:border-brand-purple/50 transition-all shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">Élèves Actifs (7j)</CardTitle>
                        <Users className="h-5 w-5 text-brand-purple" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-brand-text">{stats.activeKidsCount}</div>
                        <p className="text-xs text-brand-text-muted mt-1">sur {stats.totalKids} inscrits</p>
                    </CardContent>
                </Card>

                <Card className="bg-brand-card border-brand-border hover:border-brand-blue/50 transition-all shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">Temps de Visionnage</CardTitle>
                        <Clock className="h-5 w-5 text-brand-blue" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-brand-text">{stats.totalWatchTimeHours} h</div>
                        <p className="text-xs text-brand-text-muted mt-1">Au total sur l'académie</p>
                    </CardContent>
                </Card>

                <Card className="bg-brand-card border-brand-border hover:border-brand-gold/50 transition-all shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">Taux d'Activité</CardTitle>
                        <Sparkles className="h-5 w-5 text-brand-gold" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-brand-gold">
                            {stats.totalKids > 0 ? Math.round((stats.activeKidsCount / stats.totalKids) * 100) : 0}%
                        </div>
                        <p className="text-xs text-brand-text-muted mt-1">d'élèves se connectant réguliérement</p>
                    </CardContent>
                </Card>

                <Card className="bg-brand-card border-brand-border hover:border-red-500/50 transition-all shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full pointer-events-none"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">Risque Décrochage</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-red-400">{stats.ghostKids.length}</div>
                        <p className="text-xs text-brand-text-muted mt-1">inactifs depuis +14 jours</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Top Videos */}
                <Card className="bg-brand-card border-brand-border shadow-xl">
                    <CardHeader className="border-b border-brand-border pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-brand-text uppercase tracking-tight">
                            <PlayCircle className="w-5 h-5 text-brand-purple" />
                            Le Top 5 des Vidéos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {stats.topVideos.length === 0 ? (
                            <div className="p-8 text-center text-brand-text-muted text-sm">
                                Aucune donnée de visionnage pour le moment.
                            </div>
                        ) : (
                            <div className="divide-y divide-brand-border">
                                {stats.topVideos.map((video, index) => (
                                    <div key={video.videoId} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center font-black text-brand-text-muted text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-text text-sm line-clamp-1">{video.title}</p>
                                                <p className="text-xs text-brand-text-muted mt-1">{video.views} vues uniques</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-brand-purple">
                                                {video.avgCompletion}% vus
                                            </div>
                                            <div className="text-[10px] text-brand-text-muted mt-1 uppercase tracking-wider">
                                                en moyenne
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Ghost Kids List */}
                <Card className="bg-brand-card border-brand-border shadow-xl">
                    <CardHeader className="border-b border-brand-border pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-brand-text uppercase tracking-tight">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            Élèves à Relancer (Décrochage)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {stats.ghostKids.length === 0 ? (
                            <div className="p-8 text-center text-brand-text-muted text-sm flex flex-col items-center">
                                <Sparkles className="w-8 h-8 text-brand-gold mb-3 opacity-50" />
                                Super ! Tous vos élèves sont actifs.
                            </div>
                        ) : (
                            <div className="max-h-[400px] overflow-y-auto divide-y divide-brand-border">
                                {stats.ghostKids.map(kid => (
                                    <div key={kid.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div>
                                            <p className="font-bold text-brand-text text-sm">{kid.full_name || "Élève Inconnu"}</p>
                                            <p className="text-xs text-brand-text-muted mt-1">{kid.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-red-400">
                                                {kid.last_kids_login
                                                    ? `Vu le ${new Date(kid.last_kids_login).toLocaleDateString()}`
                                                    : "Jamais connecté"}
                                            </div>
                                            <a href={`mailto:${kid.email}`} className="text-[10px] text-brand-blue hover:text-blue-400 mt-1 uppercase tracking-wider block transition-colors">
                                                Envoyer un email
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
