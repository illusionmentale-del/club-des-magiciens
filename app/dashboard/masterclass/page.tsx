import { Sparkles, Star, ChevronRight, Lock, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Mes Formations | Club des Magiciens',
    description: 'Accède à tes formations complètes.',
};

export default async function AdultMasterclassPage() {
    // Les 3 formations piliers
    const formations = [
        {
            id: 'debutant',
            title: 'Formation Débutant',
            description: 'Les bases fondamentales de la prestidigitation. Cartomagie, pièces, et psychologie du détournement d\'attention.',
            level: 'Pour bien démarrer',
            isUnlocked: true, // A relier plus tard à la BDD via les achats
            color: 'from-blue-600 to-blue-400',
            buttonText: 'Commencer',
            href: '/dashboard/library', // Placeholder
        },
        {
            id: 'intermediaire',
            title: 'Formation Intermédiaire',
            description: 'Techniques avancées, routines complètes et perfectionnement de tes manipulations invisibles.',
            level: 'Pour aller plus loin',
            isUnlocked: false,
            color: 'from-magic-royal to-amber-500',
            buttonText: 'Découvrir',
            href: '/dashboard/shop',
        },
        {
            id: 'professionnelle',
            title: 'Formation Professionnelle',
            description: 'Le secret des professionnels : construction de spectacle, close-up en conditions réelles et mentalisme avancé.',
            level: 'L\'Excellence',
            isUnlocked: false,
            color: 'from-purple-600 to-pink-500',
            buttonText: 'Découvrir',
            href: '/dashboard/shop',
        }
    ];

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans relative selection:bg-magic-royal/30">
            {/* Ambient Background Lights */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-magic-royal/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-magic-royal mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-magic-royal" />
                            <span className="text-xs font-bold uppercase tracking-widest">Apprentissage Structuré</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Mes <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-royal to-blue-500">Formations</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            Choisis ton parcours et progresse pas à pas avec une méthode éprouvée.
                        </p>
                    </div>
                </header>

                {/* Formations Grid */}
                <div className="space-y-8">
                    {formations.map((f, index) => (
                        <div key={f.id} className="relative group">
                            <div className={`absolute -inset-1 bg-gradient-to-r ${f.color} rounded-3xl opacity-0 blur-lg group-hover:opacity-40 transition duration-1000 pointer-events-none`}></div>
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#111] flex flex-col md:flex-row shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                                
                                {/* Info Section */}
                                <div className="w-full md:w-2/3 p-8 md:p-10 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${f.color}`}></div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{f.level}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                                        {f.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                                        {f.description}
                                    </p>
                                    
                                    <Link 
                                        href={f.href}
                                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all self-start ${
                                            f.isUnlocked 
                                            ? "bg-magic-royal text-black hover:bg-blue-400 shadow-[0_0_20px_rgba(238,195,67,0.3)]" 
                                            : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                                        }`}
                                    >
                                        {f.isUnlocked ? <BookOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                        {f.buttonText}
                                    </Link>
                                </div>

                                {/* Graphic Section */}
                                <div className="w-full md:w-1/3 bg-black flex items-center justify-center p-8 relative border-l border-white/5">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-20`}></div>
                                    <div className="relative z-10 w-24 h-24 rounded-full border border-white/20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                         <span className="text-4xl font-black text-white/50">{index + 1}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
