"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isMockMode } from "@/lib/config";

export default function WatchlistButton({ filmId, isAuthenticated }: { filmId: string; isAuthenticated: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

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
        .from("watchlist")
        .select("film_id")
        .eq("film_id", filmId)
        .eq("user_id", userData.user.id)
        .maybeSingle();
      setActive(!!data);
      setLoading(false);
    })();
  }, [filmId, isAuthenticated]);

  async function toggle() {
    if (isMockMode) return;
    if (!isAuthenticated) return router.push("/login");

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return router.push("/login");

    if (active) {
      await supabase.from("watchlist").delete().eq("film_id", filmId).eq("user_id", userData.user.id);
    } else {
      await supabase.from("watchlist").insert({ film_id: filmId, user_id: userData.user.id });
    }
    setActive(!active);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={active}
      title={isMockMode ? "Connectez Supabase pour activer cette fonctionnalité" : undefined}
      className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-gold bg-gold/10 text-gold"
          : "border-rail text-ink-muted hover:border-gold hover:text-gold"
      }`}
    >
      {active ? "✓ À voir" : "+ À voir plus tard"}
    </button>
  );
}
