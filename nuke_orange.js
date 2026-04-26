const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'app/kids'),
    path.join(__dirname, 'components/kids'),
    path.join(__dirname, 'components/KidsSidebar.tsx'),
    path.join(__dirname, 'components/KidsMobileNav.tsx'),
    path.join(__dirname, 'components/KidsAvatarSelector.tsx'),
    path.join(__dirname, 'components/KidsComments.tsx')
];

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove any leftover orange/amber/yellow
    content = content.replace(/yellow-400/g, 'cyan-400');
    content = content.replace(/yellow-600/g, 'indigo-600');
    content = content.replace(/amber-400/g, 'cyan-400');
    content = content.replace(/amber-500/g, 'brand-purple');
    content = content.replace(/amber-600/g, 'indigo-600');
    content = content.replace(/orange-100/g, 'indigo-100');
    content = content.replace(/orange-200/g, 'indigo-200');
    content = content.replace(/orange-400/g, 'cyan-400');
    content = content.replace(/orange-500/g, 'brand-purple');
    content = content.replace(/orange-600/g, 'indigo-600');
    
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
console.log('Done nuking orange/yellow/amber.');
