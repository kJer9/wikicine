import ArticleForm from "@/components/admin/ArticleForm";

export const metadata = { title: "Admin · Nouvel article" };

export default function NewArticlePage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl tracking-poster text-ink">Nouvel article</h2>
      <ArticleForm />
    </div>
  );
}
