const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'app/admin/kids'),
    path.join(__dirname, 'components/admin')
];

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Remove pink/fuchsia (Gemini)
    content = content.replace(/to-pink-500/g, 'to-indigo-500');
    content = content.replace(/to-pink-600/g, 'to-indigo-600');
    content = content.replace(/pink-500/g, 'brand-purple');
    content = content.replace(/pink-400/g, 'brand-purple');
    content = content.replace(/pink-600/g, 'indigo-600');
    content = content.replace(/fuchsia-500/g, 'brand-purple');
    content = content.replace(/rose-500/g, 'indigo-500');
    content = content.replace(/brand-pink/g, 'brand-purple');
    content = content.replace(/from-purple-600 to-indigo-600/g, 'from-brand-purple to-indigo-500');

    // 2. Remove orange/yellow (Except maybe for specific admin stuff? No, let's just make it sleek)
    // Wait, in Admin, we want it to be clean.
    // If they have yellow/orange in the admin kids space, we should replace it with brand-purple/indigo
    content = content.replace(/brand-gold/g, 'brand-purple');
    content = content.replace(/magic-gold/g, 'brand-purple');
    content = content.replace(/brand-royal/g, 'brand-purple');
    content = content.replace(/magic-royal/g, 'brand-purple');
    
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
console.log('Done fixing admin colors.');
