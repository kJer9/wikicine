"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Genre } from "@/types/database";

interface Props {
  genres: Genre[];
  initial: { q?: string; genre?: string; person?: string; year?: string };
}

export default function SearchFilters({ genres, initial }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initial.q ?? "");
  const [genre, setGenre] = useState(initial.genre ?? "");
  const [person, setPerson] = useState(initial.person ?? "");
  const [year, setYear] = useState(initial.year ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (genre) params.set("genre", genre);
    if (person) params.set("person", person);
    if (year) params.set("year", year);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-lg border border-rail bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Titre">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ex. Vertigo"
          className="input"
        />
      </Field>

      <Field label="Genre">
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="input">
          <option value="">Tous</option>
          {genres.map((g) => (
            <option key={g.id} value={g.slug}>{g.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Réalisateur / acteur (slug)">
        <input
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="ex. jean-luc-godard"
          className="input"
        />
      </Field>

      <Field label="Année">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="ex. 1960"
          className="input"
        />
      </Field>

      <div className="lg:col-span-4">
        <button type="submit" className="rounded-full bg-corail px-6 py-2.5 font-medium text-void hover:bg-corail-soft">
          Rechercher
        </button>
      </div>

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
