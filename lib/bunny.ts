/**
 * Bunny Stream API Client
 * Used to interact with Bunny.net Video Libraries to fetch VOD content (Replays, Courses).
 */

const BUNNY_KIDS_LIBRARY_ID = process.env.BUNNY_KIDS_LIBRARY_ID;
const BUNNY_KIDS_API_KEY = process.env.BUNNY_KIDS_API_KEY;

const BUNNY_ADULTS_LIBRARY_ID = process.env.BUNNY_ADULTS_LIBRARY_ID;
const BUNNY_ADULTS_API_KEY = process.env.BUNNY_ADULTS_API_KEY;

// Token Keys for Secure URL Generation (from Bunny > Security > Token Authentication)
const BUNNY_KIDS_TOKEN_KEY = process.env.BUNNY_KIDS_TOKEN_KEY;
const BUNNY_ADULTS_TOKEN_KEY = process.env.BUNNY_ADULTS_TOKEN_KEY;


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
 * Fetch all videos from the Adults Video Library
 */
export async function getAdultVideos(page = 1, itemsPerPage = 100, collectionId?: string): Promise<BunnyVideo[]> {
    if (!BUNNY_ADULTS_LIBRARY_ID || !BUNNY_ADULTS_API_KEY) {
        console.error("Bunny Stream credentials for Adults are missing in environment variables.");
        return [];
    }

    let url = `https://video.bunnycdn.com/library/${BUNNY_ADULTS_LIBRARY_ID}/videos?page=${page}&itemsPerPage=${itemsPerPage}&orderBy=date`;
    if (collectionId) {
        url += `&collection=${collectionId}`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'AccessKey': BUNNY_ADULTS_API_KEY,
                'Accept': 'application/json',
            },
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            console.error(`Error fetching adult Bunny videos: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        return data.items as BunnyVideo[];
    } catch (error) {
        console.error("Failed to fetch adult videos from Bunny Stream:", error);
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
 * Get secure iframe embed URL for a video (Token Authentication)
 * Requires Node.js "crypto" module on the server side.
 */
export async function getSecureBunnyIframeUrl(defaultLibraryId: string | number, rawVideoId: string, isKid: boolean = false): Promise<string> {
    let tokenKey = isKid ? BUNNY_KIDS_TOKEN_KEY : BUNNY_ADULTS_TOKEN_KEY;
    let libraryId = defaultLibraryId;

    // Smart parsing: If user pasted an entire Direct Play URL (e.g. from a different library)
    // Format: https://player.mediadelivery.net/play/631687/4ffb57...
    const urlMatch = rawVideoId.match(/play\/(\d+)\/([a-f0-9-]+)/i);
    let videoId = rawVideoId;
    if (urlMatch) {
        libraryId = urlMatch[1]; // Detect custom library ID automatically
        videoId = urlMatch[2];
        // If it's a completely unknown library, we don't have its TokenKey. Reset it to fallback to unsecure URL securely.
        if (libraryId !== process.env.BUNNY_KIDS_LIBRARY_ID && libraryId !== process.env.BUNNY_ADULTS_LIBRARY_ID) {
            tokenKey = undefined; 
        }
    } else {
        const uuidMatch = rawVideoId.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
        if (uuidMatch) videoId = uuidMatch[1];
    }

    // If no token key is configured or we're using an external foreign library ID, fallback to standard URL
    if (!tokenKey) {
        console.warn(`Bunny Stream Token Key missing for ${isKid ? 'Kids' : 'Adults'}. Falling back to insecure Iframe URL.`);
        const fallbackColor = isKid ? 'a855f7' : '1d4ed8';
        return `https://player.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true&primaryColor=${fallbackColor}`;
    }

    // Bunny Stream Token Auth logic
    // 1. Set Expiration Time (e.g., 6 hours from now)
    const expires = Math.floor(Date.now() / 1000) + (6 * 60 * 60);

    // 2. Prepare the string to hash: SecurityKey + VideoID + ExpirationTime
    const rawString = `${tokenKey}${videoId}${expires}`;

    // 3. Import crypto (only works on Next.js server side environment)
    const crypto = await import('crypto');

    // 4. Generate SHA256 Hash
    const hash = crypto.createHash('sha256').update(rawString).digest('hex');

    // 5. Construct secure URL
    // Upgraded to next-gen player domain with custom brand colors
    const brandColor = isKid ? 'a855f7' : '1d4ed8'; // Purple for kids, Royal Blue for adults
    return `https://player.mediadelivery.net/embed/${libraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=false&loop=false&muted=false&preload=true&responsive=true&primaryColor=${brandColor}`;
}

