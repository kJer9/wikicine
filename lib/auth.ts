import { isMockMode } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

/** Renvoie l'utilisateur connecté, ou `null` sans jamais appeler Supabase en mode démo. */
export async function getCurrentUser() {
  if (isMockMode) return null;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Renvoie le profil (avec rôle) de l'utilisateur connecté, ou `null`. */
export async function getCurrentProfile() {
  if (isMockMode) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();
  return data;
}
