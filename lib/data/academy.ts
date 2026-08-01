import { createClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/config";
import { mockAcademyCategories, mockCourses } from "@/lib/mock/academy-data";
import type { AcademyCategory, CourseWithLessons } from "@/types/academy";

export async function listAcademyCategories(): Promise<AcademyCategory[]> {
  if (isMockMode) return mockAcademyCategories;

  const supabase = createClient();
  const { data, error } = await supabase.from("academy_categories").select("*").order("position");
  if (error) throw error;
  return data ?? [];
}

/** Nombre de cours publiés par catégorie (pour l'affichage du hub). */
export async function countCoursesByCategory(): Promise<Record<string, number>> {
  if (isMockMode) {
    const counts: Record<string, number> = {};
    mockCourses.forEach((c) => {
      counts[c.category.slug] = (counts[c.category.slug] ?? 0) + 1;
    });
    return counts;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("academy_categories(slug)")
    .eq("is_published", true);
  if (error) throw error;

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row: any) => {
    const slug = row.academy_categories?.slug;
    if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
  });
  return counts;
}

export async function listCoursesByCategory(categorySlug: string) {
  if (isMockMode) {
    return mockCourses
      .filter((c) => c.category.slug === categorySlug)
      .map(({ lessons, ...c }) => c);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*, category:academy_categories!inner(*)")
    .eq("category.slug", categorySlug)
    .eq("is_published", true)
    .order("position");
  if (error) throw error;
  return data ?? [];
}

export async function getCourseBySlug(slug: string): Promise<CourseWithLessons | null> {
  if (isMockMode) return mockCourses.find((c) => c.slug === slug) ?? null;

  const supabase = createClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select("*, category:academy_categories(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!course) return null;

  const { data: lessons, error: lError } = await supabase
    .from("lessons")
    .select("*, lesson_check_questions(*)")
    .eq("course_id", course.id)
    .order("position");
  if (lError) throw lError;

  return {
    ...course,
    lessonCount: lessons?.length ?? 0,
    lessons: (lessons ?? []).map((l: any) => ({
      ...l,
      check: l.lesson_check_questions
        ? {
            question_text: l.lesson_check_questions.question_text,
            options: l.lesson_check_questions.options,
            correct_index: l.lesson_check_questions.correct_index,
          }
        : undefined,
    })),
  } as CourseWithLessons;
}

export async function getLessonProgress(courseSlug: string): Promise<Set<string>> {
  if (isMockMode) return new Set();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const course = await getCourseBySlug(courseSlug);
  if (!course) return new Set();

  const { data } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .in("lesson_id", course.lessons.map((l) => l.id));

  return new Set((data ?? []).map((r: any) => r.lesson_id));
}
