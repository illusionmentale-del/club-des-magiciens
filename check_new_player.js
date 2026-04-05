const crypto = require('crypto');

async function testNewPlayerDomain() {
    const prodKidsToken = "19e95ec8-f4f5-464a-8062-b1c22298431a"; 
    const prodLibraryId = "603266";
    const videoId = "015146c8-f622-4fd0-9377-2123baa2e5dd";
    
    // Generate valid token
    const expires = Math.floor(Date.now() / 1000) + (6 * 60 * 60);
    const rawString = `${prodKidsToken}${videoId}${expires}`;
    const hash = crypto.createHash('sha256').update(rawString).digest('hex');

    // NEW PLAYER DOMAIN
    const newIframeUrl = `https://player.mediadelivery.net/embed/${prodLibraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=false`;
    
    console.log("=== NEW PLAYER DOMAIN TEST ===");
    console.log("URL:", newIframeUrl);
    
    try {
        const res = await fetch(newIframeUrl);
        console.log("HTTP Status:", res.status);
        const html = await res.text();
        
        if (html.includes("media-chrome")) {
            console.log("\nSUCCESS: Next-Gen Player Loaded!");
            
            // Extract the M3U8 string
            const hlsMatch = html.match(/src="([^"]+\.m3u8[^"]*)"/);
            if (hlsMatch) {
               console.log("M3U8 Asset:", hlsMatch[1].replace(/&amp;/g, '&'));
            } else {
               // Usually the new player injects it via JS
               console.log("Could not find raw M3U8 string, player might use an API endpoint.");
               
               // Let's find context
               const configStr = html.match(/context="([^"]+)"/);
               if (configStr) {
                   const decoded = Buffer.from(configStr[1], 'base64').toString('utf-8');
                   console.log("Context Data Length:", decoded.length);
                   if (decoded.includes('.m3u8')) {
                       console.log("Found m3u8 in encrypted context!");
                   }
               }
            }
        } else if (res.status !== 200) {
            console.log("FAILED to load new player domain with these tokens.");
        } else {
            console.log("Loaded something else. Maybe a fallback legacy player?");
        }
    } catch (err) {
        console.log("Err", err);
    }
}
testNewPlayerDomain();
