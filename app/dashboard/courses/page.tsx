import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle, ArrowRight, Lock, ShoppingCart } from "lucide-react";

export default async function CoursesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch All Courses (Adults or All)
    // Exclude purely kids content from adult dashboard
    const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .neq('audience', 'kids')
        .order("created_at", { ascending: false });

    // Fetch User Purchases
    const { data: purchases } = await supabase
        .from("user_purchases")
        .select("course_id")
        .eq("user_id", user.id);

    // Create a Set of purchased course IDs for fast lookup
    const purchasedCourseIds = new Set(purchases?.map(p => p.course_id) || []);

    // Check if user is Admin (admins unlock everything)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const isAdmin = profile?.role === 'admin';

    return (
        <div className="min-h-screen bg-magic-bg text-white p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="border-b border-white/10 pb-8">
                    <h1 className="text-4xl font-serif text-white mb-2">Mes Formations</h1>
                    <p className="text-gray-400">Retrouvez tous vos cours et progressez à votre rythme.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses?.map((course) => {
                        // Logic for Unlock: Admin OR Purchased OR Free OR No Price
                        const isUnlocked = isAdmin || purchasedCourseIds.has(course.id) || course.price === 'Gratuit' || !course.price;

                        // If locked, link to sales page (or # if none). If unlocked, link to watch page.
                        const href = isUnlocked ? `/watch/${course.id}` : (course.sales_page_url || "#");
                        const target = isUnlocked ? "_self" : "_blank";

                        return (
                            <Link
                                key={course.id}
                                href={href}
                                target={target}
                                className={`group relative bg-magic-card border ${isUnlocked ? 'border-white/10 hover:border-magic-purple/50' : 'border-white/5 opacity-80 hover:opacity-100'} rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] flex flex-col`}
                            >
                                <div className="aspect-video bg-black relative">
                                    {/* Image/Thumbnail Area */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                                        {isUnlocked ? (
                                            <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-magic-purple transition-colors" />
                                        ) : (
                                            <Lock className="w-12 h-12 text-white/30 group-hover:text-red-400 transition-colors" />
                                        )}
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="font-bold text-lg truncate group-hover:text-magic-gold transition-colors flex items-center gap-2">
                                            {course.title}
                                            {!isUnlocked && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">Verrouillé</span>}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-1 flex-col justify-between">
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">{course.description}</p>
                                    <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                                        <span className="bg-white/5 px-2 py-1 rounded">Formation</span>
                                        {isUnlocked ? (
                                            <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                                                Accéder <ArrowRight className="w-3 h-3" />
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-400 group-hover:text-red-300 transition-colors">
                                                <ShoppingCart className="w-3 h-3" />
                                                {course.price_label || "Acheter"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {(!courses || courses.length === 0) && (
                        <div className="col-span-full p-12 text-center border border-dashed border-white/10 rounded-2xl text-gray-500">
                            Aucune formation disponible pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
