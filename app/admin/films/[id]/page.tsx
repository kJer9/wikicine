import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FilmForm from "@/components/admin/FilmForm";

export const metadata = { title: "Admin · Modifier un film" };

export default async function EditFilmPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: film } = await supabase.from("films").select("*").eq("id", params.id).maybeSingle();
  if (!film) notFound();

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl tracking-poster text-ink">Modifier « {film.title} »</h2>
      <FilmForm film={film} />
    </div>
  );
}
