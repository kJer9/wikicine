"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteFilmButton({ filmId }: { filmId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    await supabase.from("films").delete().eq("id", filmId);
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <button onClick={handleDelete} className="text-corail hover:underline">Confirmer</button>
        <button onClick={() => setConfirming(false)} className="text-ink-muted hover:underline">Annuler</button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-ink-muted hover:text-corail">
      Supprimer
    </button>
  );
}
