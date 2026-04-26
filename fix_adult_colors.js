const fs = require('fs');
const path = require('path');

const dirs = [
    'app/admin/adults',
    'app/tarifs/atelier-des-magiciens',
    'app/login/adults',
    'app/acces-prive-atelier'
];

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

let allFiles = [];
dirs.forEach(dir => {
    allFiles = allFiles.concat(walk(dir));
});

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace brand-purple with brand-blue
    content = content.replace(/brand-purple/g, 'brand-blue');
    
    // Replace RGB for glow shadows: 168,85,247 -> 59,130,246
    content = content.replace(/168,85,247/g, '59,130,246');
    
    // Some places might use text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-400
    // If it changed to brand-blue, we should also change purple-400 to blue-400
    content = content.replace(/purple-400/g, 'blue-400');
    content = content.replace(/purple-500/g, 'blue-500');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
});
