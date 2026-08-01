import Link from "next/link";
import { getFeaturedFilms, getRecentFilms } from "@/lib/data/films";
import { listPublishedArticles } from "@/lib/data/articles";
import FilmGrid from "@/components/FilmGrid";

export default async function HomePage() {
  const [featured, recent, { articles }] = await Promise.all([
    getFeaturedFilms(6),
    getRecentFilms(12),
    listPublishedArticles({ pageSize: 3 }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rail bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="chip mb-4 w-fit">L'encyclopédie du cinéma</p>
          <h1 className="max-w-3xl font-display text-6xl leading-[0.95] tracking-poster text-ink sm:text-7xl">
            Chaque film a une histoire.
            <span className="text-corail"> Découvrez-la.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">
            Films, réalisateurs, acteurs, mouvements et analyses — cataloguées,
            reliées entre elles, ouvertes à explorer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/films"
              className="rounded-full bg-corail px-6 py-3 font-medium text-void hover:bg-corail-soft"
            >
              Explorer le catalogue
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-rail px-6 py-3 font-medium text-ink hover:border-corail hover:text-corail"
            >
              Recherche avancée
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl tracking-poster text-ink">Les mieux notés</h2>
          <Link href="/films?sort=rating" className="text-sm text-corail hover:underline">
            Voir tout →
          </Link>
        </div>
        <FilmGrid films={featured} />
      </section>

      <div className="sprocket-divider" />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl tracking-poster text-ink">Ajouts récents</h2>
          <Link href="/films?sort=recent" className="text-sm text-corail hover:underline">
            Voir tout →
          </Link>
        </div>
        <FilmGrid films={recent} />
      </section>

      {articles.length > 0 && (
        <>
          <div className="sprocket-divider" />
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="mb-6 font-display text-3xl tracking-poster text-ink">
              Dernières analyses
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.slug}`}
                  className="block rounded-lg border border-rail bg-surface p-5 hover:border-corail"
                >
                  <p className="chip mb-3">{a.category?.name ?? "Analyse"}</p>
                  <h3 className="font-display text-2xl tracking-poster text-ink">{a.title}</h3>
                  {a.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{a.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
