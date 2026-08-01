-- =========================================================
-- WikiCiné — Module JEUX (extension du schéma principal)
-- À exécuter APRÈS supabase/schema.sql, dans SQL Editor.
-- Contient : Duel ELO ("Tu préfères ?", format tournoi) et Quiz.
-- =========================================================

-- ---------------------------------------------------------
-- 1. DUEL ELO ("Tu préfères ?")
-- ---------------------------------------------------------
-- Le classement est PERSONNEL : chaque utilisateur construit son propre
-- classement ELO à partir de ses choix (pas un classement global partagé).
-- subject_id est polymorphe (film, réalisateur/acteur = people, genre) :
-- pas de contrainte FK directe, la cohérence est garantie côté application.

create type duel_subject_type as enum ('film', 'director', 'actor', 'genre');

create table public.user_elo_ratings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  subject_type duel_subject_type not null,
  subject_id uuid not null,
  rating numeric(7,2) not null default 1200,
  matches_played int not null default 0,
  wins int not null default 0,
  losses int not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, subject_type, subject_id)
);

create index elo_ratings_user_idx on public.user_elo_ratings (user_id, subject_type, rating desc);

create table public.duels (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  subject_type duel_subject_type not null,
  subject_a_id uuid not null,
  subject_b_id uuid not null,
  winner_id uuid, -- égal à subject_a_id ou subject_b_id ; NULL = "égalité / passer"
  created_at timestamptz not null default now()
);

create index duels_user_idx on public.duels (user_id, created_at desc);

-- Recalcul automatique de l'ELO personnel après chaque duel (formule standard, K=32)
create function public.apply_duel_elo()
returns trigger as $$
declare
  rating_a numeric;
  rating_b numeric;
  expected_a numeric;
  expected_b numeric;
  score_a numeric;
  score_b numeric;
  k constant numeric := 32;
begin
  if new.winner_id is null then
    return new; -- égalité/passer : pas de recalcul
  end if;

  insert into public.user_elo_ratings (user_id, subject_type, subject_id)
  values (new.user_id, new.subject_type, new.subject_a_id)
  on conflict (user_id, subject_type, subject_id) do nothing;

  insert into public.user_elo_ratings (user_id, subject_type, subject_id)
  values (new.user_id, new.subject_type, new.subject_b_id)
  on conflict (user_id, subject_type, subject_id) do nothing;

  select rating into rating_a from public.user_elo_ratings
    where user_id = new.user_id and subject_type = new.subject_type and subject_id = new.subject_a_id;
  select rating into rating_b from public.user_elo_ratings
    where user_id = new.user_id and subject_type = new.subject_type and subject_id = new.subject_b_id;

  expected_a := 1 / (1 + power(10, (rating_b - rating_a) / 400));
  expected_b := 1 / (1 + power(10, (rating_a - rating_b) / 400));

  if new.winner_id = new.subject_a_id then
    score_a := 1; score_b := 0;
  else
    score_a := 0; score_b := 1;
  end if;

  update public.user_elo_ratings
    set rating = round(rating + k * (score_a - expected_a), 2),
        matches_played = matches_played + 1,
        wins = wins + (case when score_a = 1 then 1 else 0 end),
        losses = losses + (case when score_a = 0 then 1 else 0 end),
        updated_at = now()
    where user_id = new.user_id and subject_type = new.subject_type and subject_id = new.subject_a_id;

  update public.user_elo_ratings
    set rating = round(rating + k * (score_b - expected_b), 2),
        matches_played = matches_played + 1,
        wins = wins + (case when score_b = 1 then 1 else 0 end),
        losses = losses + (case when score_b = 0 then 1 else 0 end),
        updated_at = now()
    where user_id = new.user_id and subject_type = new.subject_type and subject_id = new.subject_b_id;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_duel_insert
  after insert on public.duels
  for each row execute procedure public.apply_duel_elo();

-- ---------------------------------------------------------
-- 2. QUIZ (deviner le film, le réalisateur, citations, affiches, culture générale)
-- ---------------------------------------------------------
create type quiz_category as enum (
  'deviner_film', 'deviner_realisateur', 'citations', 'affiches', 'culture_generale'
);

create table public.quizzes (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  category quiz_category not null,
  description text,
  cover_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  position int not null default 0,
  question_text text not null,
  image_url text,          -- utilisé pour "Devine l'affiche"
  related_film_id uuid references public.films(id) on delete set null,
  points int not null default 10
);

create index quiz_questions_quiz_idx on public.quiz_questions (quiz_id, position);

create table public.quiz_answers (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references public.quiz_questions(id) on delete cascade,
  answer_text text not null,
  is_correct boolean not null default false,
  position int not null default 0
);

create index quiz_answers_question_idx on public.quiz_answers (question_id);

create table public.quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  score int not null default 0,
  total_questions int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index quiz_attempts_user_idx on public.quiz_attempts (user_id, created_at desc);

create table public.quiz_attempt_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid references public.quiz_attempts(id) on delete cascade,
  question_id uuid references public.quiz_questions(id) on delete cascade,
  selected_answer_id uuid references public.quiz_answers(id) on delete set null,
  is_correct boolean not null default false,
  answered_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ---------------------------------------------------------
alter table public.user_elo_ratings enable row level security;
alter table public.duels enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_attempt_answers enable row level security;

-- Contenu de jeu : lecture publique, écriture réservée au staff (utilise
-- la fonction public.is_staff() déjà définie dans supabase/schema.sql)
create policy "public read quizzes" on public.quizzes for select using (is_active = true or public.is_staff());
create policy "public read quiz_questions" on public.quiz_questions for select using (true);
create policy "public read quiz_answers" on public.quiz_answers for select using (true);

create policy "staff write quizzes" on public.quizzes for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write quiz_questions" on public.quiz_questions for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write quiz_answers" on public.quiz_answers for all using (public.is_staff()) with check (public.is_staff());

-- Données de jeu de l'utilisateur : strictement privées à leur propriétaire
create policy "user manage own elo" on public.user_elo_ratings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "user manage own duels" on public.duels
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "user manage own quiz_attempts" on public.quiz_attempts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "user manage own quiz_attempt_answers" on public.quiz_attempt_answers
  for all using (exists (select 1 from public.quiz_attempts qa where qa.id = attempt_id and qa.user_id = auth.uid()))
  with check (exists (select 1 from public.quiz_attempts qa where qa.id = attempt_id and qa.user_id = auth.uid()));


-- ---------------------------------------------------------
-- ⚠️ NOTE DE SÉCURITÉ IMPORTANTE
-- ---------------------------------------------------------
-- La policy "public read quiz_answers" expose is_correct à n'importe quel
-- utilisateur qui inspecterait les requêtes réseau (un joueur un peu curieux
-- pourrait voir la bonne réponse avant de répondre). C'est acceptable pour
-- un MVP, mais pour une version plus robuste il faudra :
--   1. Soit masquer `is_correct` dans une vue publique séparée
--      (ex. `quiz_answers_public` sans cette colonne),
--   2. Soit valider les réponses via une fonction RPC côté serveur
--      (`submit_quiz_answer(question_id, answer_id)`) qui renvoie
--      uniquement le résultat, sans jamais exposer la bonne réponse au client.
-- On implémentera l'option 2 quand on codera la fonctionnalité Quiz.

-- ---------------------------------------------------------
-- 4. FONCTION RPC — notation sécurisée du quiz
-- ---------------------------------------------------------
-- Le client n'envoie jamais "est-ce que c'est la bonne réponse" lui-même :
-- il envoie juste l'ID choisi, et cette fonction (exécutée côté serveur avec
-- les droits du propriétaire) vérifie et enregistre le résultat.
create or replace function public.submit_quiz_answer(
  p_attempt_id uuid,
  p_question_id uuid,
  p_answer_id uuid
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_is_correct boolean;
  v_points int;
begin
  if not exists (
    select 1 from public.quiz_attempts
    where id = p_attempt_id and user_id = auth.uid()
  ) then
    raise exception 'Tentative de quiz introuvable ou non autorisée';
  end if;

  select is_correct into v_is_correct
    from public.quiz_answers
    where id = p_answer_id and question_id = p_question_id;

  if v_is_correct is null then
    raise exception 'Réponse invalide pour cette question';
  end if;

  select points into v_points from public.quiz_questions where id = p_question_id;

  insert into public.quiz_attempt_answers (attempt_id, question_id, selected_answer_id, is_correct)
  values (p_attempt_id, p_question_id, p_answer_id, v_is_correct);

  if v_is_correct then
    update public.quiz_attempts set score = score + coalesce(v_points, 10) where id = p_attempt_id;
  end if;

  return v_is_correct;
end;
$$;

grant execute on function public.submit_quiz_answer(uuid, uuid, uuid) to authenticated;
