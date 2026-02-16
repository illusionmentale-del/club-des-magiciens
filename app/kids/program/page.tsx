import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Play, Star, CheckCircle } from "lucide-react";

export default async function KidsProgramPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Get User Profile to calculate "Current Week"
    const { data: profile } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", user.id)
        .single();

    if (!profile) return null;

    // Calculate tenure in weeks
    // TODO: Ideally use a dedicated 'subscription_start' if resets are allowed.
    // For now, using profile creation date.
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7) + 1;

    // 2. Fetch All Kids Items (RLS will filter, but we fetch all to show locked state if RLS allows listing but blocks detail?
    // Actually, strictly speaking RLS hides rows. 
    // BUT for the "Locked" visualization, we need to know they exist.
    // If RLS hides them, we can't show "Locked Week 5".
    // STRATEGY: 
    // Option A: Admin fetches all and we render. (Unsafe/Bad architecture)
    // Option B: RLS allows 'select' for 'id', 'week_number' etc but hides 'video_url'.
    // Option C: We just generate the timeline mathematically (Week 1 to 52) and only fetch content for unlocked weeks.
    // Let's go with Option C + Fetching available content.

    const { data: unlockedItems } = await supabase
        .from("library_items")
        .select("*")
        .eq("audience", "kids")
        .lte("week_number", currentWeek)
        .order("week_number", { ascending: false }); // Newest first

    // Group items by week
    const weeksData: Record<number, any[]> = {};
    if (unlockedItems) {
        unlockedItems.forEach(item => {
            if (!item.week_number) return;
            if (!weeksData[item.week_number]) weeksData[item.week_number] = [];
            weeksData[item.week_number].push(item);
        });
    }

    // Generate Timeline (e.g., showing next 4 locked weeks)
    const displayWeeks = [];
    for (let i = currentWeek + 4; i >= 1; i--) {
        displayWeeks.push(i);
    }

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans overflow-hidden relative">

            {/* Ambient Background - Adult Style (Clean or Subtle Gradient) */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/10 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Header */}
            <header className="max-w-4xl mx-auto mb-16 relative z-10 pt-8 text-center">
                <div className="inline-block px-4 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest mb-4">
                    Mon Parcours Magique
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
                    Semaine <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-gold">{currentWeek}</span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent mx-auto"></div>
            </header>

            {/* Timeline */}
            <div className="max-w-3xl mx-auto relative z-10 space-y-12">
                {displayWeeks.map(week => {
                    const isLocked = week > currentWeek;
                    const items = weeksData[week] || [];
                    const mainItem = items.find(i => i.is_main) || items[0];
                    const bonusItems = items.filter(i => i.id !== mainItem?.id);

                    return (
                        <div key={week} className={`relative pt-8 pl-8 md:pl-0 border-l-2 md:border-l-0 ${isLocked ? 'border-brand-border/30 opacity-60 grayscale' : 'border-brand-purple'}`}>

                            {/* Mobile Line Dot */}
                            <div className={`md:hidden absolute left-[-9px] top-8 w-4 h-4 rounded-full border-2 ${isLocked ? 'bg-brand-bg border-brand-border' : 'bg-brand-purple border-brand-bg shadow-[0_0_10px_#a855f7]'}`}></div>

                            {/* Content */}
                            <div className="flex flex-col md:flex-row md:items-start gap-8 group">

                                {/* Week Indicator (Desktop) */}
                                <div className="hidden md:flex flex-col items-end w-32 shrink-0 pt-2">
                                    <span className={`text-3xl font-black ${isLocked ? 'text-brand-text-muted' : 'text-brand-purple'}`}>
                                        S.{week.toString().padStart(2, '0')}
                                    </span>
                                    {week === currentWeek && (
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue animate-pulse">En cours</span>
                                    )}
                                </div>

                                {/* Card */}
                                <div className="flex-1">
                                    {isLocked ? (
                                        <div className="bg-brand-card/50 border border-brand-border/50 rounded-2xl p-8 flex items-center justify-center gap-4 relative overflow-hidden">
                                            {/* Striped Pattern */}
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 20px)' }}></div>

                                            <div className="bg-black/50 p-4 rounded-full border border-brand-border backdrop-blur-md relative z-10">
                                                <Lock className="w-6 h-6 text-brand-text-muted" />
                                            </div>
                                            <div className="text-brand-text-muted font-bold text-lg uppercase tracking-widest relative z-10">
                                                Verrouillé
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Main Content Card */}
                                            {mainItem ? (
                                                <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-purple/50 transition-all group/card shadow-xl relative">
                                                    <div className="aspect-video relative bg-black">
                                                        {mainItem.thumbnail_url ? (
                                                            <Image src={mainItem.thumbnail_url} alt={mainItem.title} fill className="object-cover opacity-80 group-hover/card:opacity-100 transition-opacity" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-brand-surface">
                                                                <Play className="w-12 h-12 text-brand-text-muted/20" />
                                                            </div>
                                                        )}

                                                        {/* Play Button Overlay */}
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all scale-90 group-hover/card:scale-100 duration-300">
                                                            <div className="bg-brand-purple text-brand-bg w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                                                                <Play className="w-6 h-6 fill-current ml-1" />
                                                            </div>
                                                        </div>

                                                        {/* Labels */}
                                                        <div className="absolute top-4 left-4 flex gap-2">
                                                            <span className="px-2 py-1 bg-brand-purple/90 text-brand-bg text-[10px] font-bold uppercase tracking-widest rounded shadow-lg">
                                                                Mission Principale
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <h3 className="text-2xl font-bold text-brand-text mb-2 uppercase tracking-tight">{mainItem.title}</h3>
                                                        <p className="text-brand-text-muted text-sm line-clamp-2">{mainItem.description}</p>

                                                        <div className="mt-6 flex gap-4">
                                                            <button className="flex-1 bg-brand-surface hover:bg-brand-text hover:text-brand-bg border border-brand-border text-brand-text font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest">
                                                                Commencer
                                                            </button>
                                                            {mainItem.resource_url && (
                                                                <button className="px-4 border border-brand-border rounded-xl hover:bg-white/5 transition-colors" title="Télécharger PDF">
                                                                    <Star className="w-5 h-5 text-brand-gold" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-8 border border-dashed border-brand-border rounded-2xl text-center text-brand-text-muted font-mono text-xs uppercase">
                                                    Contenu en cours de téléportation...
                                                </div>
                                            )}

                                            {/* Bonus Items */}
                                            {bonusItems.length > 0 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {bonusItems.map(bonus => (
                                                        <div key={bonus.id} className="bg-brand-surface/50 border border-brand-border/50 rounded-xl p-4 flex gap-4 items-center hover:bg-brand-surface transition-colors cursor-pointer group/bonus">
                                                            <div className="w-12 h-12 bg-black rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden">
                                                                {bonus.thumbnail_url && <Image src={bonus.thumbnail_url} alt="" fill className="object-cover opacity-60" />}
                                                                <Play className="w-4 h-4 text-brand-text relative z-10" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-brand-gold font-bold uppercase tracking-wider mb-0.5">Bonus</div>
                                                                <h4 className="text-sm font-bold text-brand-text leading-tight group-hover/bonus:text-brand-purple transition-colors">{bonus.title}</h4>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* End of list */}
            <div className="text-center py-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-border bg-brand-surface/50 text-brand-text-muted text-xs font-mono">
                    <CheckCircle className="w-4 h-4" />
                    Tout est à jour
                </div>
            </div>
        </div>
    );
}
