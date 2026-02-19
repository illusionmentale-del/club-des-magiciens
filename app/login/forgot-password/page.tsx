"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { requestPasswordReset } from "./actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-blue hover:scale-[1.02] text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-brand-purple/50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
            {pending ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="flex items-center gap-2">Envoyer le lien Magique <ArrowRight className="w-4 h-4" /></span>}
        </button>
    );
}

export default function ForgotPasswordPage() {
    // @ts-ignore
    const [state, formAction] = useActionState(requestPasswordReset, null);

    return (
        <div className="min-h-screen bg-brand-bg text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <div className="relative w-32 h-16 mx-auto mb-4">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Accès Perdu ?</h1>
                    <p className="text-brand-text-muted font-bold mt-1 text-sm">Pas de panique, la magie va t'aider !</p>
                </div>

                <div className="bg-brand-card border-2 border-brand-purple/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    {state?.success ? (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/30">
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-green-400">Email Envoyé ! ✨</h3>
                                <p className="text-gray-400 text-sm font-medium">
                                    Demande à tes parents de regarder dans leurs emails. Un lien magique les attend pour te reconnecter.
                                </p>
                            </div>
                            <Link
                                href="/login/kids"
                                className="block w-full py-3 border-2 border-brand-purple/30 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-purple/10 transition-colors"
                            >
                                Retour à la page de connexion
                            </Link>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-brand-purple ml-1">Ton Email</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-purple" />
                                    <input
                                        name="email"
                                        type="email"
                                        className="w-full pl-12 pr-4 py-4 bg-brand-bg/40 border-2 border-brand-border rounded-2xl focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 focus:outline-none transition-all placeholder:text-gray-600 font-bold"
                                        placeholder="magicien@exemple.com"
                                        required
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 ml-1">Utilise l'adresse email de ton compte ou celle de tes parents.</p>
                            </div>

                            {state?.error && (
                                <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl text-xs border border-red-500/20 flex items-center gap-2 font-bold">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {state.error}
                                </div>
                            )}

                            <SubmitButton />

                            <Link
                                href="/login/kids"
                                className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors pt-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Retour
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
