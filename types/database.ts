// Types manuels alignés sur supabase/schema.sql.
// Pour générer automatiquement ces types depuis le projet Supabase :
//   npx supabase gen types typescript --project-id <ID> > types/database.ts

export type UserRole = "user" | "editor" | "admin";
export type CreditRole =
  | "director"
  | "actor"
  | "writer"
  | "producer"
  | "composer"
  | "cinematographer";
export type ArticleStatus = "draft" | "published";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
}

export interface Person {
  id: string;
  slug: string;
  full_name: string;
  photo_url: string | null;
  birth_date: string | null;
  death_date: string | null;
  birth_place: string | null;
  biography: string | null;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: string;
  slug: string;
  name: string;
}

export interface Movement {
  id: string;
  slug: string;
  name: string;
  period: string | null;
  description: string | null;
  cover_url: string | null;
}

export interface Film {
  id: string;
  slug: string;
  title: string;
  original_title: string | null;
  release_year: number;
  release_date: string | null;
  synopsis: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  runtime_minutes: number | null;
  country: string | null;
  countries: string[] | null;
  language: string | null;
  budget: number | null;
  movement_id: string | null;
  average_rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface FilmCredit {
  id: string;
  film_id: string;
  person_id: string;
  role: CreditRole;
  character_name: string | null;
  billing_order: number;
  person?: Person;
}

export interface FilmImage {
  id: string;
  film_id: string;
  image_url: string;
  caption: string | null;
  position: number;
}

export interface ArticleCategory {
  id: string;
  slug: string;
  name: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  category_id: string | null;
  related_film_id: string | null;
  author_id: string | null;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: ArticleCategory;
  author?: Profile;
}

// Vue enrichie utilisée dans les fiches films (agrégée côté requête)
export interface FilmDetail extends Film {
  genres: Genre[];
  credits: FilmCredit[];
  images: FilmImage[];
  movement: Movement | null;
}

// Placeholder minimal pour satisfaire le générique @supabase/ssr.
// Remplacer par le type généré (`supabase gen types`) en production.
export type Database = any;
