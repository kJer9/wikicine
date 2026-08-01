const K = 32;

/** Calcule les nouvelles notes ELO après un duel. Miroir exact de la fonction
 * SQL `apply_duel_elo` dans supabase/schema_games.sql — à garder synchronisé. */
export function computeEloUpdate(ratingA: number, ratingB: number, aWins: boolean) {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));
  const scoreA = aWins ? 1 : 0;
  const scoreB = aWins ? 0 : 1;

  return {
    ratingA: Math.round((ratingA + K * (scoreA - expectedA)) * 100) / 100,
    ratingB: Math.round((ratingB + K * (scoreB - expectedB)) * 100) / 100,
  };
}
