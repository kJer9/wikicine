/**
 * Script de seed — peuple Supabase avec des données de démonstration
 * (genres, mouvements, personnes, films, articles).
 *
 * Usage :
 *   1. Renseigner SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local
 *      (la clé service_role, PAS la clé anon — elle seule contourne la RLS)
 *   2. npm run seed
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "❌ Variables manquantes. Renseigne NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("🌱 Seed WikiCiné — démarrage...");

  // --- Genres ---
  const genres = ["Drame", "Science-fiction", "Thriller", "Comédie", "Horreur", "Animation"];
  const { data: genreRows, error: genreErr } = await supabase
    .from("genres")
    .upsert(
      genres.map((name) => ({ name, slug: slugify(name) })),
      { onConflict: "slug" }
    )
    .select();
  if (genreErr) throw genreErr;
  console.log(`✔ ${genreRows?.length} genres`);

  // --- Mouvement cinématographique ---
  const { data: movement, error: movementErr } = await supabase
    .from("movements")
    .upsert(
      [
        {
          slug: "nouvelle-vague",
          name: "Nouvelle Vague",
          period: "1958–1968",
          description:
            "Mouvement français porté par d'anciens critiques des Cahiers du cinéma, marqué par le tournage en décors réels, le montage libre et une caméra portée.",
        },
      ],
      { onConflict: "slug" }
    )
    .select()
    .single();
  if (movementErr) throw movementErr;
  console.log(`✔ mouvement: ${movement?.name}`);

  // --- Personnes ---
  const people = [
    {
      slug: "jean-luc-godard",
      full_name: "Jean-Luc Godard",
      biography:
        "Réalisateur franco-suisse, figure centrale de la Nouvelle Vague, connu pour son montage discontinu et son goût pour la rupture avec les codes classiques.",
      birth_date: "1930-12-03",
      death_date: "2022-09-13",
      birth_place: "Paris, France",
    },
    {
      slug: "jean-seberg",
      full_name: "Jean Seberg",
      biography:
        "Actrice américaine révélée par la Nouvelle Vague française, notamment dans À bout de souffle.",
      birth_date: "1938-11-13",
      death_date: "1979-08-30",
      birth_place: "Marshalltown, Iowa, États-Unis",
    },
    {
      slug: "denis-villeneuve",
      full_name: "Denis Villeneuve",
      biography:
        "Réalisateur québécois reconnu pour ses films d'auteur à grande échelle mêlant science-fiction et intimité, tels que Blade Runner 2049 et Dune.",
      birth_date: "1967-10-03",
      birth_place: "Bécancour, Québec, Canada",
    },
  ];
  const { data: peopleRows, error: peopleErr } = await supabase
    .from("people")
    .upsert(people, { onConflict: "slug" })
    .select();
  if (peopleErr) throw peopleErr;
  console.log(`✔ ${peopleRows?.length} personnes`);

  const godard = peopleRows!.find((p) => p.slug === "jean-luc-godard")!;
  const seberg = peopleRows!.find((p) => p.slug === "jean-seberg")!;
  const villeneuve = peopleRows!.find((p) => p.slug === "denis-villeneuve")!;

  const drame = genreRows!.find((g) => g.slug === "drame")!;
  const scifi = genreRows!.find((g) => g.slug === "science-fiction")!;

  // --- Films ---
  const { data: films, error: filmErr } = await supabase
    .from("films")
    .upsert(
      [
        {
          slug: "a-bout-de-souffle",
          title: "À bout de souffle",
          original_title: "À bout de souffle",
          release_year: 1960,
          synopsis:
            "Un petit malfrat cavale dans Paris après avoir tué un policier, entre romance avec une jeune Américaine et fuite inéluctable.",
          runtime_minutes: 90,
          country: "France",
          countries: ["France"],
          language: "Français",
          movement_id: movement!.id,
        },
        {
          slug: "dune",
          title: "Dune",
          original_title: "Dune",
          release_year: 2021,
          synopsis:
            "Sur la planète désertique Arrakis, le jeune Paul Atréides doit protéger sa famille et affronter son destin dans un monde de pouvoir et de sable.",
          runtime_minutes: 155,
          country: "États-Unis",
          countries: ["États-Unis", "Canada"],
          language: "Anglais",
        },
      ],
      { onConflict: "slug" }
    )
    .select();
  if (filmErr) throw filmErr;
  console.log(`✔ ${films?.length} films`);

  const abds = films!.find((f) => f.slug === "a-bout-de-souffle")!;
  const dune = films!.find((f) => f.slug === "dune")!;

  await supabase.from("film_genres").upsert([
    { film_id: abds.id, genre_id: drame.id },
    { film_id: dune.id, genre_id: scifi.id },
  ]);

  await supabase.from("film_credits").upsert([
    { film_id: abds.id, person_id: godard.id, role: "director" },
    { film_id: abds.id, person_id: seberg.id, role: "actor", character_name: "Patricia Franchini" },
    { film_id: dune.id, person_id: villeneuve.id, role: "director" },
  ]);

  // --- Catégorie d'article + article de démo ---
  const { data: category } = await supabase
    .from("article_categories")
    .upsert([{ slug: "analyse", name: "Analyse" }], { onConflict: "slug" })
    .select()
    .single();

  await supabase.from("articles").upsert(
    [
      {
        slug: "la-rupture-godardienne",
        title: "La rupture godardienne : le montage comme manifeste",
        excerpt:
          "Comment À bout de souffle a redéfini les règles du montage cinématographique.",
        content:
          "# La rupture godardienne\n\nEn 1960, Jean-Luc Godard bouleverse la grammaire du cinéma classique avec des jump cuts assumés...",
        category_id: category?.id,
        related_film_id: abds.id,
        status: "published",
        published_at: new Date().toISOString(),
      },
    ],
    { onConflict: "slug" }
  );

  console.log("✅ Seed terminé avec succès.");
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

main().catch((err) => {
  console.error("❌ Erreur de seed:", err);
  process.exit(1);
});
