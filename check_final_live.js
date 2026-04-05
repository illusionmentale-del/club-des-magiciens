const crypto = require('crypto');

async function testFinalLive() {
    const prodKidsToken = "19e95ec8-f4f5-464a-8062-b1c22298431a";
    const prodLibraryId = "603266";
    const videoId = "015146c8-f622-4fd0-9377-2123baa2e5dd";
    
    // Simulate Vercel token generation
    const expires = Math.floor(Date.now() / 1000) + (6 * 60 * 60);
    const rawString = `${prodKidsToken}${videoId}${expires}`;
    const hash = crypto.createHash('sha256').update(rawString).digest('hex');

    const testUrl = `https://iframe.mediadelivery.net/embed/${prodLibraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=true`;
    console.log("Testing Prod Iframe:", testUrl);
    
    // Test if player loads WITHOUT Referer (like Safari Private)
    const res = await fetch(testUrl);
    console.log("HTTP Status Iframe (No Referer):", res.status);
    
    if (res.status === 403) {
        console.log("IFRAME IS BLOCKED (403). Embed View Token Authentication might be misconfigured or the Secret Key doesn't match.");
        return;
    }

    const html = await res.text();
    
    // Extract thumbnail url
    const thumbMatch = html.match(/https:\/\/vz-[^\s"']+\/thumbnail\.jpg/i);
    
    if (thumbMatch) {
         console.log("\nThumbnail URL found:", thumbMatch[0]);
         
         const thumbResNoRef = await fetch(thumbMatch[0]);
         console.log("Thumbnail Status (No Referer / Safari mode):", thumbResNoRef.status);

         const thumbResWithRef = await fetch(thumbMatch[0], { headers: { 'Referer': 'https://iframe.mediadelivery.net/' } });
         console.log("Thumbnail Status (With Iframe Referer):", thumbResWithRef.status);
    } else {
         console.log("No thumbnail URL found in HTML.");
    }
}
testFinalLive();
