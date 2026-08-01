import FilmForm from "@/components/admin/FilmForm";

export const metadata = { title: "Admin · Nouveau film" };

export default function NewFilmPage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl tracking-poster text-ink">Ajouter un film</h2>
      <FilmForm />
    </div>
  );
}
