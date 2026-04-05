const { execSync } = require('child_process');

function updateEnv(key, val) {
    try {
        console.log(`Removing ${key}...`);
        execSync(`npx vercel env rm ${key} production --yes`);
    } catch(e) {
        console.log("Could not remove (might not exist).");
    }
    
    try {
        console.log(`Adding ${key}...`);
        execSync(`printf "${val}" | npx vercel env add ${key} production`);
        console.log(`Successfully added ${key}`);
    } catch(e) {
        console.error("Error adding:", e.message);
    }
}

console.log("Starting Vercel Env Cleanup...");
updateEnv("BUNNY_ADULTS_API_KEY", "8794d68f-39e6-42a2-8ca49bc9941a-230f-467f");
updateEnv("BUNNY_ADULTS_LIBRARY_ID", "603289");
updateEnv("BUNNY_KIDS_API_KEY", "60067ebf-a093-4c13-991115547406-8732-42ed");
updateEnv("BUNNY_KIDS_LIBRARY_ID", "603266");

console.log("\nFinished updating ENV variables. Deploying to production so they take effect...");
try {
    execSync(`npx vercel --prod --yes`, { stdio: 'inherit' });
    console.log("Deployment finished successfully!");
} catch(e) {
    console.error("Deployment failed:", e.message);
}
