async function testApi() {
    const libraryId = "603266";
    const apiKey = "60067ebf-a093-4c13-991115547406-8732-42ed"; // Kids API Key from env
    
    try {
        const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'AccessKey': apiKey
            }
        });
        
        console.log("Status:", res.status);
        if (res.status === 200) {
            const data = await res.json();
            console.log("Library details found!");
            console.log("BlockDirectAccess:", data.BlockNoReferer);
            console.log("CdnTokenAuth:", data.EnableCdnTokenAuthentication);
            console.log("EmbedTokenAuth:", data.EnableEmbedTokenAuthentication);
            console.log("CustomHTML:", !!data.CustomHTML);
            console.log("PlayerVersion:", data.PlayerVersion);
        } else {
            console.log("Failed to get library:", await res.text());
        }
    } catch(e) {
        console.error(e);
    }
}
testApi();
