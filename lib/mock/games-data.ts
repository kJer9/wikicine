import { mockFilms, getMockPeopleByRole } from "@/lib/mock/data";
import type { DuelSubject, DuelSubjectType } from "@/types/games";
import type { QuizWithQuestions } from "@/types/games";

// ---------------------------------------------------------
// DUEL ELO — les sujets disponibles par catégorie, dérivés dynamiquement
// du catalogue de démo (tous les films, tous les réalisateurs/acteurs crédités).
// ---------------------------------------------------------
export function getMockDuelSubjects(type: DuelSubjectType): DuelSubject[] {
  if (type === "film") {
    return mockFilms.map((f) => ({ id: f.id, type, name: f.title, image_url: f.poster_url, slug: f.slug }));
  }
  return getMockPeopleByRole(type).map((p) => ({
    id: p.id,
    type,
    name: p.full_name,
    image_url: p.photo_url,
    slug: p.slug,
  }));
}

// ---------------------------------------------------------
// QUIZ — un quiz de démo "Devine le film" basé sur les synopsis du catalogue
// ---------------------------------------------------------
export const mockQuizzes: QuizWithQuestions[] = [
  {
    id: "q1",
    slug: "devine-le-film-classiques",
    title: "Devine le film : classiques et incontournables",
    category: "deviner_film",
    description: "Reconnais le film à partir de son synopsis.",
    cover_url: null,
    questions: [
      {
        id: "q1-1",
        question_text:
          "Un petit malfrat cavale dans Paris après avoir tué un policier, entre romance avec une jeune Américaine et fuite inéluctable.",
        image_url: null,
        points: 10,
        answers: [
          { id: "a1", answer_text: "À bout de souffle" },
          { id: "a2", answer_text: "Dune" },
          { id: "a3", answer_text: "Blade Runner 2049" },
          { id: "a4", answer_text: "Le Voyage de Chihiro" },
        ],
      },
      {
        id: "q1-2",
        question_text:
          "Une fillette de dix ans pénètre dans le monde des esprits où ses parents sont transformés en cochons.",
        image_url: null,
        points: 10,
        answers: [
          { id: "b1", answer_text: "Dune" },
          { id: "b2", answer_text: "Le Voyage de Chihiro" },
          { id: "b3", answer_text: "À bout de souffle" },
          { id: "b4", answer_text: "Blade Runner 2049" },
        ],
      },
      {
        id: "q1-3",
        question_text:
          "Sur une planète désertique, un jeune héritier doit protéger sa famille et affronter son destin dans un monde de pouvoir et de sable.",
        image_url: null,
        points: 10,
        answers: [
          { id: "c1", answer_text: "Blade Runner 2049" },
          { id: "c2", answer_text: "Le Voyage de Chihiro" },
          { id: "c3", answer_text: "Dune" },
          { id: "c4", answer_text: "À bout de souffle" },
        ],
      },
      {
        id: "q1-4",
        question_text:
          "Un général romain trahi et réduit en esclavage gravit les rangs des gladiateurs pour venger sa famille assassinée.",
        image_url: null,
        points: 10,
        answers: [
          { id: "d1", answer_text: "Gladiator" },
          { id: "d2", answer_text: "Le Parrain" },
          { id: "d3", answer_text: "Taxi Driver" },
          { id: "d4", answer_text: "Casablanca" },
        ],
      },
      {
        id: "q1-5",
        question_text:
          "Un voleur capable de s'introduire dans les rêves des autres se voit confier une mission inverse : implanter une idée plutôt que la dérober.",
        image_url: null,
        points: 10,
        answers: [
          { id: "e1", answer_text: "Matrix" },
          { id: "e2", answer_text: "Interstellar" },
          { id: "e3", answer_text: "Inception" },
          { id: "e4", answer_text: "Fight Club" },
        ],
      },
    ],
  },
];

const correctAnswers: Record<string, string> = {
  "q1-1": "a1",
  "q1-2": "b2",
  "q1-3": "c3",
  "q1-4": "d1",
  "q1-5": "e3",
};

export function checkMockAnswer(questionId: string, answerId: string) {
  return correctAnswers[questionId] === answerId;
}
