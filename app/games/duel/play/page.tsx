import { redirect } from "next/navigation";
import { getDuelSubjects } from "@/lib/data/games";
import { getCurrentUser } from "@/lib/auth";
import DuelTournament from "@/components/games/DuelTournament";
import type { DuelSubjectType } from "@/types/games";

export const metadata = { title: "Tournoi en cours — Tu préfères ?" };

interface Props {
  searchParams: { type?: string; size?: string };
}

const VALID_TYPES: DuelSubjectType[] = ["film", "director", "actor"];

export default async function DuelPlayPage({ searchParams }: Props) {
  const type = searchParams.type as DuelSubjectType;
  const size = Number(searchParams.size);

  if (!VALID_TYPES.includes(type) || !size || size < 2) {
    redirect("/games/duel");
  }

  const [subjects, user] = await Promise.all([getDuelSubjects(type), getCurrentUser()]);
  if (subjects.length < size) redirect("/games/duel");

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <DuelTournament subjects={subjects} type={type} size={size} isAuthenticated={!!user} />
    </div>
  );
}
