async function cacheTest() {
    console.log("=== CACHE DELAY TEST ===");
    const m3u8Url = "https://vz-1c1a28b8-8f2.b-cdn.net/015146c8-f622-4fd0-9377-2123baa2e5dd/playlist.m3u8";

    // 1. Without Referer (Safari)
    const assetNoRef = await fetch(m3u8Url);
    console.log("Asset Status WITHOUT Referer:", assetNoRef.status);

    // 2. With Referer (Chrome)
    const assetWithRef = await fetch(m3u8Url, { headers: { 'Referer': 'https://iframe.mediadelivery.net/' } });
    console.log("Asset Status WITH Referer:", assetWithRef.status);
    
    // Also test a dummy cache buster to force edge evaluation
    const assetBuster = await fetch(m3u8Url + "?t=" + Date.now());
    console.log("Asset Status WITH Cache Buster:", assetBuster.status);
}

cacheTest();
