import { getKidsUsersDetailed } from "./actions";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, Smartphone, AlertCircle, Clock, Ghost, UserCheck, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RayonXPage() {
    const users = await getKidsUsersDetailed();

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/kids/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-white">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Analyse Rayon X
                    </h1>
                    <p className="text-gray-400 mt-1">Suivi chirurgical de l'engagement de tous vos élèves.</p>
                </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>{users.length} élèves au total</span>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Élève</th>
                                <th className="p-4 font-medium">Niveau & XP</th>
                                <th className="p-4 font-medium text-center">Dernière Connexion</th>
                                <th className="p-4 font-medium text-center">Notifications Push</th>
                                <th className="p-4 font-medium text-center">Ouverture Mails</th>
                                <th className="p-4 font-medium text-right">Statut Global</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {users.map(user => {
                                const isGhost = !user.last_kids_login;
                                const isStagnating = user.last_kids_login && new Date(user.last_kids_login) < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // 14 jours

                                return (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {user.avatar_url_kids ? (
                                                    <Image src={user.avatar_url_kids} alt={user.full_name} width={40} height={40} className="rounded-full bg-black/50 border border-white/10" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                                                        {user.full_name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-white">{user.full_name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 w-fit">
                                                    Niv. {user.magic_level || 1}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">{user.xp || 0} XP</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.last_kids_login ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-gray-300 text-xs">
                                                        {formatDistanceToNow(new Date(user.last_kids_login), { addSuffix: true, locale: fr })}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-md border border-red-500/20">
                                                    <Ghost className="w-3 h-3" /> Jamais connecté
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.has_active_push ? (
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Appareil abonné aux pushs">
                                                    <Smartphone className="w-4 h-4" />
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-500/10 text-gray-500 border border-gray-500/20" title="Pas de push">
                                                    <Smartphone className="w-4 h-4 opacity-50" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.last_email_open ? (
                                                <div className="flex flex-col items-center gap-1" title={new Date(user.last_email_open).toLocaleString('fr-FR')}>
                                                    <Mail className="w-4 h-4 text-blue-400 mb-1" />
                                                    <span className="text-gray-400 text-[10px] uppercase">
                                                        {formatDistanceToNow(new Date(user.last_email_open), { locale: fr })}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-600 italic">Aucune lecture</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {isGhost ? (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 text-red-400">
                                                    <AlertCircle className="w-4 h-4" /> Fantôme
                                                </span>
                                            ) : isStagnating ? (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 text-orange-400">
                                                    <Clock className="w-4 h-4" /> Inactif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 text-emerald-400">
                                                    <UserCheck className="w-4 h-4" /> Actif
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
