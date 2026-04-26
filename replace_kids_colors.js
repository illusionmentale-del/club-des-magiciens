const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'app/kids'),
    path.join(__dirname, 'components/kids'),
    path.join(__dirname, 'components/KidsSidebar.tsx'),
    path.join(__dirname, 'components/KidsMobileNav.tsx'),
    path.join(__dirname, 'components/KidsLayoutClient.tsx')
];

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Direct replacements
    content = content.replace(/brand-gold/g, 'brand-purple');
    content = content.replace(/magic-gold/g, 'brand-purple');
    content = content.replace(/brand-royal/g, 'brand-purple');
    content = content.replace(/magic-royal/g, 'brand-purple');
    
    // Gradients
    content = content.replace(/from-yellow-400/g, 'from-brand-purple');
    content = content.replace(/from-yellow-500/g, 'from-brand-purple');
    content = content.replace(/to-amber-500/g, 'to-indigo-500');
    content = content.replace(/to-amber-600/g, 'to-indigo-500');
    content = content.replace(/to-yellow-500/g, 'to-indigo-500');
    content = content.replace(/hover:bg-yellow-400/g, 'hover:bg-indigo-500');
    content = content.replace(/text-yellow-300/g, 'text-indigo-300');
    
    // Hardcoded RGB from shadows
    content = content.replace(/250,204,21/g, '94,92,230'); // rgb for #5E5CE6
    content = content.replace(/251,191,36/g, '94,92,230');

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
console.log('Done replacing kids colors.');
