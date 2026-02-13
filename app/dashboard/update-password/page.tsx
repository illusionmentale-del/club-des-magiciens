"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, AlertCircle, Lock } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Les mots de passe ne correspondent pas." });
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setMessage({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères." });
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            setMessage({ type: "error", text: "Erreur : " + error.message });
            setLoading(false);
        } else {
            setMessage({ type: "success", text: "Mot de passe mis à jour ! Redirection..." });
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-magic-bg text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-magic-card border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-amber-500"></div>

                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-full">
                        <Lock className="w-8 h-8 text-magic-purple" />
                    </div>
                </div>

                <h1 className="text-2xl font-serif font-bold text-center mb-2">Nouveau Mot de Passe</h1>
                <p className="text-gray-400 text-center mb-8 text-sm">
                    Définissez votre nouveau mot de passe sécurisé pour accéder au Club.
                </p>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-magic-purple focus:outline-none transition-all placeholder:text-gray-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-magic-purple focus:outline-none transition-all placeholder:text-gray-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {message.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-magic-purple hover:bg-magic-purple/80 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Mise à jour..." : "Enregistrer le nouveau mot de passe"}
                    </button>
                </form>
            </div>
        </div>
    );
}
