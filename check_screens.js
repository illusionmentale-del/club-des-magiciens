const crypto = require('crypto');

async function testCurrentScreens() {
    const prodKidsToken = "19e95ec8-f4f5-464a-8062-b1c22298431a";
    const prodLibraryId = "603266";
    const videoId = "015146c8-f622-4fd0-9377-2123baa2e5dd";
    
    const expires = Math.floor(Date.now() / 1000) + (6 * 60 * 60);
    const rawString = `${prodKidsToken}${videoId}${expires}`;
    const hash = crypto.createHash('sha256').update(rawString).digest('hex');

    const iframeUrl = `https://iframe.mediadelivery.net/embed/${prodLibraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=true`;
    
    console.log("=== Testing Config from Screenshot ===");
    
    try {
        const iframeRes = await fetch(iframeUrl);
        console.log("Iframe Status:", iframeRes.status);
        
        const html = await iframeRes.text();
        const m3u8Match = html.match(/https:\/\/vz-[^\s"']+\/playlist\.m3u8/i);
        
        if (!m3u8Match) {
            console.log("FAILED: Cannot find m3u8 playlist in the iframe HTML.");
            return;
        }

        const m3u8Url = m3u8Match[0].replace(/&amp;/g, '&');
        console.log("M3U8 URL:", m3u8Url);

        // Safari Behavior
        const assetNoRef = await fetch(m3u8Url);
        console.log("Asset Status WITHOUT Referer (Safari):", assetNoRef.status);

        // Chrome/PC Behavior
        const assetWithRef = await fetch(m3u8Url, { headers: { 'Referer': 'https://iframe.mediadelivery.net/' } });
        console.log("Asset Status WITH Referer (Chrome):", assetWithRef.status);

    } catch (err) {
        console.error("Test failed:", err);
    }
}
testCurrentScreens();
