import { listFilms } from "@/lib/data/films";
import { createClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/config";
import { mockGenres } from "@/lib/mock/data";
import FilmGrid from "@/components/FilmGrid";
import SearchFilters from "@/components/SearchFilters";

export const metadata = { title: "Recherche avancée" };

interface Props {
  searchParams: { q?: string; genre?: string; person?: string; year?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  let genres = mockGenres;
  if (!isMockMode) {
    const supabase = createClient();
    const { data } = await supabase.from("genres").select("*").order("name");
    genres = data ?? [];
  }

  const hasQuery = Boolean(searchParams.q || searchParams.genre || searchParams.person || searchParams.year);

  const { films, total } = hasQuery
    ? await listFilms({
        query: searchParams.q,
        genreSlug: searchParams.genre,
        personSlug: searchParams.person,
        year: searchParams.year ? Number(searchParams.year) : undefined,
        pageSize: 48,
      })
    : { films: [], total: 0 };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-4xl tracking-poster text-ink">Recherche avancée</h1>

      <SearchFilters genres={genres} initial={searchParams} />

      <div className="mt-10">
        {hasQuery ? (
          <>
            <p className="mb-4 text-sm text-ink-muted">{total} résultat{total > 1 ? "s" : ""}</p>
            <FilmGrid films={films} />
          </>
        ) : (
          <p className="text-ink-muted">Affinez votre recherche à l'aide des filtres ci-dessus.</p>
        )}
      </div>
    </div>
  );
}
