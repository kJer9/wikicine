/** xp_for_level(n) — miroir exact de la fonction SQL du même nom dans
 * supabase/schema_progression.sql. À garder synchronisé. */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number): number {
  let lvl = 1;
  while (xpForLevel(lvl + 1) <= xp) lvl++;
  return lvl;
}

export interface XpProgress {
  xp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export function getXpProgress(xp: number): XpProgress {
  const level = levelFromXp(xp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const span = nextLevelXp - currentLevelXp;
  const progressPercent = span > 0 ? Math.round(((xp - currentLevelXp) / span) * 100) : 100;
  return { xp, level, currentLevelXp, nextLevelXp, progressPercent };
}
