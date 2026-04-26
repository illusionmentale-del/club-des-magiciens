const fs = require('fs');
const path = require('path');

const DIRECTORY = path.join(__dirname, 'app', 'admin', 'adults');

const REPLACEMENTS = [
    {
        from: /bg-\[#f5f5f7\] hover:bg-white text-\[#1c1c1e\]/g,
        to: "bg-brand-purple hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border-transparent"
    },
    {
        from: /bg-\[#1c1c1e\]/g,
        to: "bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/30 transition-all"
    },
    // Fix any potential duplicates of border and shadow that might happen if a class already had a border
    {
        from: /border border-white\/5 shadow-\[0_20px_50px_-15px_rgba\(0,0,0,0\.5\)\] hover:border-brand-purple\/30 transition-all border border-white\/5/g,
        to: "bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/30 transition-all"
    },
    {
        from: /text-\[#f5f5f7\]/g,
        to: "text-brand-text"
    },
    {
        from: /text-\[#86868b\]/g,
        to: "text-brand-text-muted"
    }
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            for (const { from, to } of REPLACEMENTS) {
                content = content.replace(from, to);
            }

            // Cleanup potential duplicate borders we just injected
            content = content.replace(/border border-white\/5 (.*?) border border-white\/5/g, "border border-white/5 $1");

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(DIRECTORY);
console.log("Done updating CSS classes.");
