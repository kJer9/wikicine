"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Film } from "@/types/database";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function FilmForm({ film }: { film?: Film }) {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({
    title: film?.title ?? "",
    original_title: film?.original_title ?? "",
    release_year: film?.release_year ?? new Date().getFullYear(),
    synopsis: film?.synopsis ?? "",
    poster_url: film?.poster_url ?? "",
    backdrop_url: film?.backdrop_url ?? "",
    trailer_url: film?.trailer_url ?? "",
    runtime_minutes: film?.runtime_minutes ?? 0,
    country: film?.country ?? "",
    language: film?.language ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { ...form, slug: film?.slug ?? slugify(form.title) };

    const { error } = film
      ? await supabase.from("films").update(payload).eq("id", film.id)
      : await supabase.from("films").insert(payload);

    setSaving(false);
    if (error) return setError(error.message);
    router.push("/admin/films");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Field label="Titre">
        <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="input" />
      </Field>
      <Field label="Titre original">
        <input value={form.original_title} onChange={(e) => set("original_title", e.target.value)} className="input" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Année de sortie">
          <input
            type="number"
            required
            value={form.release_year}
            onChange={(e) => set("release_year", Number(e.target.value))}
            className="input"
          />
        </Field>
        <Field label="Durée (minutes)">
          <input
            type="number"
            value={form.runtime_minutes}
            onChange={(e) => set("runtime_minutes", Number(e.target.value))}
            className="input"
          />
        </Field>
      </div>
      <Field label="Synopsis">
        <textarea
          rows={4}
          value={form.synopsis}
          onChange={(e) => set("synopsis", e.target.value)}
          className="input"
        />
      </Field>
      <Field label="URL de l'affiche">
        <input value={form.poster_url} onChange={(e) => set("poster_url", e.target.value)} className="input" />
      </Field>
      <Field label="URL de l'image de fond (backdrop)">
        <input value={form.backdrop_url} onChange={(e) => set("backdrop_url", e.target.value)} className="input" />
      </Field>
      <Field label="URL de la bande-annonce (YouTube)">
        <input value={form.trailer_url} onChange={(e) => set("trailer_url", e.target.value)} className="input" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Pays">
          <input value={form.country} onChange={(e) => set("country", e.target.value)} className="input" />
        </Field>
        <Field label="Langue">
          <input value={form.language} onChange={(e) => set("language", e.target.value)} className="input" />
        </Field>
      </div>

      {error && <p className="text-sm text-corail">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-corail px-6 py-2.5 font-medium text-void hover:bg-corail-soft disabled:opacity-50"
      >
        {saving ? "Enregistrement…" : film ? "Enregistrer les modifications" : "Créer le film"}
      </button>

      <style jsx global>{`
        .input {
          background: #1b1f26;
          border: 1px solid #2a2f38;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: #edeef0;
          width: 100%;
        }
        .input:focus {
          outline: none;
          border-color: #ff6b45;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-chip text-ink-muted">{label}</span>
      {children}
    </label>
  );
}
