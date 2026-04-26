const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'components/MagicCard.tsx');

let content = fs.readFileSync(targetFile, 'utf8');

// 1. cardBorder for Legendary
content = content.replace(
    'cardBorder = "border-[#FFD700]/60 ring-1 ring-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.3)]";',
    'cardBorder = "border-cyan-400/50 ring-1 ring-brand-purple/40 shadow-[0_0_30px_rgba(94,92,230,0.4)]";'
);

// 2. Glow behind card
content = content.replace(
    'isLegendary ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"',
    'isLegendary ? "bg-gradient-to-r from-brand-purple via-indigo-500 to-cyan-400"'
);

// 3. Hover gradient inside card
content = content.replace(
    'background: `linear-gradient(115deg, transparent 20%, rgba(255,215,0,0.8) 40%, rgba(255,100,0,0.6) 45%, rgba(255,255,0,0.6) 50%, rgba(255,215,0,0.8) 55%, transparent 70%)`,',
    'background: `linear-gradient(115deg, transparent 20%, rgba(94,92,230,0.8) 40%, rgba(34,211,238,0.6) 45%, rgba(94,92,230,0.6) 50%, rgba(94,92,230,0.8) 55%, transparent 70%)`,'
);

// 4. Badge colors
content = content.replace(
    'isLegendary ? "bg-amber-500/20 text-[#FFD700] border-[#FFD700]/30"',
    'isLegendary ? "bg-brand-purple/30 text-cyan-300 border-cyan-400/40"'
);

// 5. XP Sparkles
content = content.replace(
    'isLegendary ? "text-[#FFD700]" : "text-white/70"',
    'isLegendary ? "text-cyan-400" : "text-white/70"'
);

// 6. XP Text
content = content.replace(
    'isLegendary ? "text-[#FFD700]" : "text-white/90"',
    'isLegendary ? "text-cyan-400" : "text-white/90"'
);

// 7. Avatar Ring
content = content.replace(
    'isLegendary ? "bg-gradient-to-tr from-amber-500 via-yellow-200 to-orange-500"',
    'isLegendary ? "bg-gradient-to-tr from-cyan-400 via-brand-purple to-indigo-500"'
);

// 8. Name text shadow
content = content.replace(
    'isLegendary ? "text-[#FFD700]" : "text-white"',
    'isLegendary ? "text-cyan-300" : "text-white"'
);

// 9. XP progress text
content = content.replace(
    'isLegendary ? "text-amber-400" : "text-white"',
    'isLegendary ? "text-cyan-400" : "text-white"'
);

// 10. Progress bar
content = content.replace(
    'isLegendary ? "bg-gradient-to-r from-amber-600 to-yellow-400"',
    'isLegendary ? "bg-gradient-to-r from-brand-purple to-cyan-400"'
);

// 11. Back Central Glow
content = content.replace(
    'isLegendary ? "bg-amber-600" : isKid ? "bg-purple-600"',
    'isLegendary ? "bg-cyan-500" : isKid ? "bg-brand-purple"'
);

// 12. Back Geometric Emblem Borders
content = content.replace(
    'isLegendary ? "border-amber-500/30" : isKid ? "border-purple-500/30"',
    'isLegendary ? "border-cyan-400/40" : isKid ? "border-brand-purple/30"'
);

content = content.replace(
    'isLegendary ? "border-amber-500/20" : isKid ? "border-purple-500/20"',
    'isLegendary ? "border-cyan-400/30" : isKid ? "border-brand-purple/20"'
);

// 13. Back Geometric Emblem Star
content = content.replace(
    'isLegendary ? "text-[#FFD700] fill-amber-500/20" : isKid ? "text-purple-400 fill-purple-500/20"',
    'isLegendary ? "text-cyan-400 fill-cyan-400/20" : isKid ? "text-brand-purple fill-brand-purple/20"'
);

// 14. Back Tagline Text Colors
content = content.replace(
    'isLegendary ? "text-amber-400" : isKid ? "text-purple-400"',
    'isLegendary ? "text-cyan-400" : isKid ? "text-brand-purple"'
);

// 15. Back Verification Light
content = content.replace(
    'isLegendary ? "bg-amber-400" : isKid ? "bg-purple-400"',
    'isLegendary ? "bg-cyan-400" : isKid ? "bg-brand-purple"'
);

// Save
fs.writeFileSync(targetFile, content, 'utf8');
console.log("MagicCard updated.");
