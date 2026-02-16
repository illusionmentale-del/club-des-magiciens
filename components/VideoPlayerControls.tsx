"use client";

import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface VideoPlayerControlsProps {
    videoId: string;
    courseId: string;
    isCompleted: boolean;
}

export default function VideoPlayerControls({ videoId, courseId, isCompleted: initialStatus }: VideoPlayerControlsProps) {
    const [isCompleted, setIsCompleted] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const toggleCompletion = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (isCompleted) {
                // Unmark
                await supabase
                    .from("user_progress")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("video_id", videoId);
                setIsCompleted(false);
            } else {
                // Mark as complete
                await supabase
                    .from("user_progress")
                    .insert({
                        user_id: user.id,
                        video_id: videoId,
                        course_id: courseId,
                        is_completed: true,
                        last_watched_at: new Date().toISOString()
                    });
                setIsCompleted(true);
            }
            router.refresh(); // Refresh server components to update sidebar
        } catch (error) {
            console.error("Error toggling completion:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4 py-4 border-b border-white/10 mb-4">
            <button
                onClick={toggleCompletion}
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isCompleted
                        ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                        : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                    }`}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                ) : (
                    <Circle className="w-5 h-5" />
                )}
                {isCompleted ? "Terminé" : "Marquer comme terminé"}
            </button>
        </div>
    );
}
