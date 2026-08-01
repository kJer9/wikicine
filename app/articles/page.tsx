import Link from "next/link";
import { listPublishedArticles, listArticleCategories } from "@/lib/data/articles";
import Pagination from "@/components/Pagination";

export const metadata = { title: "Analyses & articles" };

interface Props {
  searchParams: { q?: string; category?: string; page?: string };
}

export default async function ArticlesPage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? "1");
  const [{ articles, total, pageSize }, categories] = await Promise.all([
    listPublishedArticles({ query: searchParams.q, categorySlug: searchParams.category, page }),
    listArticleCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-display text-4xl tracking-poster text-ink">Analyses & articles</h1>
      <p className="mb-8 text-ink-muted">{total} article{total > 1 ? "s" : ""} publié{total > 1 ? "s" : ""}</p>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/articles"
          className={`chip ${!searchParams.category ? "border-corail !text-corail" : ""}`}
        >
          Tous
        </Link>
        {categories.map((c: any) => (
          <Link
            key={c.id}
            href={`/articles?category=${c.slug}`}
            className={`chip ${searchParams.category === c.slug ? "border-corail !text-corail" : ""}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="space-y-6">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/articles/${a.slug}`}
            className="block rounded-lg border border-rail bg-surface p-6 hover:border-corail"
          >
            <p className="chip mb-3 w-fit">{a.category?.name ?? "Article"}</p>
            <h2 className="font-display text-3xl tracking-poster text-ink">{a.title}</h2>
            {a.excerpt && <p className="mt-2 text-ink-muted">{a.excerpt}</p>}
            <p className="mt-3 font-mono text-xs uppercase tracking-chip text-ink-faint">
              {a.published_at && new Date(a.published_at).toLocaleDateString("fr-FR")}
              {a.author?.display_name && ` · Par ${a.author.display_name}`}
            </p>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="text-ink-muted">Aucun article pour l'instant.</p>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(total / pageSize))}
        basePath="/articles"
        searchParams={searchParams}
      />
    </div>
  );
}
