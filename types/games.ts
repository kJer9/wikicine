export type DuelSubjectType = "film" | "director" | "actor";

export interface DuelSubject {
  id: string;
  type: DuelSubjectType;
  name: string;
  image_url: string | null;
  slug: string;
}

export interface EloRating {
  subject_id: string;
  subject_type: DuelSubjectType;
  rating: number;
  matches_played: number;
  wins: number;
  losses: number;
}

export type QuizCategory =
  | "deviner_film"
  | "deviner_realisateur"
  | "citations"
  | "affiches"
  | "culture_generale";

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  category: QuizCategory;
  description: string | null;
  cover_url: string | null;
}

export interface QuizAnswerOption {
  id: string;
  answer_text: string;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  image_url: string | null;
  points: number;
  answers: QuizAnswerOption[];
}

export interface QuizWithQuestions extends Quiz {
  questions: QuizQuestion[];
}
