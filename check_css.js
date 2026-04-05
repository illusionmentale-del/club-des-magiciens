const crypto = require('crypto');

async function checkCSS() {
    const prodKidsToken = "19e95ec8-f4f5-464a-8062-b1c22298431a"; 
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
        const html = await iframeRes.text();
        
        // Check for Custom CSS injection tag
        const cssIndex = html.indexOf('<style>');
        const cssEnd = html.indexOf('</style>');
        
        if (cssIndex !== -1 && cssEnd !== -1) {
            console.log("\nFound Custom CSS in Iframe HEAD:");
            let cssContent = html.substring(cssIndex, cssEnd + 8);
            
            // Exclude the default Bunny CSS if possible
            if (cssContent.includes('.offline-overlay') && html.indexOf('<style>', cssEnd) === -1) {
                 console.log("Only default Bunny CSS found.");
            } else {
                 console.log(cssContent.substring(0, 300) + "...");
            }
        }
        
        // Also let's check the entire <head> for any custom user injections
        const headMatch = html.match(/<head>(.*?)<\/head>/s);
        if (headMatch) {
            const head = headMatch[1];
            if (head.includes('font-family')) {
                 console.log("Found font-family injection.");
                 
                 // Look closer
                 const matches = head.match(/<style(?:[^>]*)>(.*?)<\/style>/gs);
                 if (matches) {
                      matches.forEach((m, i) => console.log(`Style Block ${i+1}:`, m.length, "bytes"));
                 }
            }
        }

        // Check window player configuration
        const configMatch = html.match(/const playerConfig = ({[\s\S]*?});/);
        if (configMatch) {
            const configStr = configMatch[1];
            console.log("Player Config Custom CSS Field:", configStr.includes('customCss') ? "Exists" : "Doesn't exist");
            const customCssVal = configStr.match(/"customCss":"(.*?)"/);
            if (customCssVal) {
                console.log("Custom CSS value:", customCssVal[1] === "" ? "EMPTY" : customCssVal[1].substring(0, 50) + "...");
            }
        }
    } catch (err) {
        console.error("Test failed:", err);
    }
}
checkCSS();
