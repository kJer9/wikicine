"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { isMockMode } from "@/lib/config";
import { loadMockRatings, saveMockRatings } from "@/lib/mock/elo-storage";
import { computeEloUpdate } from "@/lib/elo";
import { awardMockEvent } from "@/lib/mock/progression-storage";
import ProgressToast from "@/components/progression/ProgressToast";
import type { Badge } from "@/types/progression";
import type { DuelSubject, DuelSubjectType } from "@/types/games";

const ROUND_NAMES: Record<number, string> = {
  1: "Finale",
  2: "Demi-finale",
  4: "Quart de finale",
  8: "Huitième de finale",
  16: "Seizième de finale",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  subjects: DuelSubject[];
  type: DuelSubjectType;
  size: number;
  isAuthenticated: boolean;
}

export default function DuelTournament({ subjects, type, size, isAuthenticated }: Props) {
  const shouldPersist = !isMockMode && isAuthenticated;

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [roundList, setRoundList] = useState<DuelSubject[] | null>(null);
  const [pairIndex, setPairIndex] = useState(0);
  const [winners, setWinners] = useState<DuelSubject[]>([]);
  const [champion, setChampion] = useState<DuelSubject | null>(null);
  const [voting, setVoting] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  // Tirage initial (côté client uniquement, pour éviter tout écart de rendu serveur/client)
  useEffect(() => {
    setRoundList(shuffle(subjects).slice(0, size));

    if (isMockMode) {
      setRatings(loadMockRatings(type));
      return;
    }
    if (!isAuthenticated) return;

    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase
        .from("user_elo_ratings")
        .select("subject_id, rating")
        .eq("user_id", userData.user.id)
        .eq("subject_type", type);
      const map: Record<string, number> = {};
      (data ?? []).forEach((r: any) => (map[r.subject_id] = Number(r.rating)));
      setRatings(map);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!roundList) {
    return <p className="text-center text-ink-muted">Préparation du tournoi…</p>;
  }
  const list = roundList;

  if (champion) {
    return (
      <div className="text-center">
        <p className="chip mx-auto mb-4 w-fit">Champion du tournoi</p>
        {champion.image_url && (
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-lg ring-2 ring-gold">
            <Image src={champion.image_url} alt={champion.name} fill className="object-cover" />
          </div>
        )}
        <p className="mt-6 font-display text-5xl tracking-poster text-gold">{champion.name} 🏆</p>
        <div className="flex justify-center">
          <ProgressToast xpGained={null} newBadges={newBadges} />
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/games/duel" className="rounded-full bg-corail px-6 py-2.5 font-medium text-void hover:bg-corail-soft">
            Voir mon classement
          </Link>
        </div>
      </div>
    );
  }

  const totalInRound = list.length;
  const matchesInRound = totalInRound / 2;
  const currentMatch = Math.floor(pairIndex / 2) + 1;
  const a = list[pairIndex];
  const b = list[pairIndex + 1];
  const roundLabel = ROUND_NAMES[totalInRound] ?? `Tour à ${totalInRound}`;

  async function vote(winner: DuelSubject, loser: DuelSubject) {
    if (voting) return;
    setVoting(true);

    const ratingA = ratings[winner.id] ?? 1200;
    const ratingB = ratings[loser.id] ?? 1200;
    const { ratingA: newWinnerRating, ratingB: newLoserRating } = computeEloUpdate(ratingA, ratingB, true);
    const newRatings = { ...ratings, [winner.id]: newWinnerRating, [loser.id]: newLoserRating };
    setRatings(newRatings);

    if (isMockMode) {
      saveMockRatings(type, newRatings);
      const { newBadges: earned } = awardMockEvent("duel", 5);
      if (earned.length > 0) setNewBadges((prev) => [...prev, ...earned]);
    } else if (shouldPersist) {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from("duels").insert({
          user_id: userData.user.id,
          subject_type: type,
          subject_a_id: winner.id,
          subject_b_id: loser.id,
          winner_id: winner.id,
        });
      }
    }

    const newWinners = [...winners, winner];
    const isLastPairOfRound = pairIndex + 2 >= list.length;

    if (isLastPairOfRound) {
      if (newWinners.length === 1) {
        setChampion(newWinners[0]);
      } else {
        setRoundList(shuffle(newWinners));
        setWinners([]);
        setPairIndex(0);
      }
    } else {
      setWinners(newWinners);
      setPairIndex((i) => i + 2);
    }

    setVoting(false);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="chip">{roundLabel}</p>
        <p className="font-mono text-xs text-ink-muted">
          Match {currentMatch} / {matchesInRound}
        </p>
      </div>

      {isMockMode && (
        <p className="mb-6 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold">
          Mode démo : ton classement est conservé dans ton navigateur.
        </p>
      )}

      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        {[a, b].map((s, i) => (
          <button
            key={s.id}
            onClick={() => vote(s, i === 0 ? b : a)}
            disabled={voting}
            className="group rounded-lg border border-rail bg-surface p-6 text-center transition-colors hover:border-corail disabled:opacity-60"
          >
            {s.image_url && (
              <div className="relative mx-auto mb-4 h-40 w-32 overflow-hidden rounded ring-1 ring-rail">
                <Image src={s.image_url} alt={s.name} fill className="object-cover" />
              </div>
            )}
            <p className="font-display text-2xl tracking-poster text-ink group-hover:text-corail">{s.name}</p>
            <p className="mt-1 font-mono text-xs text-ink-faint">ELO {Math.round(ratings[s.id] ?? 1200)}</p>
          </button>
        ))}
        <p className="hidden text-center font-display text-2xl text-ink-faint sm:block">VS</p>
      </div>

      <p className="mt-8 text-center font-mono text-xs uppercase tracking-chip text-ink-faint">
        {size} participants engagés — {Math.log2(size)} tours au total
      </p>
      <div className="mt-4 flex justify-center">
        <ProgressToast xpGained={null} newBadges={newBadges} />
      </div>
    </div>
  );
}
