-- =========================================================
-- WikiCiné — Module ACADÉMIE DU CINÉMA (extension du schéma principal)
-- À exécuter APRÈS supabase/schema.sql, dans SQL Editor.
-- =========================================================

-- ---------------------------------------------------------
-- 1. CATÉGORIES DE L'ACADÉMIE
-- ---------------------------------------------------------
create table public.academy_categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,          -- emoji ou nom d'icône, simple pour l'UI
  position int not null default 0
);

-- ---------------------------------------------------------
-- 2. COURS
-- ---------------------------------------------------------
create type course_level as enum ('debutant', 'intermediaire', 'avance');

create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  category_id uuid references public.academy_categories(id) on delete cascade,
  title text not null,
  description text,
  level course_level not null default 'debutant',
  cover_url text,
  position int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index courses_category_idx on public.courses (category_id, position);

-- ---------------------------------------------------------
-- 3. LEÇONS
-- ---------------------------------------------------------
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  content text not null,          -- markdown
  position int not null default 0,
  duration_minutes int not null default 5,
  xp_reward int not null default 20,
  created_at timestamptz not null default now(),
  unique (course_id, slug)
);

create index lessons_course_idx on public.lessons (course_id, position);

-- Question de compréhension optionnelle en fin de leçon (une seule par leçon
-- pour rester simple — peut évoluer vers plusieurs questions plus tard).
create table public.lesson_check_questions (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid unique references public.lessons(id) on delete cascade,
  question_text text not null,
  options jsonb not null,          -- ["Réponse A", "Réponse B", "Réponse C"]
  correct_index int not null
);

-- ---------------------------------------------------------
-- 4. PROGRESSION UTILISATEUR
-- ---------------------------------------------------------
create table public.user_course_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, course_id)
);

create table public.user_lesson_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- Marque automatiquement le cours comme terminé quand toutes ses leçons le sont
create function public.check_course_completion()
returns trigger as $$
declare
  v_course_id uuid;
  v_total int;
  v_done int;
begin
  select course_id into v_course_id from public.lessons where id = new.lesson_id;

  select count(*) into v_total from public.lessons where course_id = v_course_id;
  select count(*) into v_done
    from public.user_lesson_progress ulp
    join public.lessons l on l.id = ulp.lesson_id
    where l.course_id = v_course_id and ulp.user_id = new.user_id;

  insert into public.user_course_progress (user_id, course_id)
  values (new.user_id, v_course_id)
  on conflict (user_id, course_id) do nothing;

  if v_done >= v_total then
    update public.user_course_progress
      set completed_at = now()
      where user_id = new.user_id and course_id = v_course_id and completed_at is null;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_lesson_completed
  after insert on public.user_lesson_progress
  for each row execute procedure public.check_course_completion();

-- ---------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- ---------------------------------------------------------
alter table public.academy_categories enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_check_questions enable row level security;
alter table public.user_course_progress enable row level security;
alter table public.user_lesson_progress enable row level security;

create policy "public read academy_categories" on public.academy_categories for select using (true);
create policy "public read courses" on public.courses for select using (is_published = true or public.is_staff());
create policy "public read lessons" on public.lessons for select using (true);
create policy "public read lesson_check_questions" on public.lesson_check_questions for select using (true);

create policy "staff write academy_categories" on public.academy_categories for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write courses" on public.courses for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write lessons" on public.lessons for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write lesson_check_questions" on public.lesson_check_questions for all using (public.is_staff()) with check (public.is_staff());

create policy "user manage own course progress" on public.user_course_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "user manage own lesson progress" on public.user_lesson_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
