export type CourseLevel = "debutant" | "intermediaire" | "avance";

export interface AcademyCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: CourseLevel;
  cover_url: string | null;
  category: AcademyCategory;
  lessonCount: number;
}

export interface LessonCheckQuestion {
  question_text: string;
  options: string[];
  correct_index: number;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  content: string;
  duration_minutes: number;
  xp_reward: number;
  position: number;
  check?: LessonCheckQuestion;
}

export interface CourseWithLessons extends Course {
  lessons: Lesson[];
}
