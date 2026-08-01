import Link from "next/link";

interface Props {
  profile: { username: string; display_name: string | null; avatar_url: string | null; role: string } | null;
}

export default function UserMenu({ profile }: Props) {
  if (!profile) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/login"
          className="rounded-full px-3 py-1.5 text-ink-muted hover:text-ink"
        >
          Connexion
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-corail px-3 py-1.5 font-medium text-void hover:bg-corail-soft"
        >
          S'inscrire
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      {profile.role === "admin" && (
        <Link href="/admin" className="chip !text-gold border-gold/40 hover:border-gold">
          Admin
        </Link>
      )}
      <Link href="/favorites" className="text-ink-muted hover:text-ink">Favoris</Link>
      <Link href="/watchlist" className="text-ink-muted hover:text-ink">À voir</Link>
      <Link href="/progression" className="text-ink-muted hover:text-ink">Progression</Link>
      <Link href="/profile" className="flex items-center gap-2 text-ink hover:text-corail">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated ring-1 ring-rail"
          aria-hidden
        >
          {(profile.display_name ?? profile.username)[0]?.toUpperCase()}
        </span>
        <span className="hidden lg:inline">{profile.display_name ?? profile.username}</span>
      </Link>
    </div>
  );
}
