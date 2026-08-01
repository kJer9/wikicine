import type { Film } from "@/types/database";
import FilmCard from "@/components/FilmCard";

export default function FilmGrid({ films, emptyLabel = "Aucun film trouvé." }: { films: Film[]; emptyLabel?: string }) {
  if (films.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-rail p-10 text-center text-ink-muted">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {films.map((film) => (
        <FilmCard key={film.id} film={film} />
      ))}
    </div>
  );
}
