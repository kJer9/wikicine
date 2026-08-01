import Link from "next/link";
import { listAcademyCategories, countCoursesByCategory } from "@/lib/data/academy";

export const metadata = { title: "Académie du Cinéma" };

export default async function AcademyHubPage() {
  const [categories, counts] = await Promise.all([listAcademyCategories(), countCoursesByCategory()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="chip mb-4 w-fit">Académie du Cinéma</p>
      <h1 className="font-display text-5xl tracking-poster text-ink">Apprends le cinéma, gratuitement</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Des cours courts et progressifs pour découvrir le scénario, la réalisation, le montage, l'histoire du cinéma et bien plus — sans prérequis.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = counts[cat.slug] ?? 0;
          const available = count > 0;
          const content = (
            <>
              <span className="text-3xl">{cat.icon}</span>
              <h2 className="mt-3 font-display text-xl tracking-poster text-ink">{cat.name}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {available ? `${count} cours disponible${count > 1 ? "s" : ""}` : "Bientôt disponible"}
              </p>
            </>
          );

          return available ? (
            <Link
              key={cat.id}
              href={`/academy/${cat.slug}`}
              className="block rounded-lg border border-rail bg-surface p-6 hover:border-corail"
            >
              {content}
            </Link>
          ) : (
            <div key={cat.id} className="rounded-lg border border-rail bg-surface/50 p-6 opacity-60">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
