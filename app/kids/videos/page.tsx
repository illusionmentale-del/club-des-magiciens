import { getKidsVideos, getBunnyThumbnailUrl } from '@/lib/bunny';
import VideoCard from '@/components/VideoCard';
import { Video, Sparkles, FolderOpen, Play, Star, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import SearchInput from '@/components/kids/SearchInput';
import { FadeInUp } from '@/components/adults/MotionWrapper';

export const metadata = {
    title: 'Les Ateliers | Club des Magiciens',
    description: 'Regarde les replays de tes cours de magie et bien plus encore !',
};

// Next.js Revalidation settings (can be removed if using `next: { revalidate: 60 }` in the fetch directly, but good practice for ISR)
export const revalidate = 60;

export default async function KidsVideosPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const sParams = await searchParams;
    const query = sParams.q?.toLowerCase() || "";
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
        : { title: "Les Ateliers", description: "Des ateliers sur des thèmes précis pour approfondir ta magie !" };

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

    // Fetch 'Ateliers' from our own database instead of raw Bunny Stream
    const { data: videos } = await supabase
        .from('library_items')
        .select('*')
        .eq('audience', 'kids')
        .eq('type', 'atelier')
        .order('published_at', { ascending: false });

    // Filter videos based on search query
    const sortedVideos = (videos || []).filter(item => {
        if (!query) return true;
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesTags = item.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTags;
    });

    return (
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 pb-32 font-sans relative selection:bg-brand-purple/30">
            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-0 left-0 w-full md:w-1/2 h-[50vh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-blue/10 via-[#000000]/0 to-[#000000]/0 pointer-events-none z-0"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <FadeInUp delay={0.1}>
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-brand-purple mb-2">
                                <Star className="w-5 h-5 fill-current animate-pulse text-brand-purple" />
                                <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
                                Les <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-500">Ateliers</span>
                            </h1>
                            <p className="text-[#86868b] mt-3 text-lg md:text-xl font-light">
                                {pageConfig.description || "Des ateliers sur des thèmes précis pour approfondir ta magie !"}
                            </p>
                        </div>
                    </header>
                </FadeInUp>

                {/* Search Bar */}
                <FadeInUp delay={0.2}>
                    <div className="w-full relative z-20">
                        <SearchInput placeholder="Rechercher un atelier..." />
                    </div>
                </FadeInUp>

                {/* Featured Masterclass Section (Hidden when searching) */}
                {featuredVideo && !query && (
                    <FadeInUp delay={0.3}>
                        <div className="mb-12">
                            <h2 className="text-sm font-semibold text-[#86868b] uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-brand-purple" /> À LA UNE
                            </h2>
                            <div className="group bg-[#1c1c1e] border border-white/5 rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-xl hover:shadow-2xl hover:border-white/10 transition-all duration-500 ease-[0.16,1,0.3,1] relative">
                                {/* Glow effect */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                                {/* Featured Image */}
                                <div className="w-full md:w-1/2 md:aspect-auto aspect-video relative shrink-0">
                                    {featuredConfig.image || featuredVideo.thumbnail_url ? (
                                        <Image
                                            src={featuredConfig.image || featuredVideo.thumbnail_url}
                                            alt={featuredVideo.title}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.02]"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#2c2c2e]/50 flex items-center justify-center">
                                            <Video className="w-12 h-12 text-[#86868b]" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-transparent to-transparent md:bg-gradient-to-r" />

                                    <Link href={`/kids/videos/${featuredVideo.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-20 h-20 bg-brand-blue/90 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] transform scale-50 group-hover:scale-100 transition-all duration-300">
                                            <Play className="w-8 h-8 ml-2" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Featured Content Info */}
                                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
                                    {featuredConfig.title && (
                                        <h3 className="text-2xl md:text-4xl font-semibold text-[#f5f5f7] mb-4 tracking-tight">
                                            {featuredConfig.title}
                                        </h3>
                                    )}
                                    <p className="text-[#86868b] text-sm md:text-base font-light leading-relaxed mb-8">
                                        {featuredConfig.description || featuredVideo.description || "Découvre cet atelier spécial !"}
                                    </p>

                                    <Link
                                        href={`/kids/videos/${featuredVideo.id}`}
                                        className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-sm hover:bg-cyan-500 transition-all self-start shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105"
                                    >
                                        <Play className="w-4 h-4" />
                                        Visionner
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                )}

                {/* Video Grid or Search List */}
                <FadeInUp delay={0.4}>
                    <div className="space-y-6">
                        {query ? (
                            <div className="space-y-4 pb-12">
                                <h2 className="text-sm font-semibold text-[#86868b] uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Search className="w-4 h-4" /> RÉSULTATS DE RECHERCHE
                                </h2>
                                {sortedVideos.length > 0 ? sortedVideos.map(video => {
                                    const videoIdForLink = video.id;
                                    return (
                                        <Link key={video.id} href={`/kids/videos/${videoIdForLink}`} className="flex flex-col sm:flex-row gap-5 bg-[#1c1c1e] hover:bg-[#2c2c2e]/60 p-4 rounded-[24px] border border-white/5 hover:border-white/10 transition-all group shadow-xl hover:shadow-2xl">
                                            <div className="w-full sm:w-64 md:w-56 aspect-video relative rounded-[16px] overflow-hidden bg-black shrink-0 border border-white/5">
                                                {video.thumbnail_url ? (
                                                    <Image src={video.thumbnail_url} alt="" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center"><Play className="w-8 h-8 text-[#86868b]" /></div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-12 h-12 bg-brand-blue/90 rounded-full flex items-center justify-center shadow-lg border border-white/20 scale-90 group-hover:scale-100 transition-all duration-300">
                                                        <Play className="w-5 h-5 text-white ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center py-2 h-full">
                                                <h3 className="text-xl md:text-2xl font-semibold text-[#f5f5f7] mb-2 leading-tight group-hover:text-brand-blue transition-colors tracking-tight">{video.title}</h3>
                                                <p className="text-sm text-[#86868b] font-light line-clamp-2 md:line-clamp-3 mb-4">{video.description}</p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1 uppercase tracking-widest">Atelier</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-brand-blue uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                        Visionner <Play className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                }) : (
                                    <div className="text-center py-20 text-[#86868b] bg-[#1c1c1e] rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-[#2c2c2e]/50 rounded-[16px] flex items-center justify-center mb-6">
                                            <Search className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">Aucun résultat trouvé</p>
                                        <p className="text-sm font-light">Nous n'avons rien trouvé pour "{query}" dans les ateliers.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-semibold text-[#f5f5f7] flex items-center gap-3 tracking-tight">
                                        <Sparkles className="w-6 h-6 text-brand-blue" />
                                        Tous les Ateliers
                                    </h2>
                                </div>

                                {sortedVideos.length === 0 ? (
                                    <div className="relative group/box">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-cyan-500 rounded-[32px] opacity-0 blur-xl group-hover/box:opacity-20 transition duration-1000 pointer-events-none"></div>
                                        <div className="relative bg-[#1c1c1e] border border-white/5 p-16 rounded-[32px] text-center flex flex-col items-center justify-center shadow-xl">
                                            <div className="w-20 h-20 bg-[#2c2c2e]/50 border border-white/5 rounded-[20px] flex items-center justify-center mb-6 text-[#86868b]">
                                                <FolderOpen className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-3 tracking-tight">Aucun atelier pour le moment</h3>
                                            <p className="text-[#86868b] max-w-md mx-auto text-sm font-light">
                                                L'espace Ateliers est en cours de préparation... Les premières vidéos arriveront très bientôt !
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {sortedVideos.map((video) => {
                                            const videoIdForLink = video.id;
                                            return (
                                                <VideoCard
                                                    key={video.id}
                                                    id={videoIdForLink}
                                                    title={video.title}
                                                    thumbnailUrl={video.thumbnail_url || ''}
                                                    date={video.published_at || video.created_at}
                                                    durationSeconds={0}
                                                    href={`/kids/videos/${videoIdForLink}`}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </FadeInUp>
            </div>
        </div>
    );
}
