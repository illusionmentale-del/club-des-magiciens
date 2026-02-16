"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check, AlertCircle, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Validation
        if (!username || !password || !confirmPassword) {
            setMessage({ type: "error", text: "Tous les champs sont requis." });
            setLoading(false);
            return;
        }

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

        // 1. Update Profile (Username)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error: profileError } = await supabase
            .from("profiles")
            .update({ username: username.toLowerCase().trim() })
            .eq("id", user.id);

        if (profileError) {
            if (profileError.code === '23505') {
                setMessage({ type: "error", text: "Cet identifiant est déjà pris." });
            } else {
                setMessage({ type: "error", text: "Erreur sauvegarde profil : " + profileError.message });
            }
            setLoading(false);
            return;
        }

        // 2. Update Auth (Password)
        const { error: authError } = await supabase.auth.updateUser({ password: password });

        if (authError) {
            setMessage({ type: "error", text: "Erreur mot de passe : " + authError.message });
            setLoading(false);
            return;
        }

        // Success -> Redirect to Dashboard
        setMessage({ type: "success", text: "Compte configuré ! Redirection..." });
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-brand-card border border-brand-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-brand-gold"></div>

                <h1 className="text-3xl font-serif font-bold mb-2">Bienvenue au Club ! 🎩</h1>
                <p className="text-brand-text-muted mb-8">
                    Pour sécuriser votre accès, veuillez choisir vos identifiants personnels.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-brand-text-muted mb-2">Choisissez un Identifiant</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-purple focus:outline-none transition-all placeholder:text-brand-text-muted/50"
                            placeholder="ex: lemagicien"
                            required
                        />
                        <p className="text-xs text-brand-text-muted/60 mt-1">Il remplacera votre email pour la connexion.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-text-muted mb-2">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-purple focus:outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-text-muted mb-2">Confirmation</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-purple focus:outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 text-sm ${message.type === 'success' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-error/10 text-brand-error'}`}>
                            {message.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-brand-purple hover:bg-brand-purple/90 text-brand-text font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 group"
                    >
                        {loading ? "Configuration..." : (
                            <>
                                Accéder à mon espace
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
