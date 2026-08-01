// Mode démo : actif automatiquement tant que les variables d'environnement
// Supabase ne sont pas renseignées. Dès que .env.local contient une vraie
// URL/clé Supabase, ce flag passe à `false` et le site utilise la vraie base.
export const isMockMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
