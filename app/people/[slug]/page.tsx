import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPersonBySlug } from "@/lib/data/people";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const result = await getPersonBySlug(params.slug);
  if (!result) return {};
  return { title: result.person.full_name };
}

export default async function PersonPage({ params }: Props) {
  const result = await getPersonBySlug(params.slug);
  if (!result) notFound();
  const { person, filmography } = result;

  const asDirector = filmography.filter((c: any) => c.role === "director");
  const asActor = filmography.filter((c: any) => c.role === "actor");

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[200px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-full bg-elevated ring-1 ring-rail sm:rounded-lg sm:aspect-[3/4]">
          {person.photo_url && (
            <Image src={person.photo_url} alt={person.full_name} fill className="object-cover" />
          )}
        </div>

        <div>
          <h1 className="font-display text-5xl tracking-poster text-ink">{person.full_name}</h1>
          <p className="mt-2 font-mono text-sm uppercase tracking-chip text-ink-muted">
            {person.birth_date && new Date(person.birth_date).getFullYear()}
            {person.death_date && ` – ${new Date(person.death_date).getFullYear()}`}
            {person.birth_place && ` · ${person.birth_place}`}
          </p>
          {person.biography && (
            <p className="mt-6 max-w-2xl leading-relaxed text-ink">{person.biography}</p>
          )}
        </div>
      </div>

      {asDirector.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-2xl tracking-poster text-ink">Réalisateur</h2>
          <FilmographyGrid credits={asDirector} />
        </section>
      )}

      {asActor.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-2xl tracking-poster text-ink">Acteur</h2>
          <FilmographyGrid credits={asActor} />
        </section>
      )}
    </div>
  );
}

function FilmographyGrid({ credits }: { credits: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
      {credits.map((c) => (
        <Link key={c.id} href={`/films/${c.film.slug}`} className="poster-card block">
          <div className="relative aspect-[2/3] w-full bg-elevated">
            {c.film.poster_url && (
              <Image src={c.film.poster_url} alt={c.film.title} fill className="object-cover" />
            )}
          </div>
          <div className="p-2">
            <p className="truncate text-sm text-ink">{c.film.title}</p>
            <p className="font-mono text-xs text-ink-muted">{c.film.release_year}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
