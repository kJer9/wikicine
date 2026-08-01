import Image from "next/image";
import Link from "next/link";
import type { Film } from "@/types/database";

export default function FilmCard({ film }: { film: Film }) {
  return (
    <Link href={`/films/${film.slug}`} className="group poster-card block">
      <div className="relative aspect-[2/3] w-full bg-elevated">
        {film.poster_url ? (
          <Image
            src={film.poster_url}
            alt={`Affiche de ${film.title}`}
            fill
            sizes="(max-width: 768px) 45vw, 200px"
            className="object-cover transition-opacity group-hover:opacity-80"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center font-display text-xl text-ink-faint">
            {film.title}
          </div>
        )}

        {film.average_rating > 0 && (
          <div className="absolute right-2 top-2 rounded-full bg-void/85 px-2 py-1 font-mono text-xs text-gold ring-1 ring-gold/30">
            ★ {film.average_rating.toFixed(1)}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-vignette opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="p-3">
        <h3 className="truncate font-display text-lg tracking-poster text-ink group-hover:text-corail">
          {film.title}
        </h3>
        <p className="font-mono text-xs uppercase tracking-chip text-ink-muted">
          {film.release_year}
          {film.country ? ` · ${film.country}` : ""}
        </p>
      </div>
    </Link>
  );
}
