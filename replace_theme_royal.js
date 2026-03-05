const fs = require('fs');
const path = require('path');

const folders = [
    'app/admin/adults',
    'app/dashboard',
    'app/watch',
    'components/adults',
    'app/tarifs/atelier-des-magiciens'
];

const exactFiles = [
    'components/Sidebar.tsx',
    'components/MobileNav.tsx',
    'components/VideoPlayerControls.tsx',
    'components/AdultBoutiqueCard.tsx',
    'components/dashboard/BientotDispo.tsx'
];

const walkSync = function (dir, filelist) {
    let files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                filelist.push(path.join(dir, file));
            }
        }
    });
    return filelist;
};

let allFiles = [...exactFiles];
folders.forEach(f => {
    if (fs.existsSync(f)) {
        allFiles = allFiles.concat(walkSync(f, []));
    }
});

const replacements = [
    { old: /magic-gold/g, new: 'magic-royal' },
    { old: /brand-gold/g, new: 'brand-royal' },
    { old: /orange-400/g, new: 'blue-500' },
    { old: /orange-500/g, new: 'blue-700' },
    { old: /orange-600/g, new: 'blue-900' },
    { old: /yellow-400/g, new: 'blue-400' }
];

allFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content;
        replacements.forEach(r => {
            newContent = newContent.replace(r.old, r.new);
        });
        if (content !== newContent) {
            fs.writeFileSync(file, newContent);
            console.log('Updated ' + file);
        }
    }
});
