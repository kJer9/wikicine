import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-rail bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-ink-muted sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-display text-2xl tracking-poster text-ink">
              Wiki<span className="text-corail">Ciné</span>
            </p>
            <p className="mt-2 max-w-sm">
              L'encyclopédie collaborative du cinéma : films, réalisateurs, acteurs,
              mouvements et analyses.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            <Link href="/films" className="hover:text-ink">Catalogue</Link>
            <Link href="/articles" className="hover:text-ink">Analyses</Link>
            <Link href="/search" className="hover:text-ink">Recherche</Link>
          </nav>
        </div>
        <p className="mt-8 font-mono text-xs uppercase tracking-chip text-ink-faint">
          © {new Date().getFullYear()} WikiCiné — Projet éditorial non affilié aux studios cités.
        </p>
      </div>
    </footer>
  );
}
