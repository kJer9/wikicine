"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { isMockMode } from "@/lib/config";
import { loadMockRatings } from "@/lib/mock/elo-storage";
import type { DuelSubject, DuelSubjectType } from "@/types/games";

const TYPE_LABELS: Record<DuelSubjectType, string> = {
  film: "Films",
  director: "Réalisateurs",
  actor: "Acteurs",
};

const SIZE_OPTIONS = [4, 8, 16, 32];

export default function DuelConfig({
  subjects,
  isAuthenticated,
}: {
  subjects: Record<DuelSubjectType, DuelSubject[]>;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [type, setType] = useState<DuelSubjectType>("film");
  const [size, setSize] = useState<number>(8);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const pool = subjects[type];
  const availableSizes = SIZE_OPTIONS.filter((s) => s <= pool.length);
  const maxSize = availableSizes[availableSizes.length - 1] ?? 0;

  useEffect(() => {
    // Ajuste la taille sélectionnée si la catégorie change et qu'elle n'a plus assez de sujets
    if (!availableSizes.includes(size)) setSize(maxSize || 0);
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
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
  }, [type, isAuthenticated]);

  const leaderboard = useMemo(() => {
    return pool
      .filter((s) => ratings[s.id] !== undefined)
      .map((s) => ({ subject: s, rating: ratings[s.id] }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [pool, ratings]);

  function start() {
    if (!size) return;
    router.push(`/games/duel/play?type=${type}&size=${size}`);
  }

  return (
    <div className="mt-10">
      {/* Sujet */}
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-chip text-ink-muted">Sujet du tournoi</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as DuelSubjectType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`chip cursor-pointer ${type === t ? "border-corail !text-corail" : ""}`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Taille du tournoi */}
      <div className="mt-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-chip text-ink-muted">Taille du tournoi</p>
        {availableSizes.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Pas assez de {TYPE_LABELS[type].toLowerCase()} dans le catalogue pour lancer un tournoi (minimum 4).
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`chip cursor-pointer ${size === s ? "border-corail !text-corail" : ""}`}
              >
                {s} participants ({Math.log2(s)} tours)
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={start}
        disabled={!size}
        className="mt-8 rounded-full bg-corail px-8 py-3 font-medium text-void hover:bg-corail-soft disabled:cursor-not-allowed disabled:opacity-40"
      >
        Lancer le tournoi
      </button>

      {isMockMode && (
        <p className="mt-4 max-w-md text-sm text-ink-faint">
          Mode démo : ton classement est conservé dans ton navigateur (pas sur un vrai compte).
        </p>
      )}

      {/* Classement personnel */}
      <div className="mt-14">
        <h2 className="mb-4 font-display text-2xl tracking-poster text-ink">
          Ton classement — {TYPE_LABELS[type]}
        </h2>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-ink-muted">Joue un premier tournoi pour faire apparaître ton classement ici.</p>
        ) : (
          <ol className="space-y-2">
            {leaderboard.map((entry, i) => (
              <li
                key={entry.subject.id}
                className="flex items-center justify-between rounded-lg border border-rail bg-surface px-4 py-3"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-sm text-ink-faint">#{i + 1}</span>
                  {entry.subject.image_url && (
                    <span className="relative h-10 w-10 overflow-hidden rounded ring-1 ring-rail">
                      <Image src={entry.subject.image_url} alt="" fill className="object-cover" />
                    </span>
                  )}
                  <span className="text-ink">{entry.subject.name}</span>
                </span>
                <span className="font-mono text-sm text-gold">{Math.round(entry.rating)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
