import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "editor"].includes(profile.role)) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl tracking-poster text-ink">Administration</h1>
        <span className="chip border-gold/40 !text-gold">{profile.role}</span>
      </div>
      <nav className="mb-10 flex gap-2 border-b border-rail pb-4">
        <Link href="/admin" className="chip hover:border-corail hover:text-corail">Tableau de bord</Link>
        <Link href="/admin/films" className="chip hover:border-corail hover:text-corail">Films</Link>
        <Link href="/admin/articles" className="chip hover:border-corail hover:text-corail">Articles</Link>
        <Link href="/admin/users" className="chip hover:border-corail hover:text-corail">Utilisateurs</Link>
      </nav>
      {children}
    </div>
  );
}
