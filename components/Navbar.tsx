import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import SearchBar from "@/components/SearchBar";
import UserMenu from "@/components/UserMenu";

export default async function Navbar() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-40 bg-void/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 font-display text-3xl tracking-poster text-ink">
          Wiki<span className="text-corail">Ciné</span>
        </Link>

        {isMockMode && (
          <span className="chip hidden border-gold/40 !text-gold sm:inline-flex" title="Données de démonstration — connectez Supabase pour activer comptes, favoris et back-office.">
            Mode démo
          </span>
        )}

        <nav className="hidden items-center gap-5 text-sm text-ink-muted md:flex">
          <Link href="/films" className="hover:text-ink">Films</Link>
          <Link href="/games" className="hover:text-ink">Jeux</Link>
          <Link href="/academy" className="hover:text-ink">Académie</Link>
          <Link href="/progression" className="hover:text-ink">Progression</Link>
          <Link href="/articles" className="hover:text-ink">Analyses</Link>
          <Link href="/search" className="hover:text-ink">Recherche avancée</Link>
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-4">
          <SearchBar className="hidden max-w-xs flex-1 sm:block" />
          <UserMenu profile={profile} />
        </div>
      </div>
    </header>
  );
}
