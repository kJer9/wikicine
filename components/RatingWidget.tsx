"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isMockMode } from "@/lib/config";

const SCORES = [2, 4, 6, 7, 8, 9, 10];

export default function RatingWidget({ filmId, isAuthenticated }: { filmId: string; isAuthenticated: boolean }) {
  const router = useRouter();
  const [myScore, setMyScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isMockMode || !isAuthenticated) return;
    const supabase = createClient();
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase
        .from("ratings")
        .select("score")
        .eq("film_id", filmId)
        .eq("user_id", userData.user.id)
        .maybeSingle();
      if (data) setMyScore(Number(data.score));
    })();
  }, [filmId, isAuthenticated]);

  async function rate(score: number) {
    if (isMockMode) return;
    if (!isAuthenticated) return router.push("/login");

    setSaving(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return router.push("/login");

    await supabase
      .from("ratings")
      .upsert({ film_id: filmId, user_id: userData.user.id, score }, { onConflict: "user_id,film_id" });
    setMyScore(score);
    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <p className="mb-2 text-sm text-ink-muted">
        Votre note{isMockMode && <span className="ml-2 text-xs text-ink-faint">(connectez Supabase pour noter)</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {SCORES.map((s) => (
          <button
            key={s}
            onClick={() => rate(s)}
            disabled={saving}
            className={`h-9 w-9 rounded-full font-mono text-sm transition-colors ${
              myScore === s
                ? "bg-corail text-void"
                : "border border-rail text-ink-muted hover:border-corail hover:text-corail"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
