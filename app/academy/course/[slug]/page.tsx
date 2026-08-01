import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug, getLessonProgress } from "@/lib/data/academy";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const course = await getCourseBySlug(params.slug);
  return course ? { title: course.title } : {};
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  const completed = await getLessonProgress(params.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <Link href={`/academy/${course.category.slug}`} className="mb-6 inline-block text-sm text-ink-muted hover:text-corail">
        ← {course.category.name}
      </Link>

      <h1 className="font-display text-5xl tracking-poster text-ink">{course.title}</h1>
      {course.description && <p className="mt-4 text-ink-muted">{course.description}</p>}

      <div className="mt-10 space-y-3">
        {course.lessons.map((lesson, i) => {
          const isDone = completed.has(lesson.id);
          return (
            <Link
              key={lesson.id}
              href={`/academy/course/${course.slug}/${lesson.slug}`}
              className="flex items-center justify-between rounded-lg border border-rail bg-surface p-4 hover:border-corail"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs ${
                    isDone ? "bg-corail text-void" : "border border-rail text-ink-faint"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span className="text-ink">{lesson.title}</span>
              </span>
              <span className="font-mono text-xs text-ink-faint">{lesson.duration_minutes} min</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
