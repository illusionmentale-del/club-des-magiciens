import { getKidsVideoById, getBunnyIframeUrl } from '@/lib/bunny';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, Eye, Calendar, Clock, Lock, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import BunnyVideoTracker from '@/components/BunnyVideoTracker';
import KidsCommentsSection from '@/components/KidsComments';

export const metadata = {
    title: 'Lecture Vidéo | Club des Magiciens',
};

// Next.js Revalidation settings
export const revalidate = 60;

export default async function KidsVideoPlayerPage({ params }: { params: { videoId: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const video = await getKidsVideoById(params.videoId);

    if (!video) {
        notFound();
    }

    // --- Premium Content Protection Check ---
    // Check if this video exists in our library_items database as a premium item
    const { data: libraryItem } = await supabase
        .from('library_items')
        .select('id, sales_page_url, title, price_label')
        .eq('video_url', params.videoId) // Assuming video_url stores the Bunny GUID
        .single();

    let isLockedPremium = false;
    let salesUrl = "";

    if (libraryItem && libraryItem.sales_page_url) {
        // It's a premium item, we must check if the user owns it
        const { data: purchase } = await supabase
            .from('user_purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('library_item_id', libraryItem.id)
            .single();

        if (!purchase) {
            isLockedPremium = true;
            salesUrl = `${libraryItem.sales_page_url}?prefilled_email=${encodeURIComponent(user.email || '')}&client_reference_id=${user.id}___${libraryItem.id}`;
        }
    }

    // --- Fetch Comments and Admin Status ---
    // Fetch comments manually to avoid Supabase PGRST200 schema cache bug
    const { data: rawComments } = await supabase
        .from("course_comments")
        .select("*")
        .eq("course_id", params.videoId)
        .order("created_at", { ascending: true });

    let comments: any[] = [];
    if (rawComments && rawComments.length > 0) {
        const userIds = [...new Set(rawComments.map(c => c.user_id))];
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, role, email")
            .in("id", userIds);

        comments = rawComments.map(c => ({
            ...c,
            profiles: profiles?.find(p => p.id === c.user_id) || null
        }));
    }

    // Check if user is admin or Jérémy
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
    const isAdmin = profile?.role === 'admin' || (user.email?.includes('admin@') ?? false);

    // If the kid visits this page, mark any pending notifications for them on this video as read
    if (!isAdmin) {
        await supabase
            .from("course_comments")
            .update({ kid_notified: true })
            .eq("course_id", params.videoId)
            .eq("target_user_id", user.id)
            .eq("kid_notified", false);
    }

    // Format duration from seconds to MM:SS or HH:MM:SS
    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) {
            return `${h}h ${m.toString().padStart(2, '0')}`;
        }
        return `${m} min ${s.toString().padStart(2, '0')}s`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        try {
            return new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(new Date(dateString));
        } catch {
            return dateString;
        }
    };

    const iframeUrl = getBunnyIframeUrl(video.videoLibraryId, video.guid);

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 relative font-sans selection:bg-brand-purple/30">
            {/* Ambient Ambient Particles (Kids Theme) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
            <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            <div className="max-w-6xl mx-auto pb-12 relative z-10">
                {/* Back Button / Header (Frosted Glass) */}
                <div className="mb-8 sticky top-4 z-50">
                    <div className="inline-block bg-black/40 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl shadow-xl">
                        <Link href="/kids/videos" className="inline-flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 transition-all py-2 px-4 rounded-xl text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" />
                            Retour à la Galerie
                        </Link>
                    </div>
                </div>

                {/* Video Player Container */}
                <div className="bg-[#0A0A0E] border border-white/5 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.1)] mb-8 relative ring-1 ring-white/5">
                    {isLockedPremium ? (
                        <div className="relative pt-[56.25%] w-full bg-black/80 flex flex-col items-center justify-center p-8 text-center border-y border-brand-gold/30">
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mb-6 border border-brand-gold/40 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                                    <Lock className="w-10 h-10 text-brand-gold" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-2">Secret Verrouillé</h2>
                                <p className="text-brand-text-muted mb-8 max-w-md">
                                    Pour regarder <strong className="text-white">{video.title}</strong>, tu dois posséder ce secret dans ta collection.
                                </p>

                                <a href={salesUrl} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-brand-gold to-yellow-500 text-black font-black py-4 px-8 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(250,204,21,0.4)]">
                                    <ShoppingBag className="w-5 h-5" />
                                    Acheter pour débloquer {libraryItem?.price_label ? `(${libraryItem.price_label})` : ''}
                                </a>
                            </div>
                        </div>
                    ) : (
                        /* 16:9 Aspect Ratio Container for iFrame */
                        <div className="relative pt-[56.25%] w-full bg-black">
                            <BunnyVideoTracker
                                videoId={video.videoLibraryId.toString() + '_' + video.guid} // Unique ID for DB
                                iframeUrl={iframeUrl}
                                totalSeconds={video.length}
                            />
                        </div>
                    )}
                </div>

                {/* Video Details */}
                <div className="bg-[#0A0A0E] border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden group">
                    {/* Inner subtle glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[80px] rounded-full group-hover:bg-brand-purple/10 transition-colors duration-700 pointer-events-none"></div>

                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-6 flex items-start gap-4">
                        <span className="text-brand-purple drop-shadow-[0_0_15px_rgba(124,58,237,0.5)] bg-white/5 p-2 rounded-xl">
                            <PlayCircle className="w-8 h-8" />
                        </span>
                        <span className="mt-1 flex-1 leading-tight tracking-tight">{video.title}</span>
                    </h1>

                    <div className="flex flex-wrap gap-4 text-sm font-bold tracking-wide">
                        <div className="flex items-center gap-3 bg-white/5 text-gray-300 py-2.5 px-5 rounded-xl border border-white/5 shadow-inner">
                            <Calendar className="w-4 h-4 text-brand-blue" />
                            <span>{formatDate(video.dateUploaded)}</span>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 text-gray-300 py-2.5 px-5 rounded-xl border border-white/5 shadow-inner">
                            <Clock className="w-4 h-4 text-brand-purple" />
                            <span>{formatDuration(video.length)}</span>
                        </div>

                        {/* Vues (Optionnel) */}
                        <div className="flex items-center gap-3 bg-white/5 text-gray-300 py-2.5 px-5 rounded-xl border border-white/5 shadow-inner">
                            <Eye className="w-4 h-4 text-brand-pink" />
                            <span>{video.views} vue{video.views !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>

                {/* Kids Comments Section */}
                {!isLockedPremium && (
                    <div className="mt-12">
                        <KidsCommentsSection
                            videoId={params.videoId}
                            comments={comments || []}
                            isAdmin={isAdmin}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
