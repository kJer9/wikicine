import { listFilms } from "@/lib/data/films";
import FilmGrid from "@/components/FilmGrid";
import Pagination from "@/components/Pagination";

export const metadata = { title: "Catalogue de films" };

interface Props {
  searchParams: { q?: string; genre?: string; year?: string; sort?: string; page?: string };
}

export default async function FilmsPage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? "1");
  const { films, total, pageSize } = await listFilms({
    query: searchParams.q,
    genreSlug: searchParams.genre,
    year: searchParams.year ? Number(searchParams.year) : undefined,
    sort: (searchParams.sort as "recent" | "rating" | "title") ?? "recent",
    page,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-poster text-ink">Catalogue</h1>
          <p className="mt-1 text-ink-muted">{total} film{total > 1 ? "s" : ""}</p>
        </div>
      </div>

      <FilmGrid films={films} />

      <Pagination
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(total / pageSize))}
        basePath="/films"
        searchParams={searchParams}
      />
    </div>
  );
}
