import { notFound } from "next/navigation";
import { getQuizBySlug } from "@/lib/data/games";
import { getCurrentUser } from "@/lib/auth";
import QuizPlayer from "@/components/games/QuizPlayer";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const quiz = await getQuizBySlug(params.slug);
  if (!quiz) return {};
  return { title: quiz.title };
}

export default async function QuizPage({ params }: Props) {
  const [quiz, user] = await Promise.all([getQuizBySlug(params.slug), getCurrentUser()]);
  if (!quiz) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <QuizPlayer quiz={quiz} isAuthenticated={!!user} />
    </div>
  );
}
