const crypto = require('crypto');

async function checkDesperate() {
    const prodKidsToken = "19e95ec8-f4f5-464a-8062-b1c22298431a"; // As given by the user previously
    const prodLibraryId = "603266";
    const videoId = "015146c8-f622-4fd0-9377-2123baa2e5dd";
    
    // Generate valid token
    const expires = Math.floor(Date.now() / 1000) + (6 * 60 * 60);
    const rawString = `${prodKidsToken}${videoId}${expires}`;
    const hash = crypto.createHash('sha256').update(rawString).digest('hex');

    // 1. Test Iframe Access
    const iframeUrl = `https://iframe.mediadelivery.net/embed/${prodLibraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=true`;
    console.log("=== IFRAME TEST ===");
    console.log("URL:", iframeUrl);
    
    try {
        const iframeRes = await fetch(iframeUrl);
        console.log("Iframe Status:", iframeRes.status);
        
        if (iframeRes.status !== 200) {
            console.log("FAILED: Iframe is blocked.");
            return;
        }

        const html = await iframeRes.text();
        const m3u8Match = html.match(/https:\/\/vz-[^\s"']+\/playlist\.m3u8/i);
        
        if (!m3u8Match) {
            console.log("FAILED: Cannot find m3u8 playlist in the HTML.");
            return;
        }

        const m3u8Url = m3u8Match[0].replace(/&amp;/g, '&');
        console.log("\n=== ASSET TEST (M3U8) ===");
        console.log("M3U8 URL:", m3u8Url);

        // 2. Test Asset without Referer (Safari Behavior)
        const assetNoRef = await fetch(m3u8Url);
        console.log("Asset Status WITHOUT Referer:", assetNoRef.status);

        // 3. Test Asset with Referer (Chrome/PC Behavior)
        const assetWithRef = await fetch(m3u8Url, { headers: { 'Referer': 'https://iframe.mediadelivery.net/' } });
        console.log("Asset Status WITH Referer:", assetWithRef.status);

    } catch (err) {
        console.error("Test failed:", err);
    }
}

checkDesperate();
