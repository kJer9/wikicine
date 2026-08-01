"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isMockMode } from "@/lib/config";
import { awardMockEvent } from "@/lib/mock/progression-storage";
import ProgressToast from "@/components/progression/ProgressToast";
import type { Badge } from "@/types/progression";
import type { Lesson } from "@/types/academy";

interface Props {
  course: { slug: string; title: string };
  lesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  isAuthenticated: boolean;
}

export default function LessonReader({ course, lesson, prevLesson, nextLesson, isAuthenticated }: Props) {
  const [checkAnswer, setCheckAnswer] = useState<number | null>(null);
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [xpGained, setXpGained] = useState<number | null>(null);

  const readyToComplete = !lesson.check || checkAnswer !== null;

  async function markComplete() {
    if (marked || !readyToComplete) return;
    setMarking(true);

    if (isMockMode) {
      const { newBadges } = awardMockEvent("lesson", lesson.xp_reward);
      setXpGained(lesson.xp_reward);
      setNewBadges(newBadges);
    } else if (isAuthenticated) {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase
          .from("user_lesson_progress")
          .upsert({ user_id: userData.user.id, lesson_id: lesson.id }, { onConflict: "user_id,lesson_id" });
      }
    }

    setMarked(true);
    setMarking(false);
  }

  return (
    <div>
      <Link href={`/academy/course/${course.slug}`} className="mb-6 inline-block text-sm text-ink-muted hover:text-corail">
        ← {course.title}
      </Link>

      {isMockMode && (
        <p className="mb-6 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold">
          Mode démo : ta progression n'est pas sauvegardée.
        </p>
      )}

      <p className="chip mb-4 w-fit">{lesson.duration_minutes} min de lecture</p>
      <h1 className="font-display text-4xl leading-tight tracking-poster text-ink">{lesson.title}</h1>

      <div className="prose prose-invert mt-8 max-w-none leading-relaxed text-ink">
        {lesson.content.split("\n\n").map((para, i) => (
          <p key={i} className="mb-5 whitespace-pre-line">{para}</p>
        ))}
      </div>

      {lesson.check && (
        <div className="mt-10 rounded-lg border border-rail bg-surface p-6">
          <p className="mb-4 font-display text-xl tracking-poster text-ink">Vérifie ta compréhension</p>
          <p className="mb-4 text-ink">{lesson.check.question_text}</p>
          <div className="space-y-2">
            {lesson.check.options.map((opt, i) => {
              const isSelected = checkAnswer === i;
              const showResult = checkAnswer !== null;
              const isRight = showResult && i === lesson.check!.correct_index;
              const isWrongSelected = showResult && isSelected && i !== lesson.check!.correct_index;

              return (
                <button
                  key={i}
                  onClick={() => checkAnswer === null && setCheckAnswer(i)}
                  disabled={checkAnswer !== null}
                  className={`block w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                    isRight
                      ? "border-corail bg-corail/10 text-corail"
                      : isWrongSelected
                      ? "border-rail bg-elevated text-ink-faint line-through"
                      : "border-rail text-ink hover:border-corail"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        {prevLesson ? (
          <Link href={`/academy/course/${course.slug}/${prevLesson.slug}`} className="text-sm text-ink-muted hover:text-corail">
            ← Leçon précédente
          </Link>
        ) : (
          <span />
        )}

        {!marked ? (
          <button
            onClick={markComplete}
            disabled={!readyToComplete || marking}
            className="rounded-full bg-corail px-6 py-2.5 font-medium text-void hover:bg-corail-soft disabled:opacity-40"
          >
            Marquer comme terminée (+{lesson.xp_reward} XP)
          </button>
        ) : nextLesson ? (
          <Link
            href={`/academy/course/${course.slug}/${nextLesson.slug}`}
            className="rounded-full bg-corail px-6 py-2.5 font-medium text-void hover:bg-corail-soft"
          >
            Leçon suivante →
          </Link>
        ) : (
          <Link
            href={`/academy/course/${course.slug}`}
            className="rounded-full bg-corail px-6 py-2.5 font-medium text-void hover:bg-corail-soft"
          >
            Cours terminé ✓
          </Link>
        )}
      </div>

      <div className="flex justify-end">
        <ProgressToast xpGained={xpGained} newBadges={newBadges} />
      </div>
    </div>
  );
}
