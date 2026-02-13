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
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/login" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                </Link>

                <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h1 className="text-2xl font-serif font-bold mb-2">Mot de passe oublié ?</h1>
                    <p className="text-gray-400 mb-8 text-sm">
                        Entrez votre adresse email pour recevoir un lien magique de réinitialisation.
                    </p>

                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all placeholder:text-gray-600"
                                    placeholder="vous@exemple.com"
                                    required
                                />
                            </div>
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
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                        >
                            {loading ? "Envoi en cours..." : "Envoyer le lien"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
