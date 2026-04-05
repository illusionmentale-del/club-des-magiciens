const crypto = require('crypto');

async function testCurrent() {
    const prodKidsToken = "19e95ec8-f4f5-464a-8062-b1c22298431a";
    const prodLibraryId = "603266";
    const videoId = "015146c8-f622-4fd0-9377-2123baa2e5dd";
    
    // Simulate Vercel token generation
    const expires = Math.floor(Date.now() / 1000) + (6 * 60 * 60);
    const rawString = `${prodKidsToken}${videoId}${expires}`;
    const hash = crypto.createHash('sha256').update(rawString).digest('hex');

    const testUrl = `https://iframe.mediadelivery.net/embed/${prodLibraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=true`;
    console.log("Testing Prod Iframe:", testUrl);
    
    // First, test if iframe is accessible.
    const res = await fetch(testUrl);
    console.log("Iframe Status:", res.status);
    if (res.status !== 200) {
        console.log("IFRAME REJECTED. The Token Auth Key is wrong.");
        return;
    }

    const html = await res.text();
    const m3u8Match = html.match(/https:\/\/vz-[^\s"']+\/playlist\.m3u8/i);
    
    if (m3u8Match) {
         const m3u8Url = m3u8Match[0];
         console.log("\nFound m3u8 URL:", m3u8Url);
         
         // Test without Referer (Safari Private Mode behavior)
         const resNoRef = await fetch(m3u8Url);
         console.log("M3U8 Status (No Referer):", resNoRef.status);

         // Test with Referer (Chrome behavior)
         const resWithRef = await fetch(m3u8Url, { headers: { 'Referer': 'https://iframe.mediadelivery.net/' } });
         console.log("M3U8 Status (With Referer):", resWithRef.status);
    }
}
testCurrent();
