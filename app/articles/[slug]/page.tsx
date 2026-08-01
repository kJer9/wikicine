import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data/articles";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt ?? undefined };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  if (!article || article.status !== "published") notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="chip mb-4 w-fit">{article.category?.name ?? "Analyse"}</p>
      <h1 className="font-display text-5xl leading-none tracking-poster text-ink">{article.title}</h1>
      <p className="mt-4 font-mono text-xs uppercase tracking-chip text-ink-faint">
        {article.published_at && new Date(article.published_at).toLocaleDateString("fr-FR")}
        {(article as any).author?.display_name && ` · Par ${(article as any).author.display_name}`}
      </p>

      {article.cover_url && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-lg ring-1 ring-rail">
          <Image src={article.cover_url} alt={article.title} fill className="object-cover" />
        </div>
      )}

      {/* Rendu du contenu markdown : pour une mise en forme riche (titres, listes),
          brancher `react-markdown` ici. Rendu simple par paragraphes pour le MVP. */}
      <div className="prose prose-invert mt-10 max-w-none leading-relaxed text-ink">
        {article.content.split("\n\n").map((para, i) => (
          <p key={i} className="mb-5 whitespace-pre-line">{para.replace(/^#+\s*/, "")}</p>
        ))}
      </div>

      {(article as any).film && (
        <Link
          href={`/films/${(article as any).film.slug}`}
          className="mt-10 flex items-center gap-4 rounded-lg border border-rail bg-surface p-4 hover:border-corail"
        >
          {(article as any).film.poster_url && (
            <div className="relative h-20 w-14 overflow-hidden rounded ring-1 ring-rail">
              <Image src={(article as any).film.poster_url} alt="" fill className="object-cover" />
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-chip text-ink-muted">Film associé</p>
            <p className="font-display text-xl tracking-poster text-ink">{(article as any).film.title}</p>
          </div>
        </Link>
      )}
    </article>
  );
}
