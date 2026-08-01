import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export const metadata = { title: "Mon profil" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-elevated text-2xl ring-1 ring-rail">
          {(profile?.display_name ?? profile?.username ?? "?")[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-3xl tracking-poster text-ink">
            {profile?.display_name ?? profile?.username}
          </h1>
          <p className="text-sm text-ink-muted">@{profile?.username} · {user.email}</p>
        </div>
      </div>

      {profile?.bio && <p className="mt-6 text-ink-muted">{profile.bio}</p>}

      <div className="mt-10 flex gap-3">
        <a href="/favorites" className="rounded-full border border-rail px-5 py-2 text-sm hover:border-corail hover:text-corail">
          Mes favoris
        </a>
        <a href="/watchlist" className="rounded-full border border-rail px-5 py-2 text-sm hover:border-corail hover:text-corail">
          Ma liste à voir
        </a>
        {profile?.role === "admin" && (
          <a href="/admin" className="rounded-full border border-gold/40 px-5 py-2 text-sm text-gold hover:border-gold">
            Administration
          </a>
        )}
      </div>

      <div className="mt-10">
        <LogoutButton />
      </div>
    </div>
  );
}
