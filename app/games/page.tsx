import Link from "next/link";

export const metadata = { title: "Jeux" };

const games = [
  {
    href: "/games/duel",
    title: "Tu préfères ?",
    description: "Tournoi à élimination directe entre films, réalisateurs ou acteurs. Configure ton tournoi et construis ton classement ELO personnel.",
    icon: "⚔️",
  },
  {
    href: "/games/quiz",
    title: "Quiz Cinéma",
    description: "Devine le film à partir de son synopsis, teste ta culture générale et gagne des points.",
    icon: "🎯",
  },
];

export default function GamesHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="chip mb-4 w-fit">Jeux</p>
      <h1 className="font-display text-5xl tracking-poster text-ink">Joue avec ta culture cinéma</h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        Deux façons de tester et faire progresser ta culture cinéma.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {games.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="block rounded-lg border border-rail bg-surface p-6 transition-colors hover:border-corail"
          >
            <span className="text-3xl">{g.icon}</span>
            <h2 className="mt-3 font-display text-2xl tracking-poster text-ink">{g.title}</h2>
            <p className="mt-2 text-sm text-ink-muted">{g.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
