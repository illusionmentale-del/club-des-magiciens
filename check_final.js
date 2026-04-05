const crypto = require('crypto');

async function testFinal() {
    const prodKidsToken = "19e95ec8-f4f5-464a-8062-b1c22298431a";
    const prodLibraryId = "603266";
    const videoId = "015146c8-f622-4fd0-9377-2123baa2e5dd";
    
    // Simulate Vercel token generation
    const expires = Math.floor(Date.now() / 1000) + (6 * 60 * 60);
    const rawString = `${prodKidsToken}${videoId}${expires}`;
    const hash = crypto.createHash('sha256').update(rawString).digest('hex');

    const testUrl = `https://iframe.mediadelivery.net/embed/${prodLibraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=true`;
    console.log("Testing Prod Iframe:", testUrl);
    
    // Test if player loads
    const res = await fetch(testUrl);
    console.log("HTTP Status Iframe:", res.status);
    const html = await res.text();
    
    // Extract thumbnail and m3u8 URLs from the HTML
    const thumbMatch = html.match(/https:\/\/vz-[^\s"']+\/thumbnail\.jpg/i);
    const m3u8Match = html.match(/https:\/\/vz-[^\s"']+\/playlist\.m3u8/i);
    
    if (thumbMatch) {
         console.log("\nThumbnail URL found. Testing access...");
         const thumbRes = await fetch(thumbMatch[0], { headers: { 'Referer': 'https://iframe.mediadelivery.net/' } });
         console.log("Thumbnail Status (with Iframe Referer):", thumbRes.status);
         
         const thumbResNoRef = await fetch(thumbMatch[0]);
         console.log("Thumbnail Status (No Referer / Safari mode):", thumbResNoRef.status);
    } else {
         console.log("No thumbnail URL found in HTML.");
    }
    
    if (m3u8Match) {
         console.log("\nm3u8 URL found. Testing access...");
         const m3u8Res = await fetch(m3u8Match[0], { headers: { 'Referer': 'https://iframe.mediadelivery.net/' } });
         console.log("m3u8 Status (with Iframe Referer):", m3u8Res.status);
         
         const m3u8ResNoRef = await fetch(m3u8Match[0]);
         console.log("m3u8 Status (No Referer / Safari mode):", m3u8ResNoRef.status);
    } else {
         console.log("No m3u8 URL found in HTML.");
    }
}
testFinal();
