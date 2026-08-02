/**
 * Script de seed — peuple Supabase avec le même catalogue de démonstration
 * que le mode démo (24 films, personnes, genres, mouvement, articles).
 *
 * Usage :
 *   1. Renseigner SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local
 *      (la clé service_role, PAS la clé anon — elle seule contourne la RLS)
 *   2. npm run seed
 *
 * Les affiches/photos sont volontairement laissées vides (poster_url: null) —
 * ajoute tes propres images ensuite via Supabase Storage + /admin/films.
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

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------
// Données (mêmes que lib/mock/data.ts, sans les images)
// ---------------------------------------------------------
const GENRES = ["Drame", "Science-fiction", "Thriller", "Comédie", "Animation", "Aventure", "Fantastique", "Action"];

const PEOPLE: { slug: string; full_name: string; bio?: string }[] = [
  { slug: "jean-luc-godard", full_name: "Jean-Luc Godard", bio: "Réalisateur franco-suisse, figure centrale de la Nouvelle Vague." },
  { slug: "jean-seberg", full_name: "Jean Seberg", bio: "Actrice américaine révélée par la Nouvelle Vague française." },
  { slug: "denis-villeneuve", full_name: "Denis Villeneuve", bio: "Réalisateur québécois mêlant science-fiction et intimité." },
  { slug: "timothee-chalamet", full_name: "Timothée Chalamet", bio: "Acteur américano-français." },
  { slug: "hayao-miyazaki", full_name: "Hayao Miyazaki", bio: "Réalisateur et cofondateur du studio Ghibli." },
  { slug: "quentin-tarantino", full_name: "Quentin Tarantino" },
  { slug: "john-travolta", full_name: "John Travolta" },
  { slug: "uma-thurman", full_name: "Uma Thurman" },
  { slug: "francis-ford-coppola", full_name: "Francis Ford Coppola" },
  { slug: "marlon-brando", full_name: "Marlon Brando" },
  { slug: "al-pacino", full_name: "Al Pacino" },
  { slug: "christopher-nolan", full_name: "Christopher Nolan" },
  { slug: "leonardo-dicaprio", full_name: "Leonardo DiCaprio" },
  { slug: "marion-cotillard", full_name: "Marion Cotillard" },
  { slug: "david-fincher", full_name: "David Fincher" },
  { slug: "brad-pitt", full_name: "Brad Pitt" },
  { slug: "edward-norton", full_name: "Edward Norton" },
  { slug: "robert-zemeckis", full_name: "Robert Zemeckis" },
  { slug: "tom-hanks", full_name: "Tom Hanks" },
  { slug: "steven-spielberg", full_name: "Steven Spielberg" },
  { slug: "sam-neill", full_name: "Sam Neill" },
  { slug: "james-cameron", full_name: "James Cameron" },
  { slug: "kate-winslet", full_name: "Kate Winslet" },
  { slug: "peter-jackson", full_name: "Peter Jackson" },
  { slug: "elijah-wood", full_name: "Elijah Wood" },
  { slug: "lana-wachowski", full_name: "Lana Wachowski" },
  { slug: "keanu-reeves", full_name: "Keanu Reeves" },
  { slug: "george-lucas", full_name: "George Lucas" },
  { slug: "mark-hamill", full_name: "Mark Hamill" },
  { slug: "harrison-ford", full_name: "Harrison Ford" },
  { slug: "michael-curtiz", full_name: "Michael Curtiz" },
  { slug: "humphrey-bogart", full_name: "Humphrey Bogart" },
  { slug: "ingrid-bergman", full_name: "Ingrid Bergman" },
  { slug: "alfred-hitchcock", full_name: "Alfred Hitchcock" },
  { slug: "anthony-perkins", full_name: "Anthony Perkins" },
  { slug: "martin-scorsese", full_name: "Martin Scorsese" },
  { slug: "robert-de-niro", full_name: "Robert De Niro" },
  { slug: "jean-pierre-jeunet", full_name: "Jean-Pierre Jeunet" },
  { slug: "audrey-tautou", full_name: "Audrey Tautou" },
  { slug: "bong-joon-ho", full_name: "Bong Joon-ho" },
  { slug: "song-kang-ho", full_name: "Song Kang-ho" },
  { slug: "matthew-mcconaughey", full_name: "Matthew McConaughey" },
  { slug: "damien-chazelle", full_name: "Damien Chazelle" },
  { slug: "ryan-gosling", full_name: "Ryan Gosling" },
  { slug: "emma-stone", full_name: "Emma Stone" },
  { slug: "todd-phillips", full_name: "Todd Phillips" },
  { slug: "joaquin-phoenix", full_name: "Joaquin Phoenix" },
  { slug: "roger-allers", full_name: "Roger Allers" },
  { slug: "ridley-scott", full_name: "Ridley Scott" },
  { slug: "russell-crowe", full_name: "Russell Crowe" },
];

const FILMS: {
  slug: string; title: string; original_title?: string; year: number; synopsis: string;
  runtime: number; country: string; language: string; movement?: string;
  director: string; actors?: { slug: string; character: string }[]; genres: string[];
}[] = [
  { slug: "a-bout-de-souffle", title: "À bout de souffle", year: 1960, synopsis: "Un petit malfrat cavale dans Paris après avoir tué un policier, entre romance avec une jeune Américaine et fuite inéluctable.", runtime: 90, country: "France", language: "Français", movement: "nouvelle-vague", director: "jean-luc-godard", actors: [{ slug: "jean-seberg", character: "Patricia Franchini" }], genres: ["Drame"] },
  { slug: "dune", title: "Dune", year: 2021, synopsis: "Sur la planète désertique Arrakis, le jeune Paul Atréides doit protéger sa famille et affronter son destin dans un monde de pouvoir et de sable.", runtime: 155, country: "États-Unis", language: "Anglais", director: "denis-villeneuve", actors: [{ slug: "timothee-chalamet", character: "Paul Atréides" }], genres: ["Science-fiction", "Drame"] },
  { slug: "le-voyage-de-chihiro", title: "Le Voyage de Chihiro", original_title: "千と千尋の神隠し", year: 2001, synopsis: "Une fillette de dix ans pénètre dans le monde des esprits où ses parents sont transformés en cochons.", runtime: 125, country: "Japon", language: "Japonais", director: "hayao-miyazaki", genres: ["Animation", "Drame"] },
  { slug: "blade-runner-2049", title: "Blade Runner 2049", year: 2017, synopsis: "Un jeune blade runner découvre un secret longtemps enfoui qui pourrait plonger ce qu'il reste de la société dans le chaos.", runtime: 164, country: "États-Unis", language: "Anglais", director: "denis-villeneuve", genres: ["Science-fiction", "Thriller"] },
  { slug: "pulp-fiction", title: "Pulp Fiction", year: 1994, synopsis: "Les destins de plusieurs criminels de Los Angeles s'entrecroisent, entre un contrat à exécuter, une mallette mystérieuse et un couple de braqueurs de restaurant.", runtime: 154, country: "États-Unis", language: "Anglais", director: "quentin-tarantino", actors: [{ slug: "john-travolta", character: "Vincent Vega" }, { slug: "uma-thurman", character: "Mia Wallace" }], genres: ["Thriller", "Comédie"] },
  { slug: "le-parrain", title: "Le Parrain", original_title: "The Godfather", year: 1972, synopsis: "Le patriarche vieillissant d'une famille de la mafia new-yorkaise transmet le contrôle de son empire clandestin à son fils réticent.", runtime: 175, country: "États-Unis", language: "Anglais", director: "francis-ford-coppola", actors: [{ slug: "marlon-brando", character: "Vito Corleone" }, { slug: "al-pacino", character: "Michael Corleone" }], genres: ["Drame", "Thriller"] },
  { slug: "inception", title: "Inception", year: 2010, synopsis: "Un voleur capable de s'introduire dans les rêves des autres se voit confier une mission inverse : implanter une idée plutôt que la dérober.", runtime: 148, country: "États-Unis", language: "Anglais", director: "christopher-nolan", actors: [{ slug: "leonardo-dicaprio", character: "Dom Cobb" }, { slug: "marion-cotillard", character: "Mal" }], genres: ["Science-fiction", "Thriller"] },
  { slug: "fight-club", title: "Fight Club", year: 1999, synopsis: "Un employé de bureau insomniaque et un vendeur de savon charismatique fondent un club de combat clandestin qui échappe bientôt à tout contrôle.", runtime: 139, country: "États-Unis", language: "Anglais", director: "david-fincher", actors: [{ slug: "brad-pitt", character: "Tyler Durden" }, { slug: "edward-norton", character: "Le narrateur" }], genres: ["Drame", "Thriller"] },
  { slug: "forrest-gump", title: "Forrest Gump", year: 1994, synopsis: "Un homme au destin extraordinaire traverse malgré lui plusieurs décennies de l'histoire américaine, porté par sa loyauté et sa candeur.", runtime: 142, country: "États-Unis", language: "Anglais", director: "robert-zemeckis", actors: [{ slug: "tom-hanks", character: "Forrest Gump" }], genres: ["Drame", "Comédie"] },
  { slug: "jurassic-park", title: "Jurassic Park", year: 1993, synopsis: "Un parc d'attractions peuplé de dinosaures ressuscités par ingénierie génétique tourne au cauchemar lorsque les systèmes de sécurité tombent en panne.", runtime: 127, country: "États-Unis", language: "Anglais", director: "steven-spielberg", actors: [{ slug: "sam-neill", character: "Dr. Alan Grant" }], genres: ["Science-fiction", "Aventure"] },
  { slug: "titanic", title: "Titanic", year: 1997, synopsis: "À bord du paquebot réputé insubmersible, une idylle naît entre deux passagers que tout sépare, la nuit où le navire heurte un iceberg.", runtime: 195, country: "États-Unis", language: "Anglais", director: "james-cameron", actors: [{ slug: "leonardo-dicaprio", character: "Jack Dawson" }, { slug: "kate-winslet", character: "Rose DeWitt Bukater" }], genres: ["Drame", "Aventure"] },
  { slug: "le-seigneur-des-anneaux-la-communaute-de-lanneau", title: "Le Seigneur des Anneaux : La Communauté de l'Anneau", year: 2001, synopsis: "Un jeune hobbit hérite d'un anneau doté d'un pouvoir immense et doit le détruire avant qu'il ne tombe entre de mauvaises mains.", runtime: 178, country: "États-Unis", language: "Anglais", director: "peter-jackson", actors: [{ slug: "elijah-wood", character: "Frodo Sacquet" }], genres: ["Aventure", "Fantastique"] },
  { slug: "matrix", title: "Matrix", year: 1999, synopsis: "Un programmeur découvre que la réalité qu'il connaît est une simulation informatique, et qu'une résistance clandestine l'attend pour la combattre.", runtime: 136, country: "États-Unis", language: "Anglais", director: "lana-wachowski", actors: [{ slug: "keanu-reeves", character: "Neo" }], genres: ["Science-fiction", "Action"] },
  { slug: "star-wars-un-nouvel-espoir", title: "Star Wars : Un nouvel espoir", year: 1977, synopsis: "Un jeune fermier d'une planète désertique rejoint la lutte contre un empire galactique tout-puissant après avoir découvert un message secret.", runtime: 121, country: "États-Unis", language: "Anglais", director: "george-lucas", actors: [{ slug: "mark-hamill", character: "Luke Skywalker" }, { slug: "harrison-ford", character: "Han Solo" }], genres: ["Science-fiction", "Aventure"] },
  { slug: "casablanca", title: "Casablanca", year: 1942, synopsis: "Dans le Maroc occupé de la Seconde Guerre mondiale, un tenancier de bar désabusé retrouve son amour perdu, contraint de choisir entre passion et devoir.", runtime: 102, country: "États-Unis", language: "Anglais", director: "michael-curtiz", actors: [{ slug: "humphrey-bogart", character: "Rick Blaine" }, { slug: "ingrid-bergman", character: "Ilsa Lund" }], genres: ["Drame"] },
  { slug: "psychose", title: "Psychose", original_title: "Psycho", year: 1960, synopsis: "Une jeune femme en fuite fait halte dans un motel isolé tenu par un jeune homme sous l'emprise étouffante de sa mère.", runtime: 109, country: "États-Unis", language: "Anglais", director: "alfred-hitchcock", actors: [{ slug: "anthony-perkins", character: "Norman Bates" }], genres: ["Thriller"] },
  { slug: "taxi-driver", title: "Taxi Driver", year: 1976, synopsis: "Un chauffeur de taxi solitaire, rongé par l'insomnie et le dégoût de la ville, sombre peu à peu dans une spirale de violence.", runtime: 114, country: "États-Unis", language: "Anglais", director: "martin-scorsese", actors: [{ slug: "robert-de-niro", character: "Travis Bickle" }], genres: ["Drame", "Thriller"] },
  { slug: "le-fabuleux-destin-damelie-poulain", title: "Le Fabuleux Destin d'Amélie Poulain", year: 2001, synopsis: "Une jeune serveuse parisienne au tempérament rêveur se met en tête d'améliorer discrètement la vie de ceux qui l'entourent.", runtime: 122, country: "France", language: "Français", director: "jean-pierre-jeunet", actors: [{ slug: "audrey-tautou", character: "Amélie Poulain" }], genres: ["Comédie", "Drame"] },
  { slug: "parasite", title: "Parasite", year: 2019, synopsis: "Une famille désargentée s'infiltre peu à peu, poste après poste, dans le foyer d'une famille aisée, jusqu'à ce que l'équilibre bascule.", runtime: 132, country: "Corée du Sud", language: "Coréen", director: "bong-joon-ho", actors: [{ slug: "song-kang-ho", character: "Kim Ki-taek" }], genres: ["Thriller", "Drame"] },
  { slug: "interstellar", title: "Interstellar", year: 2014, synopsis: "Face à une Terre devenue inhabitable, un groupe d'explorateurs franchit un trou de ver à la recherche d'un nouveau foyer pour l'humanité.", runtime: 169, country: "États-Unis", language: "Anglais", director: "christopher-nolan", actors: [{ slug: "matthew-mcconaughey", character: "Cooper" }], genres: ["Science-fiction", "Drame"] },
  { slug: "la-la-land", title: "La La Land", year: 2016, synopsis: "Une actrice en devenir et un pianiste de jazz idéaliste voient leur histoire d'amour se heurter à l'ambition de leurs rêves respectifs.", runtime: 128, country: "États-Unis", language: "Anglais", director: "damien-chazelle", actors: [{ slug: "ryan-gosling", character: "Sebastian" }, { slug: "emma-stone", character: "Mia" }], genres: ["Comédie", "Drame"] },
  { slug: "joker", title: "Joker", year: 2019, synopsis: "Un humoriste raté et marginalisé, à la santé mentale fragile, bascule peu à peu dans la violence au sein d'une ville rongée par les inégalités.", runtime: 122, country: "États-Unis", language: "Anglais", director: "todd-phillips", actors: [{ slug: "joaquin-phoenix", character: "Arthur Fleck" }], genres: ["Drame", "Thriller"] },
  { slug: "le-roi-lion", title: "Le Roi Lion", original_title: "The Lion King", year: 1994, synopsis: "Un jeune lionceau destiné à régner sur la savane doit fuir après un drame familial, avant d'apprendre à assumer son héritage.", runtime: 88, country: "États-Unis", language: "Anglais", director: "roger-allers", genres: ["Animation", "Aventure"] },
  { slug: "gladiator", title: "Gladiator", year: 2000, synopsis: "Un général romain trahi et réduit en esclavage gravit les rangs des gladiateurs pour venger sa famille assassinée.", runtime: 155, country: "États-Unis", language: "Anglais", director: "ridley-scott", actors: [{ slug: "russell-crowe", character: "Maximus" }], genres: ["Drame", "Aventure"] },
];

async function main() {
  console.log("🌱 Seed WikiCiné — démarrage...");

  // --- Genres ---
  const { data: genreRows, error: genreErr } = await supabase
    .from("genres")
    .upsert(GENRES.map((name) => ({ name, slug: slugify(name) })), { onConflict: "slug" })
    .select();
  if (genreErr) throw genreErr;
  console.log(`✔ ${genreRows?.length} genres`);
  const genreBySlug = new Map(genreRows!.map((g) => [g.slug, g]));

  // --- Mouvement ---
  const { data: movement, error: movementErr } = await supabase
    .from("movements")
    .upsert(
      [{ slug: "nouvelle-vague", name: "Nouvelle Vague", period: "1958–1968", description: "Mouvement français porté par d'anciens critiques des Cahiers du cinéma." }],
      { onConflict: "slug" }
    )
    .select()
    .single();
  if (movementErr) throw movementErr;
  console.log(`✔ mouvement: ${movement?.name}`);

  // --- Personnes ---
  const { data: peopleRows, error: peopleErr } = await supabase
    .from("people")
    .upsert(
      PEOPLE.map((p) => ({ slug: p.slug, full_name: p.full_name, biography: p.bio ?? null })),
      { onConflict: "slug" }
    )
    .select();
  if (peopleErr) throw peopleErr;
  console.log(`✔ ${peopleRows?.length} personnes`);
  const personBySlug = new Map(peopleRows!.map((p) => [p.slug, p]));

  // --- Films ---
  const { data: filmRows, error: filmErr } = await supabase
    .from("films")
    .upsert(
      FILMS.map((f) => ({
        slug: f.slug,
        title: f.title,
        original_title: f.original_title ?? null,
        release_year: f.year,
        synopsis: f.synopsis,
        runtime_minutes: f.runtime,
        country: f.country,
        countries: [f.country],
        language: f.language,
        movement_id: f.movement ? movement!.id : null,
      })),
      { onConflict: "slug" }
    )
    .select();
  if (filmErr) throw filmErr;
  console.log(`✔ ${filmRows?.length} films`);
  const filmBySlug = new Map(filmRows!.map((f) => [f.slug, f]));

  // --- Genres <-> Films ---
  const filmGenres = FILMS.flatMap((f) =>
    f.genres.map((gName) => ({
      film_id: filmBySlug.get(f.slug)!.id,
      genre_id: genreBySlug.get(slugify(gName))!.id,
    }))
  );
  await supabase.from("film_genres").upsert(filmGenres);
  console.log(`✔ ${filmGenres.length} associations genre/film`);

  // --- Crédits (réalisateurs + acteurs) ---
  const credits: any[] = [];
  FILMS.forEach((f) => {
    const filmId = filmBySlug.get(f.slug)!.id;
    credits.push({ film_id: filmId, person_id: personBySlug.get(f.director)!.id, role: "director", billing_order: 0 });
    (f.actors ?? []).forEach((a, i) => {
      credits.push({
        film_id: filmId,
        person_id: personBySlug.get(a.slug)!.id,
        role: "actor",
        character_name: a.character,
        billing_order: i + 1,
      });
    });
  });
  await supabase.from("film_credits").upsert(credits);
  console.log(`✔ ${credits.length} crédits (réalisateurs + acteurs)`);

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
        excerpt: "Comment À bout de souffle a redéfini les règles du montage cinématographique.",
        content: "En 1960, Jean-Luc Godard bouleverse la grammaire du cinéma classique avec des jump cuts assumés...",
        category_id: category?.id,
        related_film_id: filmBySlug.get("a-bout-de-souffle")!.id,
        status: "published",
        published_at: new Date().toISOString(),
      },
    ],
    { onConflict: "slug" }
  );

  console.log("✅ Seed terminé avec succès. Ajoute maintenant tes affiches via Supabase Storage + /admin/films.");
}

main().catch((err) => {
  console.error("❌ Erreur de seed:", err);
  process.exit(1);
});
