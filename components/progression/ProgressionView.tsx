"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isMockMode } from "@/lib/config";
import { getMockProgress } from "@/lib/mock/progression-storage";
import { getXpProgress } from "@/lib/xp";
import type { Badge, ProgressCounts } from "@/types/progression";

interface State {
  xp: number;
  counts: ProgressCounts;
  earnedSlugs: string[];
  loaded: boolean;
}

const STAT_LABELS: { key: keyof ProgressCounts; label: string; icon: string }[] = [
  { key: "lessons", label: "Leçons terminées", icon: "📖" },
  { key: "courses", label: "Cours complétés", icon: "🎓" },
  { key: "duels", label: "Duels joués", icon: "⚔️" },
  { key: "quizzes", label: "Quiz terminés", icon: "🎯" },
  { key: "favorites", label: "Films favoris", icon: "❤️" },
];

export default function ProgressionView({ allBadges, isAuthenticated }: { allBadges: Badge[]; isAuthenticated: boolean }) {
  const [state, setState] = useState<State>({
    xp: 0,
    counts: { lessons: 0, courses: 0, duels: 0, quizzes: 0, favorites: 0 },
    earnedSlugs: [],
    loaded: false,
  });

  useEffect(() => {
    if (isMockMode) {
      const p = getMockProgress();
      setState({ ...p, loaded: true });
      return;
    }
    if (!isAuthenticated) return;

    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const uid = userData.user.id;

      const [stats, badges, lessons, courses, duels, quizzes, favorites] = await Promise.all([
        supabase.from("user_stats").select("xp").eq("user_id", uid).maybeSingle(),
        supabase.from("user_badges").select("badges(slug)").eq("user_id", uid),
        supabase.from("user_lesson_progress").select("*", { count: "exact", head: true }).eq("user_id", uid),
        supabase.from("user_course_progress").select("*", { count: "exact", head: true }).eq("user_id", uid).not("completed_at", "is", null),
        supabase.from("duels").select("*", { count: "exact", head: true }).eq("user_id", uid),
        supabase.from("quiz_attempts").select("*", { count: "exact", head: true }).eq("user_id", uid).not("completed_at", "is", null),
        supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", uid),
      ]);

      setState({
        xp: Number(stats.data?.xp ?? 0),
        counts: {
          lessons: lessons.count ?? 0,
          courses: courses.count ?? 0,
          duels: duels.count ?? 0,
          quizzes: quizzes.count ?? 0,
          favorites: favorites.count ?? 0,
        },
        earnedSlugs: (badges.data ?? []).map((b: any) => b.badges?.slug).filter(Boolean),
        loaded: true,
      });
    })();
  }, [isAuthenticated]);

  if (!isMockMode && !isAuthenticated) return null;

  const progress = getXpProgress(state.xp);

  return (
    <div className="mt-10">
      {isMockMode && (
        <p className="mb-6 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold">
          Mode démo : ta progression est conservée dans ton navigateur.
        </p>
      )}

      {/* Niveau + barre d'XP */}
      <div className="rounded-lg border border-rail bg-surface p-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-3xl tracking-poster text-ink">Niveau {progress.level}</p>
          <p className="font-mono text-sm text-ink-muted">{progress.xp} XP</p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-elevated">
          <div className="h-full rounded-full bg-corail transition-all" style={{ width: `${progress.progressPercent}%` }} />
        </div>
        <p className="mt-2 font-mono text-xs text-ink-faint">
          {progress.xp - progress.currentLevelXp} / {progress.nextLevelXp - progress.currentLevelXp} XP jusqu'au niveau {progress.level + 1}
        </p>
      </div>

      {/* Statistiques */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STAT_LABELS.map((s) => (
          <div key={s.key} className="rounded-lg border border-rail bg-surface p-4 text-center">
            <p className="text-2xl">{s.icon}</p>
            <p className="mt-1 font-display text-2xl text-ink">{state.counts[s.key]}</p>
            <p className="mt-1 text-xs text-ink-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="mt-12">
        <h2 className="mb-4 font-display text-2xl tracking-poster text-ink">
          Badges ({state.earnedSlugs.length}/{allBadges.length})
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {allBadges.map((b) => {
            const earned = state.earnedSlugs.includes(b.slug);
            return (
              <div
                key={b.id}
                className={`flex items-start gap-3 rounded-lg border p-4 ${
                  earned ? "border-gold/40 bg-gold/5" : "border-rail bg-surface opacity-50"
                }`}
              >
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className={`font-display text-lg tracking-poster ${earned ? "text-gold" : "text-ink"}`}>{b.name}</p>
                  <p className="text-sm text-ink-muted">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
