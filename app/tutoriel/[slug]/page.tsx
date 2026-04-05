import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, PlayCircle } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // We import createClient dynamically or use fetch to bypass RLS in a server component securely
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data } = await supabaseAdmin
        .from('library_items')
        .select('title, public_description, thumbnail_url')
        .eq('public_slug', params.slug)
        .single();

    if (!data) return { title: "Tutoriel Magique | Club des Petits Magiciens" };

    return {
        title: `${data.title} - Tutoriel Magique`,
        description: data.public_description || "Découvre l'explication de ton tour de magie !",
        openGraph: {
            images: data.thumbnail_url ? [data.thumbnail_url] : [],
        }
    };
}

export default async function TutorialPage({ params }: { params: { slug: string } }) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: trick, error } = await supabaseAdmin
        .from('library_items')
        .select('*')
        .eq('public_slug', params.slug)
        .single();

    if (error || !trick) {
        redirect('/');
    }

    // Bunny Video ID
    const videoId = trick.video_url; // It's usually the Bunny GUID stored here
    const videoUrl = videoId ? `https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${videoId}?autoplay=true&loop=false&muted=false&preload=true&responsive=true` : null;

    return (
        <div className="min-h-screen bg-brand-bg flex justify-center py-10 px-4 sm:px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="max-w-3xl w-full relative z-10 space-y-8">
                
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple mb-2 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-brand-purple font-bold tracking-widest uppercase text-sm mb-1 text-shadow-sm">Explication Secrète</h2>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{trick.title}</h1>
                    </div>
                </div>

                {/* Video Player */}
                {videoUrl ? (
                    <div className="w-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                            <iframe
                                src={videoUrl}
                                loading="lazy"
                                style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                allowFullScreen
                            />
                        </div>
                    </div>
                ) : (
                    <div className="w-full aspect-video bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-brand-text-muted">
                        <PlayCircle className="w-12 h-12 mb-4 opacity-50" />
                        <p>La vidéo est en cours de préparation...</p>
                    </div>
                )}

                {/* Custom Message */}
                {trick.public_description && (
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
                        <p className="text-brand-text leading-relaxed whitespace-pre-wrap">{trick.public_description}</p>
                    </div>
                )}

                {/* Massive Premium Upsell (The Funnel Trap) */}
                <div className="mt-12 bg-gradient-to-br from-brand-card to-black p-8 md:p-10 rounded-3xl border border-brand-purple/40 shadow-[0_0_50px_rgba(124,58,237,0.15)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-gold/20 transition-all duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-purple/20 transition-all duration-500"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                Tu veux apprendre d'autres <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-cyan">secrets magiques ?</span>
                            </h3>
                            <p className="text-brand-text-muted text-sm md:text-base leading-relaxed">
                                Le Club des Petits Magiciens est une école en ligne où j'apprends aux enfants à faire disparaître des objets du quotidien. 
                                Découvre des dizaines d'illusions incroyables à réaliser avec ce que tu as déjà à la maison !
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <Link href="/tarifs/kids" className="group/btn relative overflow-hidden w-full md:w-auto bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-105 active:scale-95">
                                <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                                <span className="text-lg">Rejoindre le Club</span>
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
