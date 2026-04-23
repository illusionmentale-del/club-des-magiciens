import { Sparkles, Star, ChevronRight, Lock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

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
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-32 font-sans relative selection:bg-magic-royal/30">

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10">
                <BackButton />
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 mb-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-magic-royal mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-magic-royal" />
                            <span className="text-xs font-bold uppercase tracking-widest">{uiLabelsMap.page_formations_subtitle || "Apprentissage Structuré"}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight mt-2">
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
                            <div className="relative rounded-none overflow-hidden border border-white/10 bg-black flex flex-col md:flex-row shadow-2xl hover:border-magic-royal/50 transition-colors">
                                
                                {/* Info Section */}
                                <div className="w-full md:w-2/3 p-8 md:p-10 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${f.color}`}></div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{f.level}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">
                                        {f.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                                        {f.description}
                                    </p>
                                    
                                    <Link 
                                        href={f.href}
                                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-none font-serif uppercase tracking-widest text-sm transition-all self-start border ${
                                            f.isUnlocked 
                                            ? "border-magic-royal text-magic-royal hover:bg-magic-royal hover:text-black" 
                                            : "bg-black text-white hover:border-white/30 border-white/10"
                                        }`}
                                    >
                                        {f.isUnlocked ? <BookOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                        {f.buttonText}
                                    </Link>
                                </div>

                                {/* Graphic Section */}
                                <div className="w-full md:w-1/3 bg-black flex items-center justify-center p-8 relative border-l border-white/5">
                                    <div className="relative z-10 w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-black">
                                         <span className="text-4xl font-serif italic text-white/30">{index + 1}</span>
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
