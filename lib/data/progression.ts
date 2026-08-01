import { createClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/config";
import { mockBadges } from "@/lib/mock/progression-data";
import type { Badge } from "@/types/progression";

/** Tous les badges existants (débloqués ou non) — contenu de référence, public. */
export async function listBadges(): Promise<Badge[]> {
  if (isMockMode) return mockBadges;

  const supabase = createClient();
  const { data, error } = await supabase.from("badges").select("*").order("position");
  if (error) throw error;
  return data ?? [];
}
