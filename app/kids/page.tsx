import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, CheckCircle, Lock, Trophy, Map, Star, ArrowRight } from "lucide-react";

export default async function KidsDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile & Calculate Tenure
    const { data: profile } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", user.id)
        .single();

    if (!profile) return null;

    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7) + 1;
    const TOTAL_WEEKS = 24; // Defined by pedagogical path
    const progressPercentage = Math.min((currentWeek / TOTAL_WEEKS) * 100, 100);

    // 2. Fetch Content (Only unlocked items to show "Previous Weeks" and "Current Week")
    const { data: allItems } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "kids")
        .lte("week_number", currentWeek)
        .order("week_number", { ascending: false });

    // Identify Current Week's Content
    const currentItems = allItems?.filter(i => i.week_number === currentWeek) || [];
    const currentMainItem = currentItems.find(i => i.is_main) || currentItems[0];

    // Identify Previous Weeks (Grouped)
    const previousWeeksNumbers = Array.from({ length: currentWeek - 1 }, (_, i) => currentWeek - 1 - i).filter(w => w > 0);

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans overflow-hidden relative selection:bg-brand-purple/30">

            {/* Background Ambience - Warmer/Playful */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* HEADER: Title & Progress at a glance */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-brand-gold">
                            <Map className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Mon Aventure</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-brand-text uppercase tracking-tight">
                            Mon Parcours
                        </h1>
                    </div>
                </header>

                {/* BLOC 1: SEMAINE EN COURS (Hero) */}
                <section className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-gold rounded-3xl opacity-20 blur-lg group-hover:opacity-40 transition duration-1000"></div>

                    <div className="relative bg-brand-card border border-brand-purple/30 rounded-2xl overflow-hidden shadow-2xl">
                        {currentMainItem ? (
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {/* Image / Video Thumbnail */}
                                <div className="relative aspect-video md:aspect-auto md:h-full bg-black">
                                    {currentMainItem.thumbnail_url ? (
                                        <Image src={currentMainItem.thumbnail_url} alt={currentMainItem.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-brand-surface">
                                            <Play className="w-16 h-16 text-white/20" />
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-brand-bg/90"></div>

                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-brand-purple text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform cursor-pointer">
                                            <Play className="w-8 h-8 ml-1 fill-current" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 self-center md:self-start bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                        <Star className="w-3 h-3 fill-current" />
                                        Semaine {currentWeek}
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4 leading-none">
                                        {currentMainItem.title}
                                    </h2>

                                    <p className="text-brand-text-muted mb-8 line-clamp-3 leading-relaxed">
                                        {currentMainItem.description || "Ta nouvelle mission magique est arrivée ! Regarde la vidéo pour apprendre le secret."}
                                    </p>

                                    <Link
                                        href={`/watch/${currentMainItem.id}`} // Or /kids/program if we want to anchor
                                        className="inline-flex items-center justify-center gap-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-brand-purple/20 uppercase tracking-wider text-sm"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        Voir l'activité
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">Chargement de la mission...</h3>
                                <p className="text-brand-text-muted">Nos lutins préparent ton contenu !</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* BLOC 2: MA PROGRESSION */}
                <section className="bg-brand-card/50 border border-brand-border rounded-2xl p-6 md:p-8">
                    <div className="flex items-end justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-brand-gold" />
                                Ma Progression
                            </h3>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-brand-gold">{currentWeek}</span>
                            <span className="text-sm text-brand-text-muted font-medium"> / {TOTAL_WEEKS} Semaines</span>
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative h-4 w-full bg-brand-surface rounded-full overflow-hidden shadow-inner border border-white/5">
                        {/* Animated Bar */}
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple to-brand-gold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20"></div>
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-xs text-brand-text-muted font-mono uppercase tracking-widest">
                        {Math.round(progressPercentage)}% du chemin parcouru ! Continue comme ça !
                    </p>
                </section>

                {/* BLOC 3: SEMAINES DÉBLOQUÉES (Previous) */}
                <section>
                    <h3 className="text-lg font-bold text-brand-text-muted uppercase tracking-widest mb-6 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" />
                        Missions Accomplies
                    </h3>

                    {previousWeeksNumbers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {previousWeeksNumbers.map(weekNum => {
                                const weekItems = allItems?.filter(i => i.week_number === weekNum) || [];
                                const mainVid = weekItems.find(i => i.is_main) || weekItems[0];

                                return (
                                    <Link key={weekNum} href="/kids/program" className="group block">
                                        <div className="bg-brand-card border border-brand-border rounded-xl p-4 flex items-center gap-4 hover:border-brand-purple/50 hover:bg-white/5 transition-all">
                                            <div className="w-16 h-16 bg-black rounded-lg shrink-0 overflow-hidden relative border border-white/10">
                                                {mainVid?.thumbnail_url ? (
                                                    <Image src={mainVid.thumbnail_url} alt="" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-brand-surface"><Star className="w-6 h-6 text-white/20" /></div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-brand-green drop-shadow-md" /> {/* Assuming brand-green exists or use text-green-500 */}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider mb-1">Semaine {weekNum}</div>
                                                <h4 className="text-sm font-bold text-white truncate group-hover:text-brand-purple transition-colors">
                                                    {mainVid?.title || "Mission Mystère"}
                                                </h4>
                                            </div>

                                            <ArrowRight className="w-4 h-4 text-brand-text-muted group-hover:text-white transition-colors" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 border border-dashed border-brand-border rounded-xl text-brand-text-muted text-sm">
                            Tu es au tout début de l'aventure ! Termine cette semaine pour débloquer ton historique.
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
