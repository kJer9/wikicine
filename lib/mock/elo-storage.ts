// En mode démo (sans Supabase), on persiste les notes ELO du visiteur dans
// le localStorage du navigateur — ce n'est pas un vrai compte, mais ça permet
// de voir un classement qui évolue vraiment d'une partie à l'autre.

const PREFIX = "wikicine_demo_elo_";

export function loadMockRatings(type: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PREFIX + type);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveMockRatings(type: string, ratings: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + type, JSON.stringify(ratings));
  } catch {
    // stockage indisponible (navigation privée, quota…) : on ignore silencieusement
  }
}
