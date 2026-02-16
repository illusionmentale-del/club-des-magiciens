"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, Check, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/dashboard/update-password`,
        });

        if (error) {
            setMessage({ type: "error", text: "Erreur : " + error.message });
        } else {
            setMessage({
                type: "success",
                text: "Si cet email existe, un lien de réinitialisation vous a été envoyé."
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/login" className="flex items-center text-brand-text-muted hover:text-brand-text mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                </Link>

                <div className="bg-brand-card border border-brand-border rounded-2xl p-8 shadow-2xl">
                    <h1 className="text-2xl font-serif font-bold mb-2">Mot de passe oublié ?</h1>
                    <p className="text-brand-text-muted mb-8 text-sm">
                        Entrez votre adresse email pour recevoir un lien magique de réinitialisation.
                    </p>

                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-text-muted mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted/50" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-purple focus:outline-none transition-all placeholder:text-brand-text-muted/50"
                                    placeholder="vous@exemple.com"
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
                            className="w-full py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                        >
                            {loading ? "Envoi en cours..." : "Envoyer le lien"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
