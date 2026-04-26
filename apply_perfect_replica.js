const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'app/dashboard'),
    path.join(__dirname, 'app/admin/adults'),
    path.join(__dirname, 'components/adults')
];

const specificFiles = [
    path.join(__dirname, 'components/admin/AdultHomeBlockToggles.tsx'),
    path.join(__dirname, 'components/admin/AdultLabelsConfig.tsx'),
    path.join(__dirname, 'components/admin/AdultMenuToggles.tsx'),
    path.join(__dirname, 'components/admin/AdminAdultsMobileNav.tsx'),
    path.join(__dirname, 'components/Sidebar.tsx'),
    path.join(__dirname, 'components/MobileNav.tsx'),
    path.join(__dirname, 'app/dashboard/account/AccountForm.tsx')
];

function replaceColors(content) {
    let original = content;

    // Replicate EXACTLY brand-purple everywhere there was a legacy color
    const replaces = [
        [/to-amber-500/g, 'to-brand-purple'],
        [/to-amber-600/g, 'to-indigo-500'],
        [/to-yellow-[456]00/g, 'to-brand-purple'],
        [/to-brand-gold/g, 'to-brand-purple'],
        [/to-magic-gold/g, 'to-brand-purple'],
        [/to-brand-royal/g, 'to-brand-purple'],
        
        [/from-amber-[45]00/g, 'from-brand-purple'],
        [/from-amber-600/g, 'from-indigo-600'],
        [/from-yellow-[456]00/g, 'from-brand-purple'],
        [/from-brand-gold/g, 'from-brand-purple'],
        [/from-magic-gold/g, 'from-brand-purple'],
        [/from-brand-royal/g, 'from-brand-purple'],

        [/bg-amber-[45]00/g, 'bg-brand-purple'],
        [/bg-amber-600/g, 'bg-indigo-600'],
        [/bg-yellow-[456]00/g, 'bg-brand-purple'],
        [/bg-brand-gold/g, 'bg-brand-purple'],
        [/bg-magic-gold/g, 'bg-brand-purple'],
        [/bg-brand-royal/g, 'bg-brand-purple'],

        [/text-amber-[45]00/g, 'text-brand-purple'],
        [/text-amber-600/g, 'text-indigo-500'],
        [/text-yellow-[456]00/g, 'text-brand-purple'],
        [/text-brand-gold/g, 'text-brand-purple'],
        [/text-magic-gold/g, 'text-brand-purple'],
        [/text-brand-royal/g, 'text-brand-purple'],

        [/border-amber-[456]00/g, 'border-brand-purple'],
        [/border-yellow-[456]00/g, 'border-brand-purple'],
        [/border-brand-gold/g, 'border-brand-purple'],
        [/border-magic-gold/g, 'border-brand-purple'],
        [/border-brand-royal/g, 'border-brand-purple'],

        [/ring-amber-500/g, 'ring-brand-purple'],
        [/ring-yellow-500/g, 'ring-brand-purple'],
        [/ring-brand-gold/g, 'ring-brand-purple'],
        [/ring-brand-royal/g, 'ring-brand-purple'],
        
        [/shadow-amber-500/g, 'shadow-brand-purple'],
        [/shadow-brand-royal/g, 'shadow-brand-purple'],

        [/250,204,21/g, '94,92,230']
    ];

    replaces.forEach(([regex, replacement]) => {
        content = content.replace(regex, replacement);
    });

    return { content, changed: original !== content };
}

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    const result = replaceColors(content);
    
    if (result.changed) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        console.log(`Updated Base Colors: ${filePath}`);
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
specificFiles.forEach(processFile);

// 2. Inject brand-purple perfectly into monochrome elements

function injectMonochrome(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    replacements.forEach(({from, to}) => {
        content = content.split(from).join(to);
    });
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Injected Monochrome Colors: ${filePath}`);
    }
}

// Sidebar.tsx (Match Kids Admin Sidebar active state: bg-brand-purple/20 border-brand-purple/30 text-brand-purple)
injectMonochrome(path.join(__dirname, 'components/Sidebar.tsx'), [
    { from: "bg-white/10 text-[#f5f5f7]", to: "bg-brand-purple/20 border border-brand-purple/30 text-brand-purple" },
    { from: "hover:bg-white/5 hover:text-[#f5f5f7]", to: "hover:bg-brand-purple/10 hover:text-brand-purple" },
]);

// MobileNav.tsx
injectMonochrome(path.join(__dirname, 'components/MobileNav.tsx'), [
    { from: "bg-white/10 text-white", to: "bg-brand-purple/20 border border-brand-purple/30 text-brand-purple" },
    { from: "text-[#86868b] hover:text-white hover:bg-white/5", to: "text-[#86868b] hover:text-brand-purple hover:bg-brand-purple/10" },
]);

// AdultProgression.tsx
injectMonochrome(path.join(__dirname, 'components/adults/AdultProgression.tsx'), [
    { from: 'className="w-5 h-5 text-[#86868b]"', to: 'className="w-5 h-5 text-brand-purple"' },
    { from: 'h-full bg-[#f5f5f7]', to: 'h-full bg-brand-purple' },
    { from: 'text-black bg-[#f5f5f7] hover:bg-white', to: 'text-white bg-brand-purple hover:bg-indigo-500 shadow-lg shadow-brand-purple/20' }
]);

// dashboard/page.tsx (Adult Home)
injectMonochrome(path.join(__dirname, 'app/dashboard/page.tsx'), [
    { from: 'text-white font-serif italic', to: 'text-brand-purple font-serif italic' },
    { from: 'w-5 h-5 text-[#f5f5f7]', to: 'w-5 h-5 text-brand-purple' }, // Sparkles icon
    { from: 'bg-[#f5f5f7] text-black hover:bg-white', to: 'bg-brand-purple text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]' } // Boutique button (like Kids settings button)
]);

// AdultAchievements.tsx
injectMonochrome(path.join(__dirname, 'components/adults/AdultAchievements.tsx'), [
    { from: 'w-5 h-5 text-[#86868b]', to: 'w-5 h-5 text-brand-purple' },
    { from: 'text-[#86868b] group-hover:text-white', to: 'text-brand-purple group-hover:text-indigo-400' }
]);

// AdultNewsFeed.tsx
injectMonochrome(path.join(__dirname, 'components/adults/AdultNewsFeed.tsx'), [
    { from: 'w-5 h-5 text-[#86868b]', to: 'w-5 h-5 text-brand-purple' },
    { from: 'group-hover:text-white', to: 'group-hover:text-brand-purple' }
]);

// Also modify globals.css
const globalsPath = path.join(__dirname, 'app/globals.css');
if (fs.existsSync(globalsPath)) {
    let globalsContent = fs.readFileSync(globalsPath, 'utf8');
    let originalGlobals = globalsContent;
    globalsContent = globalsContent.replace(/--color-brand-gold: #f59e0b;/g, '--color-brand-gold: #5E5CE6; /* Brand Purple */');
    globalsContent = globalsContent.replace(/--color-brand-royal: #f59e0b;/g, '--color-brand-royal: #5E5CE6; /* Brand Purple */');
    if (originalGlobals !== globalsContent) {
        fs.writeFileSync(globalsPath, globalsContent, 'utf8');
        console.log(`Updated Base Colors: ${globalsPath}`);
    }
}

console.log('Done replicating perfect Kids colors.');
