import { createClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/config";
import { getMockDuelSubjects, mockQuizzes } from "@/lib/mock/games-data";
import type { DuelSubject, DuelSubjectType, Quiz, QuizWithQuestions } from "@/types/games";

/** Liste des sujets disponibles pour une catégorie de duel donnée. */
export async function getDuelSubjects(type: DuelSubjectType): Promise<DuelSubject[]> {
  if (isMockMode) return getMockDuelSubjects(type);

  const supabase = createClient();

  if (type === "film") {
    const { data, error } = await supabase.from("films").select("id, slug, title, poster_url");
    if (error) throw error;
    return (data ?? []).map((f: any) => ({ id: f.id, type, name: f.title, image_url: f.poster_url, slug: f.slug }));
  }

  // director / actor : dérivé des castings, dédoublonné
  const { data, error } = await supabase
    .from("film_credits")
    .select("people(id, slug, full_name, photo_url)")
    .eq("role", type);
  if (error) throw error;

  const seen = new Map<string, DuelSubject>();
  (data ?? []).forEach((row: any) => {
    const p = row.people;
    if (p && !seen.has(p.id)) {
      seen.set(p.id, { id: p.id, type, name: p.full_name, image_url: p.photo_url, slug: p.slug });
    }
  });
  return Array.from(seen.values());
}

/** Liste des quiz actifs. */
export async function listQuizzes(): Promise<Quiz[]> {
  if (isMockMode) return mockQuizzes.map(({ questions, ...q }) => q);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("id, slug, title, category, description, cover_url")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Un quiz avec ses questions et options de réponse — SANS la bonne réponse
 * (elle n'est jamais envoyée au client ; la validation passe par la fonction
 * RPC `submit_quiz_answer` exécutée côté serveur). */
export async function getQuizBySlug(slug: string): Promise<QuizWithQuestions | null> {
  if (isMockMode) return mockQuizzes.find((q) => q.slug === slug) ?? null;

  const supabase = createClient();
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select("id, slug, title, category, description, cover_url")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!quiz) return null;

  const { data: questions, error: qError } = await supabase
    .from("quiz_questions")
    .select("id, question_text, image_url, points, position, quiz_answers(id, answer_text, position)")
    .eq("quiz_id", quiz.id)
    .order("position");
  if (qError) throw qError;

  return {
    ...quiz,
    questions: (questions ?? []).map((q: any) => ({
      id: q.id,
      question_text: q.question_text,
      image_url: q.image_url,
      points: q.points,
      answers: (q.quiz_answers ?? [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((a: any) => ({ id: a.id, answer_text: a.answer_text })),
    })),
  };
}
