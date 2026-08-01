-- =========================================================
-- WikiCiné — Schéma Supabase (PostgreSQL)
-- À exécuter dans Supabase Studio > SQL Editor
-- =========================================================

-- Extensions utiles
create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm; -- recherche floue sur les titres

-- ---------------------------------------------------------
-- 1. PROFILS UTILISATEURS (lié à auth.users)
-- ---------------------------------------------------------
create type user_role as enum ('user', 'editor', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  role user_role not null default 'user',
  created_at timestamptz not null default now()
);

-- Création automatique du profil à l'inscription
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)) || '_' || substr(new.id::text, 1, 4),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- 2. PERSONNES (réalisateurs / acteurs / techniciens)
-- ---------------------------------------------------------
create table public.people (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  full_name text not null,
  photo_url text,
  birth_date date,
  death_date date,
  birth_place text,
  biography text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index people_full_name_trgm on public.people using gin (full_name gin_trgm_ops);

-- ---------------------------------------------------------
-- 3. GENRES / MOUVEMENTS CINÉMATOGRAPHIQUES
-- ---------------------------------------------------------
create table public.genres (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text unique not null
);

create table public.movements (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  period text,             -- ex: "1959–1964"
  description text,
  cover_url text
);

-- ---------------------------------------------------------
-- 4. FILMS
-- ---------------------------------------------------------
create table public.films (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  original_title text,
  release_year int not null,
  release_date date,
  synopsis text,
  poster_url text,
  backdrop_url text,
  trailer_url text,          -- URL YouTube/Vimeo
  runtime_minutes int,
  country text,              -- pays principal (affichage rapide)
  countries text[],          -- liste complète des pays
  language text,
  budget bigint,
  movement_id uuid references public.movements(id) on delete set null,
  average_rating numeric(3,1) default 0,
  rating_count int default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index films_title_trgm on public.films using gin (title gin_trgm_ops);
create index films_release_year_idx on public.films (release_year);

-- Genres <-> Films (many-to-many)
create table public.film_genres (
  film_id uuid references public.films(id) on delete cascade,
  genre_id uuid references public.genres(id) on delete cascade,
  primary key (film_id, genre_id)
);

-- Casting / équipe technique (many-to-many avec rôle)
create type credit_role as enum ('director', 'actor', 'writer', 'producer', 'composer', 'cinematographer');

create table public.film_credits (
  id uuid primary key default uuid_generate_v4(),
  film_id uuid references public.films(id) on delete cascade,
  person_id uuid references public.people(id) on delete cascade,
  role credit_role not null,
  character_name text,       -- utilisé si role = 'actor'
  billing_order int default 0
);

create index film_credits_film_idx on public.film_credits (film_id);
create index film_credits_person_idx on public.film_credits (person_id);

-- Galerie d'images d'un film
create table public.film_images (
  id uuid primary key default uuid_generate_v4(),
  film_id uuid references public.films(id) on delete cascade,
  image_url text not null,
  caption text,
  position int default 0
);

-- ---------------------------------------------------------
-- 5. ARTICLES / ANALYSES
-- ---------------------------------------------------------
create table public.article_categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text unique not null
);

create type article_status as enum ('draft', 'published');

create table public.articles (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,       -- markdown
  cover_url text,
  category_id uuid references public.article_categories(id) on delete set null,
  related_film_id uuid references public.films(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  status article_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_title_trgm on public.articles using gin (title gin_trgm_ops);
create index articles_status_idx on public.articles (status, published_at desc);

-- ---------------------------------------------------------
-- 6. INTERACTIONS UTILISATEUR
-- ---------------------------------------------------------
create table public.favorites (
  user_id uuid references public.profiles(id) on delete cascade,
  film_id uuid references public.films(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, film_id)
);

create table public.watchlist (
  user_id uuid references public.profiles(id) on delete cascade,
  film_id uuid references public.films(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, film_id)
);

create table public.ratings (
  user_id uuid references public.profiles(id) on delete cascade,
  film_id uuid references public.films(id) on delete cascade,
  score numeric(3,1) not null check (score >= 0 and score <= 10),
  review text,
  created_at timestamptz not null default now(),
  primary key (user_id, film_id)
);

-- Recalcul automatique de la note moyenne d'un film
create function public.refresh_film_rating()
returns trigger as $$
begin
  update public.films f
  set average_rating = coalesce((select round(avg(score)::numeric, 1) from public.ratings where film_id = coalesce(new.film_id, old.film_id)), 0),
      rating_count = (select count(*) from public.ratings where film_id = coalesce(new.film_id, old.film_id))
  where f.id = coalesce(new.film_id, old.film_id);
  return null;
end;
$$ language plpgsql security definer;

create trigger on_rating_change
  after insert or update or delete on public.ratings
  for each row execute procedure public.refresh_film_rating();

-- ---------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.people enable row level security;
alter table public.genres enable row level security;
alter table public.movements enable row level security;
alter table public.films enable row level security;
alter table public.film_genres enable row level security;
alter table public.film_credits enable row level security;
alter table public.film_images enable row level security;
alter table public.article_categories enable row level security;
alter table public.articles enable row level security;
alter table public.favorites enable row level security;
alter table public.watchlist enable row level security;
alter table public.ratings enable row level security;

-- Fonction utilitaire : l'utilisateur courant est-il admin/editor ?
create function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$ language sql security definer stable;

-- Lecture publique sur tout le contenu éditorial
create policy "public read profiles" on public.profiles for select using (true);
create policy "public read people" on public.people for select using (true);
create policy "public read genres" on public.genres for select using (true);
create policy "public read movements" on public.movements for select using (true);
create policy "public read films" on public.films for select using (true);
create policy "public read film_genres" on public.film_genres for select using (true);
create policy "public read film_credits" on public.film_credits for select using (true);
create policy "public read film_images" on public.film_images for select using (true);
create policy "public read article_categories" on public.article_categories for select using (true);
create policy "public read published articles" on public.articles
  for select using (status = 'published' or author_id = auth.uid() or public.is_staff());

-- Écriture réservée aux admins/éditeurs sur le contenu éditorial
create policy "staff write people" on public.people for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write genres" on public.genres for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write movements" on public.movements for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write films" on public.films for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write film_genres" on public.film_genres for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write film_credits" on public.film_credits for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write film_images" on public.film_images for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write article_categories" on public.article_categories for all using (public.is_staff()) with check (public.is_staff());

create policy "authors manage own articles" on public.articles
  for all using (author_id = auth.uid() or public.is_staff())
  with check (author_id = auth.uid() or public.is_staff());

-- Profil : l'utilisateur peut modifier le sien ; admin peut tout modifier
create policy "user update own profile" on public.profiles
  for update using (id = auth.uid() or public.is_staff());

-- Favoris / à voir plus tard / notes : strictement privés au propriétaire (lecture des notes publique pour les moyennes)
create policy "user manage own favorites" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "user manage own watchlist" on public.watchlist for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "public read ratings" on public.ratings for select using (true);
create policy "user manage own ratings" on public.ratings
  for insert with check (user_id = auth.uid());
create policy "user update own ratings" on public.ratings
  for update using (user_id = auth.uid());
create policy "user delete own ratings" on public.ratings
  for delete using (user_id = auth.uid());

-- ---------------------------------------------------------
-- 8. STORAGE (buckets pour affiches, photos, galeries)
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public) values ('posters', 'posters', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('people', 'people', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('articles', 'articles', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;

create policy "public read storage" on storage.objects for select using (true);
create policy "staff write storage" on storage.objects for insert with check (public.is_staff());
create policy "staff update storage" on storage.objects for update using (public.is_staff());
create policy "staff delete storage" on storage.objects for delete using (public.is_staff());
