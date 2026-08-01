import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Tableau de bord admin" };

export default async function AdminDashboard() {
  const supabase = createClient();

  const [films, people, articles, users] = await Promise.all([
    supabase.from("films").select("id", { count: "exact", head: true }),
    supabase.from("people").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Films", value: films.count ?? 0 },
    { label: "Personnes", value: people.count ?? 0 },
    { label: "Articles", value: articles.count ?? 0 },
    { label: "Utilisateurs", value: users.count ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-rail bg-surface p-6">
          <p className="font-display text-4xl text-corail">{s.value}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-chip text-ink-muted">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
