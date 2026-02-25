"use client";

import { useActionState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, User, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { registerAccount } from "./actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-gradient-to-r from-brand-purple to-pink-500 hover:brightness-110 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_5px_20px_rgba(168,85,247,0.3)]"
        >
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Créer mon compte <ArrowRight className="w-4 h-4" /></span>}
        </button>
    );
}

function RegisterFormContent() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/kids";

    // @ts-ignore
    const [state, formAction] = useActionState(registerAccount, null);

    return (
        <div className="w-full max-w-md z-10">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Bienvenue au Club
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
                <h2 className="text-3xl font-black text-center mb-2 tracking-tight">Inscription</h2>
                <p className="text-gray-400 text-center mb-8 text-sm">Crée ton compte parent/enfant pour débloquer la magie.</p>

                <form action={formAction} className="space-y-5">
                    <input type="hidden" name="redirect" value={redirectUrl} />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Prénom de l'enfant (ou Pseudo)</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="username"
                                type="text"
                                className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-all placeholder:text-gray-600"
                                placeholder="Ex: Léo Magicien"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email (Parent)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="email"
                                type="email"
                                className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-all placeholder:text-gray-600"
                                placeholder="parent@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-all placeholder:text-gray-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-sm border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {state.error}
                        </div>
                    )}

                    <div className="pt-2">
                        <SubmitButton />
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Tu as déjà un compte ?{" "}
                    <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-brand-purple font-bold hover:underline">
                        Connecte-toi
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#0F0A1F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/20 via-[#0F0A1F] to-[#0F0A1F] opacity-50 pointer-events-none"></div>

            <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-brand-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}>
                <RegisterFormContent />
            </Suspense>
        </div>
    );
}
