import { levelFromXp } from "@/lib/xp";
import { mockBadges } from "@/lib/mock/progression-data";
import type { Badge, ProgressCounts, UserProgress } from "@/types/progression";

const KEY = "wikicine_demo_progress";

function empty(): UserProgress {
  return { xp: 0, counts: { lessons: 0, courses: 0, duels: 0, quizzes: 0, favorites: 0 }, earnedSlugs: [] };
}

function load(): UserProgress {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}

function save(state: UserProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // stockage indisponible : on ignore silencieusement
  }
}

export function getMockProgress(): UserProgress {
  return load();
}

type ProgressEvent = "lesson" | "course" | "duel" | "quiz" | "favorite";

const EVENT_TO_COUNT_KEY: Record<ProgressEvent, keyof ProgressCounts> = {
  lesson: "lessons",
  course: "courses",
  duel: "duels",
  quiz: "quizzes",
  favorite: "favorites",
};

/** Enregistre un événement de progression en mode démo (XP + compteur), et
 * renvoie les badges nouvellement débloqués pour affichage immédiat. */
export function awardMockEvent(event: ProgressEvent, xpAmount: number): { newBadges: Badge[] } {
  const state = load();
  state.xp += xpAmount;
  const countKey = EVENT_TO_COUNT_KEY[event];
  state.counts[countKey] += 1;

  const level = levelFromXp(state.xp);
  const newBadges: Badge[] = [];

  mockBadges.forEach((b) => {
    if (state.earnedSlugs.includes(b.slug)) return;
    const value =
      b.criteria_type === "lessons_completed" ? state.counts.lessons :
      b.criteria_type === "courses_completed" ? state.counts.courses :
      b.criteria_type === "duels_played" ? state.counts.duels :
      b.criteria_type === "quizzes_completed" ? state.counts.quizzes :
      b.criteria_type === "favorites_added" ? state.counts.favorites :
      level;
    if (value >= b.criteria_threshold) {
      state.earnedSlugs.push(b.slug);
      newBadges.push(b);
    }
  });

  save(state);
  return { newBadges };
}
