import { createClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/config";
import { mockArticles, mockArticleCategories } from "@/lib/mock/data";
import type { Article } from "@/types/database";

export async function listPublishedArticles(opts: {
  categorySlug?: string;
  query?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  if (isMockMode) {
    let articles = mockArticles.filter((a) => a.status === "published");
    if (opts.query) {
      const q = opts.query.toLowerCase();
      articles = articles.filter((a) => a.title.toLowerCase().includes(q));
    }
    if (opts.categorySlug) {
      articles = articles.filter((a) => a.category?.slug === opts.categorySlug);
    }
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 12;
    const start = (page - 1) * pageSize;
    return { articles: articles.slice(start, start + pageSize), total: articles.length, page, pageSize };
  }

  const supabase = createClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("articles")
    .select("*, category:article_categories(*), author:profiles(username, display_name, avatar_url)", {
      count: "exact",
    })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (opts.query) query = query.ilike("title", `%${opts.query}%`);
  if (opts.categorySlug) query = query.eq("category.slug", opts.categorySlug);

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return { articles: (data ?? []) as unknown as Article[], total: count ?? 0, page, pageSize };
}

export async function getArticleBySlug(slug: string) {
  if (isMockMode) return mockArticles.find((a) => a.slug === slug) ?? null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "*, category:article_categories(*), author:profiles(username, display_name, avatar_url), film:films(title, slug, poster_url)"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Article | null;
}

export async function listArticleCategories() {
  if (isMockMode) return mockArticleCategories;

  const supabase = createClient();
  const { data, error } = await supabase.from("article_categories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}
