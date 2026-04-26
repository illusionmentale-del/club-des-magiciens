const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'app/dashboard'),
    path.join(__dirname, 'app/admin/adults'),
    path.join(__dirname, 'components/adults'),
    path.join(__dirname, 'components/admin')
];

function processContent(content, filePath) {
    let original = content;

    // 1. Ambient Background Light Injection
    // Find the main wrapper div: usually `<div className="min-h-screen bg-[#000000]... ">`
    if (content.includes('className="min-h-screen bg-[#000000]') && !content.includes('radial-gradient')) {
        // Ensure overflow-hidden is there so the glow doesn't cause scrolling
        if (!content.includes('overflow-hidden relative selection')) {
            content = content.replace(/relative selection:/g, 'overflow-hidden relative selection:');
        }
        
        // Inject the ambient div right after the main div opens
        const regex = /(<div className="min-h-screen bg-\[#000000\][^>]+>)\s*/;
        const match = content.match(regex);
        if (match) {
            const ambientDiv = `\n            {/* Ambient Background Lights (Kids Theme) */}\n            <div className="absolute top-0 left-0 w-full md:w-1/2 h-[50vh] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/10 via-[#000000]/0 to-[#000000]/0 pointer-events-none z-0"></div>\n            `;
            content = content.replace(regex, `$1${ambientDiv}`);
        }
    }

    // 2. Selection color
    content = content.replace(/selection:bg-white\/30/g, 'selection:bg-brand-purple/30');

    // 3. Primary action buttons (white -> brand-purple gradient/glow)
    content = content.replace(/bg-\[#f5f5f7\] hover:bg-white text-black/g, 'bg-brand-purple hover:bg-indigo-500 text-black shadow-lg hover:shadow-brand-purple/30 hover:scale-105');
    content = content.replace(/bg-white text-black hover:bg-white\/90/g, 'bg-brand-purple text-black hover:bg-indigo-500 shadow-lg hover:shadow-brand-purple/30');
    content = content.replace(/bg-\[#f5f5f7\] text-black hover:bg-white/g, 'bg-brand-purple text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]');

    // 4. Secondary/Dark buttons
    content = content.replace(/bg-\[#2c2c2e\] hover:bg-white text-\[#f5f5f7\] hover:text-black/g, 'bg-[#2c2c2e]/50 hover:bg-white/10 text-white hover:text-white border border-white/5');

    // 5. Hover glows
    content = content.replace(/hover:border-white\/10/g, 'hover:border-brand-purple/30');
    // For text hovers on titles (group-hover)
    content = content.replace(/group-hover:text-white/g, 'group-hover:text-brand-purple');

    // 6. Icon accents in headers
    content = content.replace(/text-\[#86868b\] mb-2">\s*<Sparkles className="w-5 h-5 text-\[#f5f5f7\]"/g, 'text-brand-purple mb-2">\n                                <Sparkles className="w-5 h-5 fill-current animate-pulse text-brand-purple"');
    
    // Admin specific layout tweaks
    content = content.replace(/<Sparkles className="w-6 h-6 text-white" \/>/g, '<Sparkles className="w-6 h-6 text-brand-purple" />');
    content = content.replace(/bg-white\/5 rounded-\[16px\] flex items-center justify-center border border-white\/10/g, 'bg-brand-purple/20 rounded-[16px] flex items-center justify-center border border-brand-purple/30');
    content = content.replace(/text-\[#f5f5f7\] uppercase tracking-widest mb-4">Gestion/g, 'text-brand-purple uppercase tracking-widest mb-4">Gestion');
    content = content.replace(/text-3xl font-black text-\[#f5f5f7\] tracking-tighter uppercase/g, 'text-3xl font-black text-brand-text tracking-tighter uppercase');

    // Make text white instead of f5f5f7 for major titles to pop more
    // Actually, kids space uses text-white. Let's leave text-[#f5f5f7] as it's structurally fine.

    return { content, changed: original !== content };
}

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    const result = processContent(content, filePath);
    
    if (result.changed) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        console.log(`Injected Kids Theme: ${filePath}`);
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
console.log('Done deep injecting kids theme to all pages.');
