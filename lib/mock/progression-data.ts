import type { Badge } from "@/types/progression";

// Miroir exact du INSERT INTO public.badges dans supabase/schema_progression.sql.
// À garder synchronisé si tu ajoutes/modifies des badges côté SQL.
export const mockBadges: Badge[] = [
  { id: "b1", slug: "premiers-pas", name: "Premiers pas", description: "Termine ta première leçon de l'Académie.", icon: "🎬", criteria_type: "lessons_completed", criteria_threshold: 1 },
  { id: "b2", slug: "cinephile-en-herbe", name: "Cinéphile en herbe", description: "Termine 5 leçons de l'Académie.", icon: "📚", criteria_type: "lessons_completed", criteria_threshold: 5 },
  { id: "b3", slug: "erudit", name: "Érudit du cinéma", description: "Termine 3 cours complets de l'Académie.", icon: "🎓", criteria_type: "courses_completed", criteria_threshold: 3 },
  { id: "b4", slug: "strategiste-elo", name: "Stratège ELO", description: "Participe à 10 duels dans « Tu préfères ? ».", icon: "⚔️", criteria_type: "duels_played", criteria_threshold: 10 },
  { id: "b5", slug: "grand-strategiste", name: "Grand stratège", description: "Participe à 50 duels.", icon: "🏅", criteria_type: "duels_played", criteria_threshold: 50 },
  { id: "b6", slug: "quiz-master", name: "Quiz Master", description: "Termine 5 quiz.", icon: "🎯", criteria_type: "quizzes_completed", criteria_threshold: 5 },
  { id: "b7", slug: "collectionneur", name: "Collectionneur", description: "Ajoute 10 films à tes favoris.", icon: "❤️", criteria_type: "favorites_added", criteria_threshold: 10 },
  { id: "b8", slug: "cinephile-confirme", name: "Cinéphile confirmé", description: "Atteins le niveau 5.", icon: "⭐", criteria_type: "level_reached", criteria_threshold: 5 },
  { id: "b9", slug: "maitre-du-cinema", name: "Maître du cinéma", description: "Atteins le niveau 10.", icon: "👑", criteria_type: "level_reached", criteria_threshold: 10 },
];
