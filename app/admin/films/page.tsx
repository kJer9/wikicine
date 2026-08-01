import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteFilmButton from "@/components/admin/DeleteFilmButton";

export const metadata = { title: "Admin · Films" };

export default async function AdminFilmsPage() {
  const supabase = createClient();
  const { data: films } = await supabase
    .from("films")
    .select("id, title, release_year, poster_url, average_rating")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-poster text-ink">Films ({films?.length ?? 0})</h2>
        <Link href="/admin/films/new" className="rounded-full bg-corail px-4 py-2 text-sm font-medium text-void hover:bg-corail-soft">
          + Ajouter un film
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-rail">
        <table className="w-full text-left text-sm">
          <thead className="bg-elevated text-ink-muted">
            <tr>
              <th className="p-3">Titre</th>
              <th className="p-3">Année</th>
              <th className="p-3">Note</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(films ?? []).map((f) => (
              <tr key={f.id} className="border-t border-rail">
                <td className="p-3 text-ink">{f.title}</td>
                <td className="p-3 font-mono text-ink-muted">{f.release_year}</td>
                <td className="p-3 font-mono text-gold">{f.average_rating?.toFixed(1) ?? "—"}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/films/${f.id}`} className="text-corail hover:underline">Modifier</Link>
                    <DeleteFilmButton filmId={f.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
