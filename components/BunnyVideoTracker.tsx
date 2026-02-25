"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { saveKidsVideoProgress } from "@/app/kids/videos/actions";

interface BunnyVideoTrackerProps {
    videoId: string;
    iframeUrl: string;
    totalSeconds: number;
}

export default function BunnyVideoTracker({ videoId, iframeUrl, totalSeconds }: BunnyVideoTrackerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const lastSavedTimeRef = useRef(0);

    // Save progress to DB max once every 10 seconds to avoid spamming the DB
    const handleSaveProgress = useCallback(async (time: number) => {
        if (Math.abs(time - lastSavedTimeRef.current) >= 10 || time >= totalSeconds * 0.9) {
            lastSavedTimeRef.current = time;
            await saveKidsVideoProgress(videoId, time, totalSeconds);
        }
    }, [videoId, totalSeconds]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Bunny Stream iframe origin check could be tricky if using custom pull zones.
            // We'll rely on parsing the JSON and looking for Bunny's event structure.
            try {
                if (typeof event.data !== 'string') return;

                const data = JSON.parse(event.data);

                if (data.event === "timeupdate") {
                    const time = data.time || 0;
                    setCurrentTime(time);
                    handleSaveProgress(time);
                }
            } catch (err) {
                // Not a valid JSON or not from Bunny, ignore silently
            }
        };

        window.addEventListener("message", handleMessage);

        // Cleanup and final save on unmount
        return () => {
            window.removeEventListener("message", handleMessage);
            // We can't guarantee an async function will finish on unmount, but we try:
            if (currentTime > 0) {
                saveKidsVideoProgress(videoId, currentTime, totalSeconds).catch(() => { });
            }
        };
    }, [currentTime, handleSaveProgress, videoId, totalSeconds]);

    return (
        <iframe
            ref={iframeRef}
            src={iframeUrl}
            loading="lazy"
            allowFullScreen
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            className="absolute inset-0 w-full h-full border-0"
        />
    );
}
