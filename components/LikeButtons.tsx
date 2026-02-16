"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useOptimistic, startTransition } from "react";
import { toggleLike } from "@/app/watch/[courseId]/actions";

type Props = {
    courseId: string;
    initialUserVote: boolean | null; // true = like, false = dislike, null = none
    initialLikes: number;
    initialDislikes: number;
};

export default function LikeButtons({ courseId, initialUserVote, initialLikes, initialDislikes }: Props) {
    const [optimisticState, addOptimisticState] = useOptimistic(
        { userVote: initialUserVote, likes: initialLikes, dislikes: initialDislikes },
        (state, newVote: boolean | null) => {
            // Logic to update counts optimistically
            let newLikes = state.likes;
            let newDislikes = state.dislikes;

            // Remove old vote effect
            if (state.userVote === true) newLikes--;
            if (state.userVote === false) newDislikes--;

            // Add new vote effect
            if (newVote === true) newLikes++;
            if (newVote === false) newDislikes++;

            return { userVote: newVote, likes: newLikes, dislikes: newDislikes };
        }
    );

    const handleVote = async (vote: boolean) => {
        const newVote = optimisticState.userVote === vote ? null : vote; // Toggle logic
        startTransition(() => {
            addOptimisticState(newVote);
        });
        await toggleLike(courseId, vote);
    };

    return (
        <div className="flex items-center gap-4 bg-gray-100/50 p-2 rounded-full border border-gray-200">
            <button
                onClick={() => handleVote(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${optimisticState.userVote === true
                        ? "bg-green-100 text-green-600 font-bold shadow-sm"
                        : "text-gray-500 hover:bg-gray-200"
                    }`}
            >
                <ThumbsUp className={`w-5 h-5 ${optimisticState.userVote === true ? "fill-current" : ""}`} />
                <span>{optimisticState.likes}</span>
            </button>

            <div className="w-px h-6 bg-gray-300"></div>

            <button
                onClick={() => handleVote(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${optimisticState.userVote === false
                        ? "bg-red-100 text-red-600 font-bold shadow-sm"
                        : "text-gray-500 hover:bg-gray-200"
                    }`}
            >
                <ThumbsDown className={`w-5 h-5 ${optimisticState.userVote === false ? "fill-current" : ""}`} />
                <span>{optimisticState.likes > 0 ? "" : optimisticState.dislikes}</span> {/* Hide dislikes count if 0 or maybe always nice to hide? User asked for buttons. */}
            </button>
        </div>
    );
}
