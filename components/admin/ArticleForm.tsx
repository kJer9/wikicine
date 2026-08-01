"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Article } from "@/types/database";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ArticleForm({ article }: { article?: Article }) {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({
    title: article?.title ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    cover_url: article?.cover_url ?? "",
    status: article?.status ?? "draft",
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

    const { data: userData } = await supabase.auth.getUser();
    const payload = {
      ...form,
      slug: article?.slug ?? slugify(form.title),
      author_id: article?.author_id ?? userData.user?.id,
      published_at: form.status === "published" ? new Date().toISOString() : null,
    };

    const { error } = article
      ? await supabase.from("articles").update(payload).eq("id", article.id)
      : await supabase.from("articles").insert(payload);

    setSaving(false);
    if (error) return setError(error.message);
    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Field label="Titre">
        <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="input" />
      </Field>
      <Field label="Extrait (résumé court)">
        <textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="input" />
      </Field>
      <Field label="Contenu (Markdown)">
        <textarea rows={12} required value={form.content} onChange={(e) => set("content", e.target.value)} className="input font-mono text-sm" />
      </Field>
      <Field label="URL de couverture">
        <input value={form.cover_url} onChange={(e) => set("cover_url", e.target.value)} className="input" />
      </Field>
      <Field label="Statut">
        <select value={form.status} onChange={(e) => set("status", e.target.value as "draft" | "published")} className="input">
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </Field>

      {error && <p className="text-sm text-corail">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-corail px-6 py-2.5 font-medium text-void hover:bg-corail-soft disabled:opacity-50"
      >
        {saving ? "Enregistrement…" : article ? "Enregistrer" : "Créer l'article"}
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
