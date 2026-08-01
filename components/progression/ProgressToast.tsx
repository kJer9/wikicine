"use client";

import type { Badge } from "@/types/progression";

export default function ProgressToast({ xpGained, newBadges }: { xpGained: number | null; newBadges: Badge[] }) {
  if (!xpGained && newBadges.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {xpGained ? (
        <span className="chip border-corail !text-corail">+{xpGained} XP</span>
      ) : null}
      {newBadges.map((b) => (
        <span key={b.slug} className="chip border-gold/40 !text-gold">
          {b.icon} Badge débloqué : {b.name}
        </span>
      ))}
    </div>
  );
}
