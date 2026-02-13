"use client";

import { useState } from "react";
import { Video, Users, Mic, Maximize } from "lucide-react";

export default function LivePage() {
    const [isJoined, setIsJoined] = useState(false);
    const roomName = "ClubDesMagiciens_Live_Session_Securisee"; // We can make this dynamic later

    return (
        <div className="min-h-screen bg-magic-bg text-white p-4 flex flex-col items-center">

            {!isJoined ? (
                <div className="max-w-2xl w-full text-center space-y-8 mt-20">
                    <div className="mx-auto w-24 h-24 bg-magic-purple/20 rounded-full flex items-center justify-center border border-magic-purple/50 shadow-[0_0_50px_rgba(124,58,237,0.3)] animate-pulse">
                        <Video className="w-12 h-12 text-magic-purple" />
                    </div>

                    <h1 className="text-4xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-200">
                        Salle de Visio Magique
                    </h1>

                    <p className="text-gray-400 text-lg">
                        Bienvenue dans l'espace de rencontre du Club.
                        Rejoignez la session en direct pour échanger, apprendre et partager.
                    </p>

                    <div className="bg-magic-card border border-white/10 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Users className="w-6 h-6" /></div>
                            <div>
                                <h3 className="font-bold">Communauté</h3>
                                <p className="text-sm text-gray-500">Échangez avec les autres membres.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><Mic className="w-6 h-6" /></div>
                            <div>
                                <h3 className="font-bold">Audio & Vidéo</h3>
                                <p className="text-sm text-gray-500">Qualité HD, sans installation.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><Maximize className="w-6 h-6" /></div>
                            <div>
                                <h3 className="font-bold">Plein Écran</h3>
                                <p className="text-sm text-gray-500">Immersion totale dans le cours.</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsJoined(true)}
                        className="px-8 py-4 bg-magic-purple hover:bg-magic-purple/80 text-white font-bold text-lg rounded-full transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transform hover:scale-105"
                    >
                        Rejoindre le Live Maintenant
                    </button>

                    <p className="text-xs text-gray-500">
                        Powered by Jitsi Meet - Sécurisé & Gratuit
                    </p>
                </div>
            ) : (
                <div className="w-full h-[calc(100vh-2rem)] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                    <iframe
                        src={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false`}
                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                        className="w-full h-full border-0"
                    ></iframe>

                    <button
                        onClick={() => setIsJoined(false)}
                        className="absolute top-4 left-4 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-sm font-bold rounded-lg backdrop-blur-md transition-colors"
                    >
                        Quitter la salle
                    </button>
                </div>
            )}
        </div>
    );
}
