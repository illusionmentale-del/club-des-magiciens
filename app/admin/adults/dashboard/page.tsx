import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Film, Sparkles, AlertTriangle, PlayCircle, Star, Crown } from "lucide-react";
import { getAdultsDashboardStats } from "./actions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdultsDashboardPage() {
    const stats = await getAdultsDashboardStats();

    if (!stats) {
        return (
            <div className="p-8 text-center text-brand-text-muted">
                Impossible de charger les statistiques du tableau de bord.
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-text tracking-tighter uppercase">Tableau de Bord <span className="text-brand-blue">Atelier</span></h1>
                    <p className="text-brand-text-muted mt-2">Visibilité en temps réel sur l'engagement et l'évolution des adultes.</p>
                </div>
                <Link href="/admin/adults/analytics" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-brand-blue/80 text-white font-bold rounded-[16px] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                    <Users className="w-5 h-5" />
                    <span>Vue "Rayon X" des Adultes</span>
                </Link>
            </div>

            {/* SECTION 1: Core KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#100b1a] border border-white/10 hover:border-brand-blue/50 transition-all shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-[24px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">Élèves Actifs (7j)</CardTitle>
                        <Users className="h-5 w-5 text-brand-blue" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-brand-text">{stats.activeAdultsCount}</div>
                        <p className="text-xs text-brand-text-muted mt-1">sur {stats.totalAdults} inscrits au total</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#100b1a] border border-brand-blue/30 shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.3)] transition-all rounded-[24px] relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/20 blur-3xl rounded-full pointer-events-none"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-blue">Énergie Magique (XP)</CardTitle>
                        <Star className="h-5 w-5 text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-cyan-400">{stats.totalXpGenerated.toLocaleString('fr-FR')} XP</div>
                        <p className="text-xs text-brand-blue/70 mt-1 uppercase tracking-widest">Distribués au total</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#100b1a] border border-white/10 hover:border-brand-blue/50 transition-all shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-[24px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">Top Vidéos</CardTitle>
                        <Film className="h-5 w-5 text-brand-blue" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-brand-blue">{stats.topVideos.length > 0 ? stats.topVideos[0].views : 0}</div>
                        <p className="text-xs text-brand-text-muted mt-1">vues sur la vidéo la plus pop.</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#100b1a] border border-white/10 hover:border-red-500/50 transition-all shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden rounded-[24px]">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full pointer-events-none"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">Risque Décrochage</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-red-400">{stats.ghostAdults.length}</div>
                        <p className="text-xs text-brand-text-muted mt-1">inactifs depuis +14 jours</p>
                    </CardContent>
                </Card>
            </div>

            {/* SECTION 2: Leaderboard & Level Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Leaderboard */}
                <Card className="bg-[#100b1a] border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-[24px] overflow-hidden">
                    <CardHeader className="border-b border-brand-border pb-4 bg-gradient-to-r from-brand-blue/10 to-transparent">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-brand-text uppercase tracking-tight">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            Le Top 5 des Élèves
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {stats.leaderboard.length === 0 ? (
                            <div className="p-8 text-center text-brand-text-muted text-sm">
                                Aucun élève n'a encore gagné d'XP.
                            </div>
                        ) : (
                            <div className="divide-y divide-brand-border">
                                {stats.leaderboard.map((user, index) => (
                                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-sm
                                                ${index === 0 ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 
                                                  index === 1 ? 'bg-gray-300/20 border-gray-300 text-gray-300' :
                                                  index === 2 ? 'bg-amber-700/20 border-amber-700 text-amber-600' : 
                                                  'bg-brand-bg border-brand-border text-brand-text-muted'}`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-text text-sm group-hover:text-brand-blue transition-colors">{user.fullName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue/80 bg-brand-blue/10 px-2 py-0.5 rounded-full">{user.magicLevel}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black text-cyan-400">
                                                {user.xp.toLocaleString('fr-FR')} XP
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Level Distribution */}
                <Card className="bg-[#100b1a] border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-[24px] overflow-hidden">
                    <CardHeader className="border-b border-brand-border pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-brand-text uppercase tracking-tight">
                            <Sparkles className="w-5 h-5 text-brand-blue" />
                            Répartition des Niveaux
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {stats.levelDistribution.length === 0 ? (
                            <div className="text-center text-brand-text-muted text-sm py-8">
                                Aucune donnée de niveau.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {stats.levelDistribution.map((level, i) => (
                                    <div key={level.name} className="relative">
                                        <div className="flex justify-between items-end mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-cyan-400' : 'bg-brand-blue'}`}></div>
                                                <span className="font-bold text-sm text-brand-text">{level.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-black text-white">{level.count}</span>
                                                <span className="text-xs text-brand-text-muted ml-1">élèves ({level.percent}%)</span>
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${i === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-gradient-to-r from-blue-600 to-brand-blue'}`}
                                                style={{ width: `${Math.max(level.percent, 2)}%` }} // At least 2% so it's visible
                                            >
                                                <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* SECTION 3: Content Preferences */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Top Videos */}
                <Card className="bg-[#100b1a] border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-[24px] overflow-hidden">
                    <CardHeader className="border-b border-brand-border pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-brand-text uppercase tracking-tight">
                            <PlayCircle className="w-5 h-5 text-brand-blue" />
                            Vidéos les plus appréciées
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
                                                <p className="text-xs text-brand-text-muted mt-1">{video.views} validations uniques</p>
                                            </div>
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
