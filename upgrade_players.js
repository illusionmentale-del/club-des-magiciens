async function upgradePlayers() {
    const kidsLibraryId = "603266";
    const kidsApiKey = "60067ebf-a093-4c13-991115547406-8732-42ed"; 
    
    const adultsLibraryId = "603289";
    const adultsApiKey = "8794d68f-39e6-42a2-8ca49bc9941a-230f-467f";
    
    async function upgradeLibrary(id, key, name) {
        console.log(`\nUpgrading ${name} Library (${id})...`);
        try {
            const res = await fetch(`https://video.bunnycdn.com/library/${id}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'AccessKey': key
                },
                body: JSON.stringify({
                    PlayerVersion: "new",
                    CustomHTML: "", // Erase CSS just to be safe
                    BlockNoReferer: false, // Ensure this is off
                    EnableCdnTokenAuthentication: false, // Ensure this is off
                    EnableEmbedTokenAuthentication: true // Ensure this is ON
                })
            });
            console.log("Status:", res.status);
            if (res.status === 200) {
                 console.log("SUCCESS! Players upgraded completely.");
            } else {
                 console.log("Error:", await res.text());
                 
                 // Fallback to minimal payload
                 const res2 = await fetch(`https://video.bunnycdn.com/library/${id}`, {
                    method: 'POST',
                    headers: { 'accept': 'application/json', 'content-type': 'application/json', 'AccessKey': key },
                    body: JSON.stringify({ PlayerVersion: "new" })
                });
                console.log("Fallback Status:", res2.status);
            }
        } catch(e) { console.error(e); }
    }
    
    await upgradeLibrary(kidsLibraryId, kidsApiKey, "Kids");
    await upgradeLibrary(adultsLibraryId, adultsApiKey, "Adults");
}
upgradePlayers();
