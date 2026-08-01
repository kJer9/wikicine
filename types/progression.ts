export type BadgeCriteriaType =
  | "lessons_completed"
  | "courses_completed"
  | "duels_played"
  | "quizzes_completed"
  | "favorites_added"
  | "level_reached";

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  criteria_type: BadgeCriteriaType;
  criteria_threshold: number;
}

export interface EarnedBadge extends Badge {
  earned_at: string;
}

export interface ProgressCounts {
  lessons: number;
  courses: number;
  duels: number;
  quizzes: number;
  favorites: number;
}

export interface UserProgress {
  xp: number;
  counts: ProgressCounts;
  earnedSlugs: string[];
}
