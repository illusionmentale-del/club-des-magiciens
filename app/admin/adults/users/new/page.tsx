"use client";

import { createUserManually } from "@/app/admin/actions";
import Link from "next/link";
import { ArrowLeft, UserPlus, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function NewUserPage() {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setError(null);
        const result = await createUserManually(formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-2xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/admin/adults/users" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                    <h1 className="text-3xl font-bold">Ajouter un Membre</h1>
                </header>

                <div className="bg-magic-card border border-white/10 p-8 rounded-2xl">
                    <form action={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type de compte</label>
                            <select
                                name="account_type"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-magic-purple focus:ring-1 focus:ring-magic-purple transition-all"
                            >
                                <option value="kid">Enfant</option>
                                <option value="adult">Adulte</option>
                                <option value="admin">Administrateur</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Pseudo</label>
                            <input
                                type="text"
                                name="username"
                                required
                                placeholder="LeMagicien"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-magic-purple focus:ring-1 focus:ring-magic-purple transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="magicien@exemple.com"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-magic-purple focus:ring-1 focus:ring-magic-purple transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="********"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-magic-purple focus:ring-1 focus:ring-magic-purple transition-all"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-magic-purple hover:bg-magic-gold text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <UserPlus className="w-5 h-5" />
                                Créer l'utilisateur
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
