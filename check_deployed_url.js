async function checkLiveIframeSrc() {
    // Vercel deployment URL
    const url = "https://www.clubdespetitsmagiciens.fr/api/test-bunny";
    try {
        const res = await fetch(url);
        const json = await res.json();
        console.log("Live Vercel API returned URL:");
        console.log(json.kidsUrl);
        
        if (json.kidsUrl.includes("autoplay=false")) {
             console.log("SUCCESS! The autoplay=false fix is LIVE on Vercel.");
        } else if (json.kidsUrl.includes("autoplay=true")) {
             console.log("FAILURE! Vercel is STILL serving autoplay=true. The GitHub push has not finished building yet.");
        } else {
             console.log("Unknown status.");
        }
    } catch(e) {
        console.error("Vercel App not returning the test API:", e.message);
    }
}
checkLiveIframeSrc();
