const crypto = require('crypto');

async function testCacheBustingCss() {
    const prodKidsToken = "19e95ec8-f4f5-464a-8062-b1c22298431a"; 
    const prodLibraryId = "603266";
    const videoId = "015146c8-f622-4fd0-9377-2123baa2e5dd";
    
    // Generate valid token
    const expires = Math.floor(Date.now() / 1000) + (6 * 60 * 60);
    const rawString = `${prodKidsToken}${videoId}${expires}`;
    const hash = crypto.createHash('sha256').update(rawString).digest('hex');

    // Add a random dummy parameter to bust the cache!
    const cacheBuster = Math.random().toString(36).substring(7);
    const iframeUrl = `https://iframe.mediadelivery.net/embed/${prodLibraryId}/${videoId}?token=${hash}&expires=${expires}&autoplay=false&cb=${cacheBuster}`;
    
    console.log("=== IFRAME CACHE BUSTER TEST ===");
    console.log("URL:", iframeUrl);
    
    try {
        const iframeRes = await fetch(iframeUrl);
        const html = await iframeRes.text();
        
        const cssIndex = html.indexOf('<style>');
        const cssEnd = html.indexOf('</style>', cssIndex);
        
        if (cssIndex !== -1 && cssEnd !== -1) {
            console.log("\nFound Custom CSS Length:");
            let cssContent = html.substring(cssIndex, cssEnd + 8);
            console.log(cssContent.length, "bytes");
            
            if (cssContent.includes('user-select: none')) {
                 console.log("The toxic CSS is STILL present in the HTML response!");
                 
                 // Let's also check if it's coming from standard Bunny Default!
                 if (cssContent.includes('.offline-overlay')) {
                    console.log("Wait, this looks like Bunny's default <style> block...");
                 }
            } else {
                 console.log("The CSS looks generic, no toxic user-select block!");
            }
        }
        
        // Find ALL style tags
        const styles = html.match(/<style(?:[^>]*)>(.*?)<\/style>/gs);
        if (styles) {
             console.log("\nTotal Style Tags Found:", styles.length);
             styles.forEach((s, i) => console.log(`Style ${i+1} Length:`, s.length));
        }
        
    } catch (err) {
        console.error("Test failed:", err);
    }
}
testCacheBustingCss();
