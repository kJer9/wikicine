import Link from "next/link";
import { notFound } from "next/navigation";
import { listAcademyCategories, listCoursesByCategory } from "@/lib/data/academy";

interface Props {
  params: { category: string };
}

const LEVEL_LABELS: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export async function generateMetadata({ params }: Props) {
  const categories = await listAcademyCategories();
  const cat = categories.find((c) => c.slug === params.category);
  return cat ? { title: cat.name } : {};
}

export default async function CategoryCoursesPage({ params }: Props) {
  const categories = await listAcademyCategories();
  const category = categories.find((c) => c.slug === params.category);
  if (!category) notFound();

  const courses = await listCoursesByCategory(params.category);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <Link href="/academy" className="mb-6 inline-block text-sm text-ink-muted hover:text-corail">← Académie</Link>
      <p className="chip mb-4 w-fit">{category.icon} {category.name}</p>
      <h1 className="font-display text-4xl tracking-poster text-ink">{category.name}</h1>
      {category.description && <p className="mt-3 text-ink-muted">{category.description}</p>}

      <div className="mt-10 space-y-4">
        {courses.map((c: any) => (
          <Link
            key={c.id}
            href={`/academy/course/${c.slug}`}
            className="block rounded-lg border border-rail bg-surface p-6 hover:border-corail"
          >
            <div className="flex items-center gap-2">
              <span className="chip">{LEVEL_LABELS[c.level] ?? c.level}</span>
              <span className="font-mono text-xs text-ink-faint">{c.lessonCount ?? c.lessons?.length ?? "—"} leçons</span>
            </div>
            <h2 className="mt-3 font-display text-2xl tracking-poster text-ink">{c.title}</h2>
            {c.description && <p className="mt-1 text-sm text-ink-muted">{c.description}</p>}
          </Link>
        ))}
        {courses.length === 0 && <p className="text-ink-muted">Pas encore de cours dans cette catégorie.</p>}
      </div>
    </div>
  );
}
