import { Sparkles, Star, ChevronRight, Lock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { FadeInUp, BentoHoverEffect } from "@/components/adults/MotionWrapper";

export const metadata = {
    title: 'Mes Formations | L\'Atelier des Magiciens',
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
            color: 'from-[#86868b] to-gray-400',
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
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 pb-32 font-sans relative selection:bg-white/30">

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10">
                <BackButton />
                
                {/* Header */}
                <FadeInUp delay={0.1}>
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 mb-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-[#86868b] mb-2">
                                <Star className="w-5 h-5 fill-current text-[#f5f5f7]" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">{uiLabelsMap.page_formations_subtitle || "Apprentissage Structuré"}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#f5f5f7] mt-2">
                                {uiLabelsMap.page_formations_title || "Mes Formations"}
                            </h1>
                            <p className="text-[#86868b] mt-3 text-xl font-light">
                                Choisis ton parcours et progresse pas à pas avec une méthode éprouvée.
                            </p>
                        </div>
                    </header>
                </FadeInUp>

                {/* Formations Grid */}
                <div className="space-y-6">
                    {formations.map((f, index) => (
                        <FadeInUp key={f.id} delay={0.2 + (index * 0.1)}>
                            <BentoHoverEffect>
                                <div className="relative rounded-[32px] overflow-hidden border border-white/5 bg-[#1c1c1e] flex flex-col md:flex-row shadow-xl hover:border-white/10 transition-colors group">
                                    
                                    {/* Info Section */}
                                    <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${f.color}`}></div>
                                            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-widest">{f.level}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-semibold text-[#f5f5f7] tracking-tight mb-3">
                                            {f.title}
                                        </h3>
                                        <p className="text-[#86868b] text-base md:text-lg font-light leading-relaxed mb-8 max-w-lg">
                                            {f.description}
                                        </p>
                                        
                                        <Link 
                                            href={f.href}
                                            className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-medium transition-all self-start border ${
                                                f.isUnlocked 
                                                ? "bg-[#f5f5f7] text-black hover:bg-white border-transparent shadow-md hover:shadow-lg" 
                                                : "bg-transparent text-[#f5f5f7] hover:bg-white/5 border-white/10 hover:border-white/20"
                                            }`}
                                        >
                                            {f.isUnlocked ? <BookOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                            {f.buttonText}
                                        </Link>
                                    </div>

                                    {/* Graphic Section */}
                                    <div className="w-full md:w-1/3 bg-black/20 flex items-center justify-center p-8 relative border-t md:border-t-0 md:border-l border-white/5">
                                        <div className="relative z-10 w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md shadow-inner group-hover:scale-105 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                                             <span className="text-4xl font-semibold text-[#f5f5f7] opacity-50">{index + 1}</span>
                                        </div>
                                    </div>

                                </div>
                            </BentoHoverEffect>
                        </FadeInUp>
                    ))}
                </div>

            </div>
        </div>
    );
}
