import { getDuelSubjects } from "@/lib/data/games";
import { getCurrentUser } from "@/lib/auth";
import DuelConfig from "@/components/games/DuelConfig";
import type { DuelSubjectType } from "@/types/games";

export const metadata = { title: "Tu préfères ? — Duel ELO" };

const TYPES: DuelSubjectType[] = ["film", "director", "actor"];

export default async function DuelPage() {
  const [subjectsByType, user] = await Promise.all([
    Promise.all(TYPES.map((t) => getDuelSubjects(t))),
    getCurrentUser(),
  ]);

  const subjects = Object.fromEntries(TYPES.map((t, i) => [t, subjectsByType[i]])) as Record<
    DuelSubjectType,
    Awaited<ReturnType<typeof getDuelSubjects>>
  >;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="chip mb-4 w-fit">Duel ELO</p>
      <h1 className="font-display text-5xl tracking-poster text-ink">Tu préfères ?</h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        Configure ton tournoi, puis choisis ton camp à chaque duel. Les gagnants s'affrontent jusqu'au champion — ton classement personnel se construit match après match.
      </p>

      <DuelConfig subjects={subjects} isAuthenticated={!!user} />
    </div>
  );
}
