"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { validateKidsLibraryItem } from "@/app/kids/videos/actions";
import GamificationModal, { GamificationEvent } from "./GamificationModal";

export default function KidsValidateButton({ libraryItemId }: { libraryItemId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState<GamificationEvent | null>(null);
    const router = useRouter();

    const handleValidate = async () => {
        setIsLoading(true);
        const res = await validateKidsLibraryItem(libraryItemId);
        setIsLoading(false);
        
        if (res?.success && 'gainedXP' in res) {
            if (res.gainedXP || res.leveledUpTo || res.unlockedWelcome) {
                setEvent({
                    gainedXP: res.gainedXP as number,
                    leveledUpTo: res.leveledUpTo as string | null,
                    unlockedWelcome: res.unlockedWelcome as boolean
                });
            } else {
                router.refresh();
            }
        } else if (res?.success) {
            router.refresh();
        }
    };

    return (
        <>
            <button 
                onClick={handleValidate} 
                disabled={isLoading}
                className="w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                        <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        JE VALIDE !
                    </>
                )}
            </button>
            <GamificationModal event={event} onClose={() => {
                setEvent(null);
                router.refresh();
            }} />
        </>
    );
}
