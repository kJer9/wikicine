import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import FilmGrid from "@/components/FilmGrid";

export const metadata = { title: "À voir plus tard" };

export default async function WatchlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createClient();
  const { data } = await supabase
    .from("watchlist")
    .select("films(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const films = (data ?? []).map((row: any) => row.films).filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-4xl tracking-poster text-ink">À voir plus tard</h1>
      <FilmGrid films={films} emptyLabel="Votre liste est vide pour l'instant." />
    </div>
  );
}
