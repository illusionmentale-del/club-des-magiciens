import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle, GraduationCap, ShoppingBag, ArrowRight, Lock } from "lucide-react";

export default async function ProgramPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch User Profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (!profile || !profile.has_adults_access) {
        redirect("/kids");
    }
    const isAdmin = profile.role === 'admin';

    // 2. Fetch all courses & user purchases
    const [coursesRes, purchasesRes] = await Promise.all([
        supabase.from("courses").select("*").neq('audience', 'kids').order("created_at", { ascending: false }),
        supabase.from("user_purchases").select("course_id").eq("user_id", user.id),
    ]);

    const courses = coursesRes.data || [];
    const purchasedCourseIds = new Set(purchasesRes.data?.map(p => p.course_id) || []);

    // 3. Logic: Define "Continuous Training" vs "Isolated Purchases"
    // Heuristic: If it has "Formation" or "Club" in the title or is specifically flagged, it's main.
    // For now, let's assume the oldest big courses are the Main Program, and the rest are "Boutique" (or custom flags if you have them).
    // Let's filter based on tags or types if they exist, otherwise we'll use a simple heuristic or split them.

    // We will consider courses mapped as 'programs' vs 'products'. If they don't have a clear flag,
    // we assume "Le Club des Magiciens" or large programs are the continuous training.

    // As a robust default for Jérémy's architecture:
    // Every course is accessible if Admin, OR if in purchased_ids, OR if free.
    const unlockedCourses = courses.filter(c => isAdmin || purchasedCourseIds.has(c.id) || c.price === 'Gratuit' || !c.price);

    // Let's deduce what is "La Formation Continue" vs "Achats Isolés"
    // Usually, "Mentalisme Pro" or "Le Club des Magiciens" are the main subscriptions.
    const mainProgramsContext = ['Mentalisme', 'Club', 'Formation'];

    const mainPrograms = unlockedCourses.filter(c => mainProgramsContext.some(keyword => c.title.toLowerCase().includes(keyword.toLowerCase())));

    // If we can't identify by keyword, just take the first oldest one as the "Main Program".
    if (mainPrograms.length === 0 && unlockedCourses.length > 0) {
        mainPrograms.push(unlockedCourses[unlockedCourses.length - 1]); // Oldest unlocked
    }

    const mainProgramIds = new Set(mainPrograms.map(p => p.id));
    const isolatedPurchases = unlockedCourses.filter(c => !mainProgramIds.has(c.id));

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans selection:bg-magic-gold/30">
            {/* Header */}
            <header className="mb-12 max-w-7xl mx-auto pt-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-1 bg-gradient-to-r from-magic-gold to-transparent"></div>
                    <span className="text-magic-gold text-sm font-semibold tracking-[0.2em] uppercase">Club des Magiciens</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-4 font-serif">
                    Mon Contenu
                </h1>
                <p className="text-lg text-slate-400 font-light max-w-2xl">
                    Retrouvez ici l'ensemble de vos accès : votre programme de formation principal ainsi que vos achats à la carte.
                </p>
            </header>

            <div className="max-w-7xl mx-auto space-y-16">

                {/* SECTION 1: LA FORMATION CONTINUE */}
                <section>
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-white uppercase tracking-wider mb-8">
                        <GraduationCap className="w-6 h-6 text-magic-gold" />
                        La Formation Continue
                    </h2>

                    {mainPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {mainPrograms.map(program => (
                                <Link
                                    key={program.id}
                                    href={`/watch/${program.id}`}
                                    className="group block relative bg-black/40 border border-magic-gold/30 hover:border-magic-gold/80 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(238,195,67,0.15)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-magic-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    <div className="flex flex-col md:flex-row h-full">
                                        <div className="md:w-2/5 aspect-video md:aspect-auto bg-[#111] relative overflow-hidden shrink-0">
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                                <PlayCircle className="w-16 h-16 text-magic-gold/70 group-hover:text-magic-gold transition-colors duration-500 group-hover:scale-110 transform drop-shadow-lg" />
                                            </div>
                                        </div>
                                        <div className="p-8 flex flex-col justify-center flex-1 z-20">
                                            <div className="inline-block bg-magic-gold/10 text-magic-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 w-max border border-magic-gold/20">
                                                Programme Principal
                                            </div>
                                            <h3 className="text-2xl font-black text-white font-serif mb-3 group-hover:text-magic-gold transition-colors">
                                                {program.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm font-light leading-relaxed line-clamp-3 mb-6">
                                                {program.description || "Suivez pas à pas votre cursus pour maîtriser de nouvelles techniques."}
                                            </p>
                                            <div className="mt-auto flex items-center gap-2 text-magic-gold text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                                                Reprendre l'apprentissage <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center">
                            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Aucune formation continue active</h3>
                            <p className="text-slate-400 text-sm font-light mb-6">Vous ne participez à aucun programme principal structuré pour le moment.</p>
                            <Link href="/dashboard/catalog" className="inline-flex items-center gap-2 text-magic-gold font-bold hover:underline">
                                Découvrir les programmes <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </section>


                {/* SECTION 2: ACHATS ISOLÉS */}
                {isolatedPurchases.length > 0 && (
                    <section className="pt-8 border-t border-white/5">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-white uppercase tracking-wider mb-8">
                            <ShoppingBag className="w-6 h-6 text-slate-400" />
                            Mes Achats Isolés
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {isolatedPurchases.map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/watch/${course.id}`}
                                    className="group relative bg-[#0a0a0f] border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden transition-all flex flex-col"
                                >
                                    <div className="aspect-video bg-[#111] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                            <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white transition-colors duration-300 group-hover:scale-110 transform" />
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-1 flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 line-clamp-2 font-light">
                                                {course.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                                            <span>À la carte</span>
                                            <span className="flex items-center gap-1">
                                                Visionner <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
}
