import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, PlayCircle, Mail } from 'lucide-react';
import TrialLeadCapture from '@/components/kids/TrialLeadCapture';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await params).slug;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // We import createClient dynamically or use fetch to bypass RLS in a server component securely
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data } = await supabaseAdmin
        .from('library_items')
        .select('title, public_description, thumbnail_url')
        .eq('public_slug', slug)
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

export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: trick, error } = await supabaseAdmin
        .from('library_items')
        .select('*')
        .eq('public_slug', slug)
        .single();

    if (error || !trick) {
        redirect('/');
    }

    // Bunny Video ID
    const videoId = trick.video_url;
    let videoUrl = null;
    if (videoId) {
        const { getSecureBunnyIframeUrl } = await import('@/lib/bunny');
        const libraryId = process.env.BUNNY_KIDS_LIBRARY_ID || process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
        if (libraryId) {
            videoUrl = await getSecureBunnyIframeUrl(libraryId, videoId, true);
            // Replace autoplay=false with true for the landing page
            videoUrl = videoUrl.replace('autoplay=false', 'autoplay=true');
        }
    }

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

                {/* Contact Button */}
                <div className="flex justify-center mt-6">
                    <a href="mailto:boutique@atelierdesmagiciens.fr" className="inline-flex items-center gap-2 text-sm text-brand-text-muted hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors">
                        <Mail className="w-4 h-4" />
                        Une question sur ce tour ? Contacte-moi !
                    </a>
                </div>

                {/* Massive Premium Upsell / Lead Capture */}
                <TrialLeadCapture />

            </div>
        </div>
    );
}
