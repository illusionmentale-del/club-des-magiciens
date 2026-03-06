"use client";

import { useEffect } from "react";

export function PWARegistration() {
    useEffect(() => {
        // Only register if supported by the browser and in a secure context (https or localhost)
        if ('serviceWorker' in navigator && window.isSecureContext) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('Service Worker enregistré avec succès avec le scope :', registration.scope);
                    })
                    .catch((err) => {
                        console.error('Échec de l\'enregistrement du Service Worker :', err);
                    });
            });
        }
    }, []);

    return null; // Silent component
}
