import { redirect } from "next/navigation";
import { listBadges } from "@/lib/data/progression";
import { getCurrentUser } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import ProgressionView from "@/components/progression/ProgressionView";

export const metadata = { title: "Ma progression" };

export default async function ProgressionPage() {
  const user = await getCurrentUser();
  if (!isMockMode && !user) redirect("/login");

  const badges = await listBadges();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="chip mb-4 w-fit">Progression</p>
      <h1 className="font-display text-5xl tracking-poster text-ink">Ton parcours de cinéphile</h1>
      <p className="mt-4 text-ink-muted">
        Chaque leçon, quiz, duel ou favori te fait gagner de l'XP. Monte de niveau et débloque des badges.
      </p>

      <ProgressionView allBadges={badges} isAuthenticated={!!user} />
    </div>
  );
}
