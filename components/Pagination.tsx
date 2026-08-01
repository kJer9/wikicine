import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

export default function Pagination({ currentPage, totalPages, basePath, searchParams }: Props) {
  if (totalPages <= 1) return null;

  function hrefFor(page: number) {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-2 font-mono text-sm" aria-label="Pagination">
      <Link
        href={hrefFor(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`rounded border border-rail px-3 py-1.5 ${
          currentPage === 1 ? "pointer-events-none opacity-30" : "hover:border-corail hover:text-corail"
        }`}
      >
        ← Précédent
      </Link>
      <span className="px-3 text-ink-muted">
        Page {currentPage} / {totalPages}
      </span>
      <Link
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`rounded border border-rail px-3 py-1.5 ${
          currentPage === totalPages ? "pointer-events-none opacity-30" : "hover:border-corail hover:text-corail"
        }`}
      >
        Suivant →
      </Link>
    </nav>
  );
}
