"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isMockMode } from "@/lib/config";
import { awardMockEvent } from "@/lib/mock/progression-storage";
import ProgressToast from "@/components/progression/ProgressToast";
import type { Badge } from "@/types/progression";

export default function FavoriteButton({ filmId, isAuthenticated }: { filmId: string; isAuthenticated: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [xpGained, setXpGained] = useState<number | null>(null);

  useEffect(() => {
    if (isMockMode || !isAuthenticated) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return setLoading(false);
      const { data } = await supabase
        .from("favorites")
        .select("film_id")
        .eq("film_id", filmId)
        .eq("user_id", userData.user.id)
        .maybeSingle();
      setActive(!!data);
      setLoading(false);
    })();
  }, [filmId, isAuthenticated]);

  async function toggle() {
    if (isMockMode) {
      if (!active) {
        const { newBadges } = awardMockEvent("favorite", 2);
        setXpGained(2);
        setNewBadges(newBadges);
      }
      setActive(!active);
      return;
    }
    if (!isAuthenticated) return router.push("/login");

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return router.push("/login");

    if (active) {
      await supabase.from("favorites").delete().eq("film_id", filmId).eq("user_id", userData.user.id);
    } else {
      await supabase.from("favorites").insert({ film_id: filmId, user_id: userData.user.id });
    }
    setActive(!active);
  }

  return (
    <>
      <button
        onClick={toggle}
        disabled={loading}
        aria-pressed={active}
        title={isMockMode ? "Connectez Supabase pour activer les favoris" : undefined}
        className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          active
            ? "border-corail bg-corail/10 text-corail"
            : "border-rail text-ink-muted hover:border-corail hover:text-corail"
        }`}
      >
        {active ? "♥ Favori" : "♡ Favori"}
      </button>
      <ProgressToast xpGained={xpGained} newBadges={newBadges} />
    </>
  );
}
