import Link from "next/link";
import { listQuizzes } from "@/lib/data/games";

export const metadata = { title: "Quiz Cinéma" };

const CATEGORY_LABELS: Record<string, string> = {
  deviner_film: "Devine le film",
  deviner_realisateur: "Devine le réalisateur",
  citations: "Citations cultes",
  affiches: "Devine l'affiche",
  culture_generale: "Culture générale",
};

export default async function QuizListPage() {
  const quizzes = await listQuizzes();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="chip mb-4 w-fit">Quiz</p>
      <h1 className="font-display text-5xl tracking-poster text-ink">Quiz Cinéma</h1>
      <p className="mt-4 text-ink-muted">Teste tes connaissances et gagne des points sur chaque quiz.</p>

      <div className="mt-10 space-y-4">
        {quizzes.map((q) => (
          <Link
            key={q.id}
            href={`/games/quiz/${q.slug}`}
            className="block rounded-lg border border-rail bg-surface p-5 hover:border-corail"
          >
            <p className="chip mb-2 w-fit">{CATEGORY_LABELS[q.category] ?? q.category}</p>
            <h2 className="font-display text-2xl tracking-poster text-ink">{q.title}</h2>
            {q.description && <p className="mt-1 text-sm text-ink-muted">{q.description}</p>}
          </Link>
        ))}
        {quizzes.length === 0 && <p className="text-ink-muted">Aucun quiz disponible pour l'instant.</p>}
      </div>
    </div>
  );
}
