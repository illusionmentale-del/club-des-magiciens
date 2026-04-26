const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'app/kids'),
    path.join(__dirname, 'components/kids'),
    path.join(__dirname, 'components/KidsSidebar.tsx'),
    path.join(__dirname, 'components/KidsMobileNav.tsx'),
    path.join(__dirname, 'components/KidsLayoutClient.tsx'),
    path.join(__dirname, 'components/KidsAvatarSelector.tsx'),
    path.join(__dirname, 'components/KidsComments.tsx')
];

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Pink / Fuchsia replacements (The "Gemini" look)
    content = content.replace(/to-pink-500/g, 'to-indigo-500');
    content = content.replace(/to-pink-600/g, 'to-indigo-600');
    content = content.replace(/pink-500/g, 'brand-purple');
    content = content.replace(/pink-400/g, 'brand-purple');
    content = content.replace(/pink-600/g, 'indigo-600');
    content = content.replace(/fuchsia-500/g, 'brand-purple');
    content = content.replace(/rose-500/g, 'indigo-500');
    content = content.replace(/brand-pink/g, 'brand-purple');
    
    // Specifically fix "from-purple-600 to-pink-600"
    content = content.replace(/from-purple-600 to-indigo-600/g, 'from-brand-purple to-indigo-500');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const stats = fs.statSync(dir);
    if (stats.isFile()) {
        processFile(dir);
        return;
    }

    const files = fs.readdirSync(dir);
    for (const file of files) {
        traverseDir(path.join(dir, file));
    }
}

targetDirs.forEach(traverseDir);
console.log('Done removing pink/fuchsia colors.');
