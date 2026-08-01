import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Articles" };

export default async function AdminArticlesPage() {
  const supabase = createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, status, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-poster text-ink">Articles ({articles?.length ?? 0})</h2>
        <Link href="/admin/articles/new" className="rounded-full bg-corail px-4 py-2 text-sm font-medium text-void hover:bg-corail-soft">
          + Nouvel article
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-rail">
        <table className="w-full text-left text-sm">
          <thead className="bg-elevated text-ink-muted">
            <tr>
              <th className="p-3">Titre</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(articles ?? []).map((a) => (
              <tr key={a.id} className="border-t border-rail">
                <td className="p-3 text-ink">{a.title}</td>
                <td className="p-3">
                  <span className={`chip ${a.status === "published" ? "border-corail !text-corail" : ""}`}>
                    {a.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/articles/${a.id}`} className="text-corail hover:underline">Modifier</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
