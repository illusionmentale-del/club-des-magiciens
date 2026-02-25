/**
 * Bunny Stream API Client
 * Used to interact with Bunny.net Video Libraries to fetch VOD content (Replays, Courses).
 */

const BUNNY_KIDS_LIBRARY_ID = process.env.BUNNY_KIDS_LIBRARY_ID;
const BUNNY_KIDS_API_KEY = process.env.BUNNY_KIDS_API_KEY;

export interface BunnyVideo {
    videoLibraryId: number;
    guid: string;
    title: string;
    dateUploaded: string;
    views: number;
    length: number;
    status: number;
    framerate: number;
    rotation: number;
    width: number;
    height: number;
    availableResolutions: string;
    thumbnailCount: number;
    encodeProgress: number;
    storageSize: number;
    captions: any[];
    hasMP4Fallback: boolean;
    collectionId: string;
    thumbnailFileName: string;
    averageWatchTime: number;
    totalWatchTime: number;
    category: string;
    chapters: any[];
    moments: any[];
    metaTags: any[];
    transcodingMessages: any[];
}

export interface BunnyCollection {
    videoLibraryId: number;
    guid: string;
    name: string;
    videoCount: number;
    totalSize: number;
    previewVideoIds: string;
}

/**
 * Fetch all videos from the Kids Video Library
 */
export async function getKidsVideos(page = 1, itemsPerPage = 100, collectionId?: string): Promise<BunnyVideo[]> {
    if (!BUNNY_KIDS_LIBRARY_ID || !BUNNY_KIDS_API_KEY) {
        console.error("Bunny Stream credentials for Kids are missing in environment variables.");
        return [];
    }

    let url = `https://video.bunnycdn.com/library/${BUNNY_KIDS_LIBRARY_ID}/videos?page=${page}&itemsPerPage=${itemsPerPage}&orderBy=date`;
    if (collectionId) {
        url += `&collection=${collectionId}`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'AccessKey': BUNNY_KIDS_API_KEY,
                'Accept': 'application/json',
            },
            // Revalidate every 60 seconds to keep cache fresh but performant
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            console.error(`Error fetching Bunny videos: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        return data.items as BunnyVideo[];
    } catch (error) {
        console.error("Failed to fetch videos from Bunny Stream:", error);
        return [];
    }
}

/**
 * Fetch a specific video by its ID (GUID)
 */
export async function getKidsVideoById(videoId: string): Promise<BunnyVideo | null> {
    if (!BUNNY_KIDS_LIBRARY_ID || !BUNNY_KIDS_API_KEY) {
        return null;
    }

    const url = `https://video.bunnycdn.com/library/${BUNNY_KIDS_LIBRARY_ID}/videos/${videoId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'AccessKey': BUNNY_KIDS_API_KEY,
                'Accept': 'application/json',
            },
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            return null;
        }

        return await response.json() as BunnyVideo;
    } catch (error) {
        console.error(`Failed to fetch video ${videoId}:`, error);
        return null;
    }
}

/**
 * Get thumbnail URL for a video
 */
export function getBunnyThumbnailUrl(libraryId: string | number, videoId: string, thumbnailFileName: string = 'thumbnail.jpg'): string {
    // Bunny CDN thumbnail format: https://[pull-zone].b-cdn.net/[video-id]/[thumbnail-file-name]
    // Note: To make this more robust, you should map library IDs to their corresponding Pull Zone hostnames.
    // For now, Bunny also provides a default delivery format if you didn't set up a custom hostname:
    // https://vz-[uuid].b-cdn.net
    //
    // The safest way without hardcoding the pull zone is to use the default delivery URL which we will define as a helper.
    // However, the best practice is to configure your CDN Pull Zone Hostname in .env
    const pullZone = process.env.NEXT_PUBLIC_BUNNY_KIDS_PULL_ZONE || `vz-1c1a28b8-8f2.b-cdn.net`; // Using the one we saw in screenshots

    return `https://${pullZone}/${videoId}/${thumbnailFileName}`;
}

/**
 * Get iframe embed URL for a video
 */
export function getBunnyIframeUrl(libraryId: string | number, videoId: string): string {
    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`;
}
