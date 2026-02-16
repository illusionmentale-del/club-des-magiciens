import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PlusCircle, Edit, Tv } from "lucide-react";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch courses
    const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .order("id", { ascending: true });

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif text-brand-text">Gestion des Cours</h2>
                    <p className="text-brand-text-muted mt-2">Gérez vos formations et ajoutez des vidéos.</p>
                </div>
                <Link href="/admin/courses/new">
                    <button className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple/80 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-brand-purple/20">
                        <PlusCircle className="w-5 h-5" />
                        Créer un cours
                    </button>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses?.map((course) => (
                    <div key={course.id} className="bg-brand-card border border-brand-border rounded-xl overflow-hidden hover:border-brand-purple/30 transition-all group">
                        <div className="aspect-video bg-brand-surface relative">
                            {course.image_url ? (
                                <img src={course.image_url} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur-sm">
                                ID: {course.id}
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-magic-gold transition-colors">{course.title}</h3>
                                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{course.description}</p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-brand-border">
                                <Link href={`/admin/courses/${course.id}`} className="flex-1">
                                    <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 hover:text-magic-gold text-gray-300 py-2 rounded-lg transition-colors text-sm font-medium">
                                        <Tv className="w-4 h-4" />
                                        Gérer les vidéos
                                    </button>
                                </Link>
                                <Link href={`/admin/courses/${course.id}/edit`}>
                                    <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Card */}
                <Link href="/admin/courses/new" className="group flex flex-col items-center justify-center gap-4 bg-brand-card/50 border border-dashed border-brand-border rounded-xl p-8 hover:bg-brand-surface hover:border-brand-purple/50 transition-all cursor-pointer min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-magic-purple/20 transition-colors">
                        <PlusCircle className="w-8 h-8 text-gray-500 group-hover:text-magic-purple transition-colors" />
                    </div>
                    <p className="text-gray-400 font-medium group-hover:text-white transition-colors">Ajouter un nouveau cours</p>
                </Link>
            </div>
        </div>
    );
}
