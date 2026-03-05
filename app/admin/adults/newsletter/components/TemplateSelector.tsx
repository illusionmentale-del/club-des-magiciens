"use client";

import { LayoutTemplate, PlaySquare, ShoppingCart, Check } from "lucide-react";

export type NewsletterTemplate = 'classic' | 'course_focus' | 'product_focus';

interface Props {
    selected: NewsletterTemplate;
    onSelect: (t: NewsletterTemplate) => void;
}

export function TemplateSelector({ selected, onSelect }: Props) {
    const templates = [
        {
            id: 'classic' as const,
            name: 'Annonce Classique',
            description: 'Texte simple, idéal pour une nouvelle ou un message.',
            icon: LayoutTemplate,
        },
        {
            id: 'course_focus' as const,
            name: 'Sortie de la Semaine',
            description: 'Intègre une magnifique carte vidéo interactive.',
            icon: PlaySquare,
        },
        {
            id: 'product_focus' as const,
            name: 'Focus Boutique',
            description: 'Intégre une carte produit avec bouton d\'achat.',
            icon: ShoppingCart,
        }
    ];

    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-4 ml-1">Choix de la Trame</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((t) => {
                    const Icon = t.icon;
                    const isSelected = selected === t.id;

                    return (
                        <button
                            key={t.id}
                            onClick={() => onSelect(t.id)}
                            type="button"
                            className={`p-4 rounded-2xl border text-left flex flex-col items-start gap-4 transition-all relative overflow-hidden group ${isSelected
                                    ? 'bg-brand-gold/10 border-brand-gold shadow-[0_0_20px_rgba(234,179,8,0.15)]'
                                    : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/40'
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center">
                                    <Check className="w-3 h-3 text-black" />
                                </div>
                            )}

                            <div className={`p-3 rounded-xl ${isSelected ? 'bg-brand-gold/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                <Icon className={`w-6 h-6 ${isSelected ? 'text-brand-gold' : 'text-brand-text-muted'}`} />
                            </div>

                            <div>
                                <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-brand-gold' : 'text-white'}`}>{t.name}</h3>
                                <p className="text-xs text-brand-text-muted/80">{t.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
