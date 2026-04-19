import { Sparkles, Star, ChevronRight, Lock, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Mes Formations | Club des Magiciens',
    description: 'Accède à tes formations complètes.',
};

import { createClient } from "@/lib/supabase/server";

export default async function AdultMasterclassPage() {
    const supabase = await createClient();

    // Fetch Settings for labels and cards
    const { data: settings } = await supabase.from("settings").select("*");
    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if purchased courses
    let purchasedCourseIds = new Set<string>();
    let isAdmin = false;
    
    if (user) {
        const { data: purchases } = await supabase.from("user_purchases").select("course_id").eq("user_id", user.id);
        if (purchases) purchasedCourseIds = new Set(purchases.map(p => p.course_id));

        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (profile?.role === 'admin' || user.email?.includes('admin@')) {
            isAdmin = true;
        }
    }

    let uiLabelsMap: Record<string, string> = {
        page_formations_title: "Mes Formations",
        page_formations_subtitle: "Apprentissage Structuré"
    };

    if (settingsMap["adult_ui_labels"]) {
        try {
            uiLabelsMap = { ...uiLabelsMap, ...JSON.parse(settingsMap["adult_ui_labels"]) };
        } catch (e) {
            console.error("Failed to parse adult_ui_labels", e);
        }
    }

    // Configuration des cartes depuis la base de données
    const defaultFormations = [
        {
            id: 'debutant',
            title: 'Formation Débutant',
            description: 'Les bases fondamentales de la prestidigitation.',
            level: 'Pour bien démarrer',
            color: 'from-blue-600 to-blue-400',
            buttonText: 'Commencer',
            courseId: '',
        },
        {
            id: 'intermediaire',
            title: 'Formation Intermédiaire',
            description: 'Techniques avancées et perfectionnement.',
            level: 'Pour aller plus loin',
            color: 'from-magic-royal to-amber-500',
            buttonText: 'Découvrir',
            courseId: '',
        },
        {
            id: 'professionnelle',
            title: 'Formation Professionnelle',
            description: 'Le secret des professionnels : construction de spectacle.',
            level: 'L\'Excellence',
            color: 'from-purple-600 to-pink-500',
            buttonText: 'Découvrir',
            courseId: '',
        }
    ];

    let hubCardsConfig = defaultFormations;
    if (settingsMap["adult_masterclass_hub_cards"]) {
        try {
            hubCardsConfig = JSON.parse(settingsMap["adult_masterclass_hub_cards"]);
        } catch (e) {
            console.error("Failed to parse hub cards", e);
        }
    }

    const formations = hubCardsConfig.map((card: any) => {
        const isUnlocked = isAdmin || (card.courseId && purchasedCourseIds.has(card.courseId));
        return {
            ...card,
            isUnlocked,
            href: isUnlocked && card.courseId ? `/watch/${card.courseId}` : '/dashboard/shop'
        };
    });

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
                            <span className="text-xs font-bold uppercase tracking-widest">{uiLabelsMap.page_formations_subtitle || "Apprentissage Structuré"}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-magic-royal to-blue-500 tracking-tight">
                            {uiLabelsMap.page_formations_title || "Mes Formations"}
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
