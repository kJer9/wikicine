"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isMockMode } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isMockMode) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(traduireErreur(error.message));
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="mb-8 font-display text-4xl tracking-poster text-ink">Connexion</h1>

      {isMockMode && (
        <p className="mb-6 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold">
          Mode démo : les comptes ne sont pas actifs. Connectez Supabase (voir README) pour activer l'authentification.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-chip text-ink-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-rail bg-elevated px-3 py-2.5 text-ink focus:border-corail focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-chip text-ink-muted">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-rail bg-elevated px-3 py-2.5 text-ink focus:border-corail focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-corail">{error}</p>}
        <button
          type="submit"
          disabled={loading || isMockMode}
          className="w-full rounded-full bg-corail py-2.5 font-medium text-void hover:bg-corail-soft disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink-muted">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-corail hover:underline">S'inscrire</Link>
      </p>
    </div>
  );
}

function traduireErreur(message: string) {
  if (message.includes("Invalid login credentials")) return "Email ou mot de passe incorrect.";
  return "Une erreur est survenue. Réessayez.";
}
