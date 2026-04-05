async function checkVercel() {
    try {
        // Checking the live login page just to see if the server responds
        const res = await fetch("https://www.clubdespetitsmagiciens.fr/");
        console.log("Vercel HTTP Status:", res.status);
    } catch (e) {
        console.error(e);
    }
}
checkVercel();
