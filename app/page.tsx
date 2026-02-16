import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MoveRight, Lock, Unlock } from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();

  // Fetch courses
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  // Check auth status
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-purple/30">
      {/* Header */}
      <header className="border-b border-brand-border bg-brand-bg/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎩</span>
            <span className="font-serif text-lg font-bold bg-gradient-to-r from-amber-200 to-brand-gold bg-clip-text text-transparent">
              Le Club des Magiciens
            </span>
          </div>
          <div>
            {user ? (
              <Link href="/dashboard" className="px-4 py-2 bg-brand-surface hover:bg-brand-surface/80 rounded-full text-sm font-medium transition-colors">
                Mon Espace
              </Link>
            ) : (
              <Link href="/login" className="px-4 py-2 text-brand-text-muted hover:text-brand-text text-sm font-medium transition-colors">
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-purple/20 via-brand-bg to-brand-bg -z-10" />
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-brand-text drop-shadow-lg">
          Maîtrisez l'Impossible
        </h1>
        <p className="text-xl text-brand-text-muted max-w-2xl mx-auto mb-10">
          Rejoignez l'élite de la magie moderne. Apprenez des secrets jalousement gardés et devenez le magicien que vous rêvez d'être.
        </p>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif mb-12 text-center">Nos Formations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <div key={course.id} className="group relative bg-brand-card rounded-2xl overflow-hidden border border-brand-border hover:border-brand-purple/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-purple/20">
              {/* Image */}
              <div className="aspect-video bg-brand-surface relative overflow-hidden">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">✨</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-card to-transparent opacity-80" />
              </div>

              {/* Content */}
              <div className="p-6 relative">
                <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-brand-purple transition-colors">
                  {course.title}
                </h3>
                <p className="text-brand-text-muted text-sm mb-6 line-clamp-3">
                  {course.description || "Découvrez les secrets de ce tour incroyable..."}
                </p>

                {/* Action Button */}
                {user ? (
                  <Link href={`/watch/${course.id}`} className="block w-full py-3 text-center rounded-xl bg-brand-purple hover:bg-brand-purple/90 font-bold transition-all flex items-center justify-center gap-2">
                    <Unlock className="w-4 h-4" />
                    Accéder
                  </Link>
                ) : (
                  <a
                    href={course.sales_page_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-3 text-center rounded-xl border border-brand-border hover:bg-white/5 font-bold transition-all flex items-center justify-center gap-2 ${!course.sales_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Lock className="w-4 h-4" />
                    {course.sales_page_url ? "Débloquer l'accès" : "Bientôt disponible"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
