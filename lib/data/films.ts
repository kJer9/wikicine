import { createClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/config";
import { mockFilms, getMockFilmDetail } from "@/lib/mock/data";
import type { Film, FilmDetail } from "@/types/database";

export interface FilmFilters {
  query?: string;
  genreSlug?: string;
  personSlug?: string;
  year?: number;
  sort?: "recent" | "rating" | "title";
  page?: number;
  pageSize?: number;
}

/** Liste paginée de films pour le catalogue et la recherche avancée. */
export async function listFilms(filters: FilmFilters = {}) {
  if (isMockMode) return listMockFilms(filters);

  const supabase = createClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("films")
    .select(
      "*, film_genres!inner(genre_id, genres(*)), film_credits(person_id, role, people(slug, full_name))",
      { count: "exact" }
    );

  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }
  if (filters.year) {
    query = query.eq("release_year", filters.year);
  }
  if (filters.genreSlug) {
    query = query.eq("film_genres.genres.slug", filters.genreSlug);
  }

  switch (filters.sort) {
    case "rating":
      query = query.order("average_rating", { ascending: false });
      break;
    case "title":
      query = query.order("title", { ascending: true });
      break;
    default:
      query = query.order("release_date", { ascending: false, nullsFirst: false });
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  let films = (data ?? []) as unknown as Film[];

  // Filtre par personne (réalisateur/acteur) — appliqué en mémoire pour rester
  // simple ; pour de gros volumes, préférer une jointure dédiée côté SQL/RPC.
  if (filters.personSlug) {
    films = films.filter((f: any) =>
      f.film_credits?.some((c: any) => c.people?.slug === filters.personSlug)
    );
  }

  return { films, total: count ?? 0, page, pageSize };
}

function listMockFilms(filters: FilmFilters) {
  let films = [...mockFilms];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    films = films.filter((f) => f.title.toLowerCase().includes(q));
  }
  if (filters.year) {
    films = films.filter((f) => f.release_year === filters.year);
  }
  if (filters.genreSlug) {
    films = films.filter((f) => getMockFilmDetail(f.slug)?.genres.some((g) => g.slug === filters.genreSlug));
  }
  if (filters.personSlug) {
    films = films.filter((f) =>
      getMockFilmDetail(f.slug)?.credits.some((c) => c.person?.slug === filters.personSlug)
    );
  }

  switch (filters.sort) {
    case "rating":
      films.sort((a, b) => b.average_rating - a.average_rating);
      break;
    case "title":
      films.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      films.sort((a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? ""));
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;
  const start = (page - 1) * pageSize;
  const paged = films.slice(start, start + pageSize);

  return { films: paged, total: films.length, page, pageSize };
}

/** Fiche film complète avec casting, genres, images et mouvement associé. */
export async function getFilmBySlug(slug: string): Promise<FilmDetail | null> {
  if (isMockMode) return getMockFilmDetail(slug);

  const supabase = createClient();

  const { data: film, error } = await supabase
    .from("films")
    .select(
      `*,
      movements(*),
      film_genres(genres(*)),
      film_images(*),
      film_credits(*, people(*))`
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!film) return null;

  const raw = film as any;
  return {
    ...raw,
    genres: raw.film_genres?.map((fg: any) => fg.genres) ?? [],
    images: raw.film_images ?? [],
    movement: raw.movements ?? null,
    credits: (raw.film_credits ?? [])
      .map((c: any) => ({ ...c, person: c.people }))
      .sort((a: any, b: any) => a.billing_order - b.billing_order),
  };
}

/** Films mis en avant sur la page d'accueil (les mieux notés). */
export async function getFeaturedFilms(limit = 8) {
  if (isMockMode) {
    return [...mockFilms].sort((a, b) => b.average_rating - a.average_rating).slice(0, limit);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("films")
    .select("*")
    .order("average_rating", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Film[];
}

/** Derniers films ajoutés au catalogue. */
export async function getRecentFilms(limit = 12) {
  if (isMockMode) {
    return [...mockFilms].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "")).slice(0, limit);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("films")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Film[];
}
