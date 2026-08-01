-- =========================================================
-- WikiCiné — Module PROGRESSION (extension du schéma principal)
-- À exécuter APRÈS supabase/schema.sql, supabase/schema_games.sql
-- et supabase/schema_academy.sql, dans SQL Editor.
-- =========================================================

-- ---------------------------------------------------------
-- 1. NIVEAUX — courbe d'XP partagée (à garder synchronisée avec lib/xp.ts)
-- ---------------------------------------------------------
-- xp_for_level(n) = 50 * n * (n-1)  → niveau 1: 0 XP, niveau 2: 100 XP,
-- niveau 3: 300 XP, niveau 5: 1000 XP, niveau 10: 4500 XP, etc.

create function public.xp_for_level(p_level int)
returns int language sql immutable as $$
  select 50 * p_level * (p_level - 1);
$$;

create function public.compute_level(p_xp int)
returns int language plpgsql immutable as $$
declare
  lvl int := 1;
begin
  while public.xp_for_level(lvl + 1) <= p_xp loop
    lvl := lvl + 1;
  end loop;
  return lvl;
end;
$$;

-- ---------------------------------------------------------
-- 2. STATISTIQUES UTILISATEUR (XP total + niveau dérivé)
-- ---------------------------------------------------------
create table public.user_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  xp int not null default 0,
  level int not null default 1,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 3. BADGES
-- ---------------------------------------------------------
create type badge_criteria_type as enum (
  'lessons_completed',
  'courses_completed',
  'duels_played',
  'quizzes_completed',
  'favorites_added',
  'level_reached'
);

create table public.badges (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  criteria_type badge_criteria_type not null,
  criteria_threshold int not null,
  position int not null default 0
);

create table public.user_badges (
  user_id uuid references public.profiles(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- Contenu de référence des badges — à enrichir librement plus tard.
insert into public.badges (slug, name, description, icon, criteria_type, criteria_threshold, position) values
  ('premiers-pas', 'Premiers pas', 'Termine ta première leçon de l''Académie.', '🎬', 'lessons_completed', 1, 1),
  ('cinephile-en-herbe', 'Cinéphile en herbe', 'Termine 5 leçons de l''Académie.', '📚', 'lessons_completed', 5, 2),
  ('erudit', 'Érudit du cinéma', 'Termine 3 cours complets de l''Académie.', '🎓', 'courses_completed', 3, 3),
  ('strategiste-elo', 'Stratège ELO', 'Participe à 10 duels dans « Tu préfères ? ».', '⚔️', 'duels_played', 10, 4),
  ('grand-strategiste', 'Grand stratège', 'Participe à 50 duels.', '🏅', 'duels_played', 50, 5),
  ('quiz-master', 'Quiz Master', 'Termine 5 quiz.', '🎯', 'quizzes_completed', 5, 6),
  ('collectionneur', 'Collectionneur', 'Ajoute 10 films à tes favoris.', '❤️', 'favorites_added', 10, 7),
  ('cinephile-confirme', 'Cinéphile confirmé', 'Atteins le niveau 5.', '⭐', 'level_reached', 5, 8),
  ('maitre-du-cinema', 'Maître du cinéma', 'Atteins le niveau 10.', '👑', 'level_reached', 10, 9);

-- ---------------------------------------------------------
-- 4. ATTRIBUTION D'XP + BADGES (fonctions génériques)
-- ---------------------------------------------------------
create function public.check_and_award_badges(p_user_id uuid)
returns void language plpgsql security definer as $$
declare
  v_lessons int;
  v_courses int;
  v_duels int;
  v_quizzes int;
  v_favorites int;
  v_level int;
  r record;
begin
  select count(*) into v_lessons from public.user_lesson_progress where user_id = p_user_id;
  select count(*) into v_courses from public.user_course_progress where user_id = p_user_id and completed_at is not null;
  select count(*) into v_duels from public.duels where user_id = p_user_id;
  select count(*) into v_quizzes from public.quiz_attempts where user_id = p_user_id and completed_at is not null;
  select count(*) into v_favorites from public.favorites where user_id = p_user_id;
  select level into v_level from public.user_stats where user_id = p_user_id;
  v_level := coalesce(v_level, 1);

  for r in
    select * from public.badges b
    where not exists (select 1 from public.user_badges ub where ub.user_id = p_user_id and ub.badge_id = b.id)
  loop
    if (r.criteria_type = 'lessons_completed' and v_lessons >= r.criteria_threshold)
      or (r.criteria_type = 'courses_completed' and v_courses >= r.criteria_threshold)
      or (r.criteria_type = 'duels_played' and v_duels >= r.criteria_threshold)
      or (r.criteria_type = 'quizzes_completed' and v_quizzes >= r.criteria_threshold)
      or (r.criteria_type = 'favorites_added' and v_favorites >= r.criteria_threshold)
      or (r.criteria_type = 'level_reached' and v_level >= r.criteria_threshold)
    then
      insert into public.user_badges (user_id, badge_id) values (p_user_id, r.id)
      on conflict do nothing;
    end if;
  end loop;
end;
$$;

create function public.add_xp(p_user_id uuid, p_amount int)
returns void language plpgsql security definer as $$
begin
  insert into public.user_stats (user_id, xp, level)
  values (p_user_id, greatest(p_amount, 0), public.compute_level(greatest(p_amount, 0)))
  on conflict (user_id) do update
    set xp = public.user_stats.xp + p_amount,
        level = public.compute_level(public.user_stats.xp + p_amount),
        updated_at = now();

  perform public.check_and_award_badges(p_user_id);
end;
$$;

-- ---------------------------------------------------------
-- 5. DÉCLENCHEURS D'XP SUR CHAQUE ACTION DU SITE
-- ---------------------------------------------------------

-- +XP défini par la leçon, à chaque leçon terminée
create function public.on_lesson_progress_xp()
returns trigger language plpgsql security definer as $$
declare v_reward int;
begin
  select xp_reward into v_reward from public.lessons where id = new.lesson_id;
  perform public.add_xp(new.user_id, coalesce(v_reward, 20));
  return new;
end;
$$;

create trigger on_lesson_progress_award_xp
  after insert on public.user_lesson_progress
  for each row execute procedure public.on_lesson_progress_xp();

-- Bonus de 100 XP quand un cours entier est terminé
create function public.on_course_completed_xp()
returns trigger language plpgsql security definer as $$
begin
  if new.completed_at is not null and old.completed_at is null then
    perform public.add_xp(new.user_id, 100);
  end if;
  return new;
end;
$$;

create trigger on_course_completed_award_xp
  after update on public.user_course_progress
  for each row execute procedure public.on_course_completed_xp();

-- +5 XP par duel joué dans "Tu préfères ?"
create function public.on_duel_xp()
returns trigger language plpgsql security definer as $$
begin
  perform public.add_xp(new.user_id, 5);
  return new;
end;
$$;

create trigger on_duel_award_xp
  after insert on public.duels
  for each row execute procedure public.on_duel_xp();

-- XP égal au score obtenu, quand un quiz est terminé
create function public.on_quiz_completed_xp()
returns trigger language plpgsql security definer as $$
begin
  if new.completed_at is not null and old.completed_at is null then
    perform public.add_xp(new.user_id, greatest(new.score, 10));
  end if;
  return new;
end;
$$;

create trigger on_quiz_completed_award_xp
  after update on public.quiz_attempts
  for each row execute procedure public.on_quiz_completed_xp();

-- +2 XP par film ajouté aux favoris
create function public.on_favorite_xp()
returns trigger language plpgsql security definer as $$
begin
  perform public.add_xp(new.user_id, 2);
  return new;
end;
$$;

create trigger on_favorite_award_xp
  after insert on public.favorites
  for each row execute procedure public.on_favorite_xp();

-- ---------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ---------------------------------------------------------
alter table public.user_stats enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

create policy "public read badges" on public.badges for select using (true);
create policy "staff write badges" on public.badges for all using (public.is_staff()) with check (public.is_staff());

create policy "user read own stats" on public.user_stats
  for select using (user_id = auth.uid());
create policy "user read own badges" on public.user_badges
  for select using (user_id = auth.uid());

-- Aucune policy d'écriture pour les utilisateurs sur user_stats / user_badges :
-- ces tables ne sont modifiées QUE par les fonctions security definer
-- ci-dessus (add_xp / check_and_award_badges), jamais directement par le client.
