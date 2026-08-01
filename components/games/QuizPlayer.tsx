"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isMockMode } from "@/lib/config";
import { checkMockAnswer } from "@/lib/mock/games-data";
import { awardMockEvent } from "@/lib/mock/progression-storage";
import ProgressToast from "@/components/progression/ProgressToast";
import type { Badge } from "@/types/progression";
import type { QuizWithQuestions } from "@/types/games";

type AnswerState = "unanswered" | "correct" | "incorrect";

export default function QuizPlayer({ quiz, isAuthenticated }: { quiz: QuizWithQuestions; isAuthenticated: boolean }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<AnswerState>("unanswered");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  const question = quiz.questions[index];
  const total = quiz.questions.length;

  async function ensureAttempt() {
    if (isMockMode) return null;
    if (!isAuthenticated) {
      router.push("/login");
      return null;
    }
    if (attemptId) return attemptId;

    setStarting(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return null;
    }
    const { data, error } = await supabase
      .from("quiz_attempts")
      .insert({ user_id: userData.user.id, quiz_id: quiz.id, total_questions: total })
      .select("id")
      .single();
    setStarting(false);
    if (error || !data) return null;
    setAttemptId(data.id);
    return data.id;
  }

  async function answer(answerId: string) {
    if (state !== "unanswered") return;
    setSelected(answerId);

    let isCorrect: boolean;

    if (isMockMode) {
      isCorrect = checkMockAnswer(question.id, answerId);
    } else {
      const id = await ensureAttempt();
      if (!id) return;
      const supabase = createClient();
      const { data, error } = await supabase.rpc("submit_quiz_answer", {
        p_attempt_id: id,
        p_question_id: question.id,
        p_answer_id: answerId,
      });
      isCorrect = !error && !!data;
    }

    setState(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore((s) => s + question.points);
  }

  async function next() {
    if (index + 1 >= total) {
      if (isMockMode) {
        const { newBadges } = awardMockEvent("quiz", score);
        setNewBadges(newBadges);
      } else if (attemptId) {
        const supabase = createClient();
        await supabase.from("quiz_attempts").update({ completed_at: new Date().toISOString() }).eq("id", attemptId);
      }
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setState("unanswered");
  }

  if (finished) {
    return (
      <div className="text-center">
        <p className="chip mx-auto mb-4 w-fit">Terminé</p>
        <h1 className="font-display text-4xl tracking-poster text-ink">{quiz.title}</h1>
        <p className="mt-6 font-display text-6xl text-corail">{score} pts</p>
        <p className="mt-2 text-ink-muted">sur {quiz.questions.reduce((n, q) => n + q.points, 0)} points possibles</p>
        <div className="flex justify-center">
          <ProgressToast xpGained={isMockMode ? score : null} newBadges={newBadges} />
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/games/quiz" className="rounded-full border border-rail px-5 py-2 text-sm hover:border-corail hover:text-corail">
            Autres quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="chip">{quiz.title}</p>
        <p className="font-mono text-xs text-ink-muted">
          Question {index + 1} / {total}
        </p>
      </div>

      {isMockMode && (
        <p className="mb-6 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold">
          Mode démo : ton score n'est pas sauvegardé.
        </p>
      )}

      <h2 className="font-display text-2xl leading-snug tracking-poster text-ink">{question.question_text}</h2>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.answers.map((a) => {
          const isSelected = selected === a.id;
          const showResult = state !== "unanswered";
          const isRight = showResult && isSelected && state === "correct";
          const isWrong = showResult && isSelected && state === "incorrect";

          return (
            <button
              key={a.id}
              onClick={() => answer(a.id)}
              disabled={state !== "unanswered" || starting}
              className={`rounded-lg border p-4 text-left transition-colors ${
                isRight
                  ? "border-corail bg-corail/10 text-corail"
                  : isWrong
                  ? "border-rail bg-elevated text-ink-faint line-through"
                  : "border-rail text-ink hover:border-corail hover:text-corail"
              }`}
            >
              {a.answer_text}
            </button>
          );
        })}
      </div>

      {state !== "unanswered" && (
        <button
          onClick={next}
          className="mt-8 rounded-full bg-corail px-6 py-2.5 font-medium text-void hover:bg-corail-soft"
        >
          {index + 1 >= total ? "Voir le score" : "Question suivante"} →
        </button>
      )}
    </div>
  );
}
