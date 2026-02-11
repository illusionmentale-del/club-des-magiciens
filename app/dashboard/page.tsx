import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch all courses (for now, show all available courses)
    const { data: courses } = await supabase
        .from("courses")
        .select("*");

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex justify-between items-end border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl font-serif text-magic-gold mb-2">Espace Membre</h1>
                        <p className="text-gray-400">Bienvenue dans le cercle, {profile?.full_name || user.email}</p>
                    </div>
                </header>

                <section className="space-y-6">
                    <h2 className="text-2xl font-serif text-white/80 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-magic-purple"></span>
                        Vos Formations
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses?.map((course) => (
                            <div key={course.id} className="group rounded-xl bg-magic-card border border-white/5 hover:border-magic-purple/50 transition-all duration-500 overflow-hidden hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] flex flex-col">
                                <div className="aspect-video relative overflow-hidden bg-black/40">
                                    {course.image_url ? (
                                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-magic-card via-transparent to-transparent opacity-80"></div>
                                </div>

                                <div className="p-6 space-y-4 flex-1 flex flex-col">
                                    <div>
                                        <h3 className="text-2xl font-serif text-white group-hover:text-magic-gold transition-colors">{course.title}</h3>
                                        <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">{course.description}</p>
                                    </div>

                                    <div className="pt-4 mt-auto">
                                        <Link href={`/watch/${course.id}`} className="block w-full">
                                            <button className="w-full py-3 px-4 rounded-lg bg-white/5 hover:bg-magic-purple hover:text-white border border-white/10 transition-all text-sm font-medium tracking-wide uppercase cursor-pointer">
                                                Accéder au contenu
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!courses || courses.length === 0) && (
                            <div className="col-span-full p-12 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                                <p className="text-gray-400 text-lg">Aucun cours disponible pour le moment.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
