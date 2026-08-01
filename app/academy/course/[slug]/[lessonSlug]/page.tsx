import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/data/academy";
import { getCurrentUser } from "@/lib/auth";
import LessonReader from "@/components/academy/LessonReader";

interface Props {
  params: { slug: string; lessonSlug: string };
}

export async function generateMetadata({ params }: Props) {
  const course = await getCourseBySlug(params.slug);
  const lesson = course?.lessons.find((l) => l.slug === params.lessonSlug);
  return lesson ? { title: lesson.title } : {};
}

export default async function LessonPage({ params }: Props) {
  const [course, user] = await Promise.all([getCourseBySlug(params.slug), getCurrentUser()]);
  if (!course) notFound();

  const index = course.lessons.findIndex((l) => l.slug === params.lessonSlug);
  const lesson = course.lessons[index];
  if (!lesson) notFound();

  const prevLesson = index > 0 ? course.lessons[index - 1] : null;
  const nextLesson = index < course.lessons.length - 1 ? course.lessons[index + 1] : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <LessonReader
        course={{ slug: course.slug, title: course.title }}
        lesson={lesson}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        isAuthenticated={!!user}
      />
    </div>
  );
}
