import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArticleForm from "@/components/admin/ArticleForm";

export const metadata = { title: "Admin · Modifier un article" };

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: article } = await supabase.from("articles").select("*").eq("id", params.id).maybeSingle();
  if (!article) notFound();

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl tracking-poster text-ink">Modifier « {article.title} »</h2>
      <ArticleForm article={article} />
    </div>
  );
}
