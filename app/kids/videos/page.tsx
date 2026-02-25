import { getKidsVideos, getBunnyThumbnailUrl } from '@/lib/bunny';
import VideoCard from '@/components/VideoCard';
import { Video, Sparkles, FolderOpen, Play, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Les Masterclass | Club des Magiciens',
    description: 'Regarde les replays de tes cours de magie et bien plus encore !',
};

// Next.js Revalidation settings (can be removed if using `next: { revalidate: 60 }` in the fetch directly, but good practice for ISR)
export const revalidate = 60;

export default async function KidsVideosPage() {
    const supabase = await createClient();

    // Fetch settings
    const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .in("key", ["kid_masterclass_page_config", "kid_masterclass_featured_config"]);

    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    const pageConfig = settingsMap.kid_masterclass_page_config
        ? JSON.parse(settingsMap.kid_masterclass_page_config)
        : { title: "Les Masterclass", description: "Apprends à te perfectionner avec des vidéos approfondies et des conseils inédits !" };

    const featuredConfig = settingsMap.kid_masterclass_featured_config
        ? JSON.parse(settingsMap.kid_masterclass_featured_config)
        : null;

    // Fetch featured video details if one is selected
    let featuredVideo = null;
    if (featuredConfig?.id) {
        const { data: featuredData } = await supabase
            .from("library_items")
            .select("*")
            .eq("id", featuredConfig.id)
            .single();

        if (featuredData) {
            featuredVideo = featuredData;
        }
    }

    // Fetch videos from Bunny Stream
    // We only fetch videos from the "Replays" collection if the ID is defined in .env.local
    const replaysCollectionId = process.env.BUNNY_KIDS_REPLAYS_COLLECTION_ID;
    const videos = await getKidsVideos(1, 50, replaysCollectionId);

    // Sort by most recent uploaded first (assuming the API already does it, but double checking)
    const sortedVideos = videos.sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime());

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans relative selection:bg-brand-purple/30">
            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-brand-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Les <span className="text-brand-purple">Masterclass</span>
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            {pageConfig.description || "Perfectionne toi avec des masterclass exclusives et des replays inédits !"}
                        </p>
                    </div>
                </header>

                {/* Featured Masterclass Section */}
                {featuredVideo && (
                    <div className="mb-12">
                        <h2 className="text-sm font-bold text-brand-purple uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> À LA UNE
                        </h2>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-0 blur-lg group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
                            <div className="relative rounded-3xl overflow-hidden border border-brand-purple/20 bg-brand-card flex flex-col md:flex-row shadow-[0_10px_40px_rgba(0,0,0,0.2)]">

                                {/* Featured Image */}
                                <div className="w-full md:w-1/2 md:aspect-auto aspect-video relative">
                                    {featuredConfig.image || featuredVideo.thumbnail_url ? (
                                        <Image
                                            src={featuredConfig.image || featuredVideo.thumbnail_url}
                                            alt={featuredVideo.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <Video className="w-12 h-12 text-white/20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent md:bg-gradient-to-r" />

                                    <Link href={`/kids/videos/${featuredVideo.video_url || featuredVideo.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-20 h-20 bg-brand-gold/90 text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.5)] transform scale-50 group-hover:scale-100 transition-all duration-300">
                                            <Play className="w-8 h-8 ml-2" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Featured Content Info */}
                                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                    {featuredConfig.title && (
                                        <h3 className="text-xl md:text-3xl font-black text-white mb-4 leading-tight">
                                            {featuredConfig.title}
                                        </h3>
                                    )}
                                    <p className="text-brand-text-muted text-sm md:text-base leading-relaxed mb-8">
                                        {featuredConfig.description || featuredVideo.description || "Découvre cette masterclass spéciale !"}
                                    </p>

                                    <Link
                                        href={`/kids/videos/${featuredVideo.video_url || featuredVideo.id}`}
                                        className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-brand-purple/80 transition-colors self-start shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                    >
                                        <Play className="w-4 h-4" />
                                        Visionner
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-brand-gold" />
                            Dernières Vidéos
                        </h2>
                    </div>

                    {sortedVideos.length === 0 ? (
                        <div className="relative group/box">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-0 blur-lg group-hover/box:opacity-30 transition duration-1000 pointer-events-none"></div>
                            <div className="relative bg-brand-card border border-brand-border p-12 rounded-3xl text-center flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                                <div className="w-20 h-20 bg-brand-bg border border-brand-border rounded-full flex items-center justify-center mb-6 text-brand-text-muted opacity-50">
                                    <FolderOpen className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Aucune vidéo pour le moment</h3>
                                <p className="text-brand-text-muted max-w-md mx-auto text-sm">
                                    L'espace Masterclass est en cours de préparation... Les premières vidéos arriveront très bientôt !
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedVideos.map((video) => (
                                <VideoCard
                                    key={video.guid}
                                    id={video.guid}
                                    title={video.title}
                                    thumbnailUrl={getBunnyThumbnailUrl(video.videoLibraryId, video.guid, video.thumbnailFileName)}
                                    date={video.dateUploaded}
                                    durationSeconds={video.length}
                                    href={`/kids/videos/${video.guid}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
