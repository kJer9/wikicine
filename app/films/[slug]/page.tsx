import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFilmBySlug } from "@/lib/data/films";
import FavoriteButton from "@/components/FavoriteButton";
import WatchlistButton from "@/components/WatchlistButton";
import RatingWidget from "@/components/RatingWidget";
import { getCurrentUser } from "@/lib/auth";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const film = await getFilmBySlug(params.slug);
  if (!film) return {};
  return { title: film.title, description: film.synopsis ?? undefined };
}

function toEmbedUrl(url: string) {
  const idMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return idMatch ? `https://www.youtube.com/embed/${idMatch[1]}` : url;
}

export default async function FilmPage({ params }: Props) {
  const film = await getFilmBySlug(params.slug);
  if (!film) notFound();

  const user = await getCurrentUser();

  const directors = film.credits.filter((c) => c.role === "director");
  const cast = film.credits.filter((c) => c.role === "actor").slice(0, 12);

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[360px] w-full overflow-hidden bg-elevated sm:h-[440px]">
        {film.backdrop_url && (
          <Image src={film.backdrop_url} alt="" fill className="object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
      </div>

      <div className="mx-auto -mt-40 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
          {/* Affiche */}
          <div>
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-elevated ring-1 ring-rail">
              {film.poster_url && (
                <Image src={film.poster_url} alt={`Affiche de ${film.title}`} fill className="object-cover" />
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <FavoriteButton filmId={film.id} isAuthenticated={!!user} />
              <WatchlistButton filmId={film.id} isAuthenticated={!!user} />
            </div>
          </div>

          {/* Infos principales */}
          <div>
            {film.movement && (
              <Link href={`/movements/${film.movement.slug}`} className="chip mb-3 w-fit border-gold/40 !text-gold">
                {film.movement.name}
              </Link>
            )}
            <h1 className="font-display text-5xl leading-none tracking-poster text-ink sm:text-6xl">
              {film.title}
            </h1>
            {film.original_title && film.original_title !== film.title && (
              <p className="mt-2 text-ink-muted italic">{film.original_title}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip">{film.release_year}</span>
              {film.runtime_minutes && <span className="chip">{film.runtime_minutes} min</span>}
              {film.country && <span className="chip">{film.country}</span>}
              {film.genres.map((g) => (
                <Link key={g.id} href={`/films?genre=${g.slug}`} className="chip hover:border-corail hover:text-corail">
                  {g.name}
                </Link>
              ))}
            </div>

            {film.average_rating > 0 && (
              <div className="mt-4 flex items-center gap-2 font-mono text-gold">
                <span className="text-2xl">★ {film.average_rating.toFixed(1)}</span>
                <span className="text-sm text-ink-muted">({film.rating_count} notes)</span>
              </div>
            )}

            {directors.length > 0 && (
              <p className="mt-6 text-ink-muted">
                Réalisé par{" "}
                {directors.map((d, i) => (
                  <span key={d.id}>
                    <Link href={`/people/${d.person?.slug}`} className="text-ink hover:text-corail">
                      {d.person?.full_name}
                    </Link>
                    {i < directors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}

            {film.synopsis && (
              <p className="mt-6 max-w-2xl leading-relaxed text-ink">{film.synopsis}</p>
            )}

            <div className="mt-8">
              <RatingWidget filmId={film.id} isAuthenticated={!!user} />
            </div>
          </div>
        </div>

        {/* Casting */}
        {cast.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 font-display text-3xl tracking-poster text-ink">Casting</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cast.map((c) => (
                <Link key={c.id} href={`/people/${c.person?.slug}`} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-full bg-elevated ring-1 ring-rail">
                    {c.person?.photo_url && (
                      <Image src={c.person.photo_url} alt={c.person.full_name} fill className="object-cover" />
                    )}
                  </div>
                  <p className="mt-2 truncate text-sm text-ink group-hover:text-corail">
                    {c.person?.full_name}
                  </p>
                  {c.character_name && (
                    <p className="truncate text-xs text-ink-muted">{c.character_name}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bande-annonce */}
        {film.trailer_url && (
          <section className="mt-16">
            <h2 className="mb-5 font-display text-3xl tracking-poster text-ink">Bande-annonce</h2>
            <div className="aspect-video w-full overflow-hidden rounded-lg ring-1 ring-rail">
              <iframe
                src={toEmbedUrl(film.trailer_url)}
                title={`Bande-annonce de ${film.title}`}
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>
        )}

        {/* Galerie */}
        {film.images.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 font-display text-3xl tracking-poster text-ink">Galerie</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {film.images.map((img) => (
                <div key={img.id} className="relative aspect-video overflow-hidden rounded-md ring-1 ring-rail">
                  <Image src={img.image_url} alt={img.caption ?? film.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
