import type { Film, FilmDetail, Genre, Movement, Person, Article, ArticleCategory } from "@/types/database";

// ---------------------------------------------------------------
// Toutes les données ci-dessous sont fictives ou basées sur des faits publics
// (titres, années, réalisateurs, acteurs) à titre d'exemple, uniquement pour
// prévisualiser l'interface avant de connecter une vraie base Supabase.
// Les synopsis sont rédigés spécifiquement pour ce projet (pas copiés).
// Les affiches/photos sont des placeholders génériques (pas de vraies images
// protégées) — à remplacer par tes propres visuels ou une vraie base.
// ---------------------------------------------------------------

function posterPlaceholder(title: string) {
  return `https://placehold.co/500x750/1B1F26/D9A857?text=${encodeURIComponent(title)}&font=roboto`;
}
function photoPlaceholder(name: string) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return `https://placehold.co/400x400/1B1F26/FF6B45?text=${encodeURIComponent(initials)}&font=roboto`;
}

export const mockGenres: Genre[] = [
  { id: "g1", slug: "drame", name: "Drame" },
  { id: "g2", slug: "science-fiction", name: "Science-fiction" },
  { id: "g3", slug: "thriller", name: "Thriller" },
  { id: "g4", slug: "comedie", name: "Comédie" },
  { id: "g5", slug: "animation", name: "Animation" },
  { id: "g6", slug: "aventure", name: "Aventure" },
  { id: "g7", slug: "fantastique", name: "Fantastique" },
  { id: "g8", slug: "action", name: "Action" },
];

export const mockMovements: Movement[] = [
  {
    id: "m1",
    slug: "nouvelle-vague",
    name: "Nouvelle Vague",
    period: "1958–1968",
    description:
      "Mouvement français porté par d'anciens critiques des Cahiers du cinéma, marqué par le tournage en décors réels et le montage libre.",
    cover_url: null,
  },
];

interface RawPerson {
  id: string;
  slug: string;
  full_name: string;
  bio?: string;
  birth_date?: string | null;
  death_date?: string | null;
  birth_place?: string | null;
}

const rawPeople: RawPerson[] = [
  { id: "p1", slug: "jean-luc-godard", full_name: "Jean-Luc Godard", bio: "Réalisateur franco-suisse, figure centrale de la Nouvelle Vague, connu pour son montage discontinu et son goût pour la rupture avec les codes classiques du cinéma narratif.", birth_date: "1930-12-03", death_date: "2022-09-13", birth_place: "Paris, France" },
  { id: "p2", slug: "jean-seberg", full_name: "Jean Seberg", bio: "Actrice américaine révélée par la Nouvelle Vague française.", birth_date: "1938-11-13", death_date: "1979-08-30", birth_place: "Marshalltown, Iowa, États-Unis" },
  { id: "p3", slug: "denis-villeneuve", full_name: "Denis Villeneuve", bio: "Réalisateur québécois reconnu pour ses films d'auteur à grande échelle mêlant science-fiction et intimité.", birth_date: "1967-10-03", birth_place: "Bécancour, Québec, Canada" },
  { id: "p4", slug: "timothee-chalamet", full_name: "Timothée Chalamet", bio: "Acteur américano-français révélé au grand public dans les années 2010.", birth_date: "1995-12-27", birth_place: "New York, États-Unis" },
  { id: "p5", slug: "hayao-miyazaki", full_name: "Hayao Miyazaki", bio: "Réalisateur et cofondateur du studio Ghibli, figure majeure de l'animation japonaise.", birth_date: "1941-01-05", birth_place: "Tokyo, Japon" },
  { id: "p6", slug: "quentin-tarantino", full_name: "Quentin Tarantino", bio: "Réalisateur et scénariste américain connu pour ses dialogues ciselés et ses structures narratives non linéaires." },
  { id: "p7", slug: "john-travolta", full_name: "John Travolta", bio: "Acteur américain révélé dans les années 1970, relancé par plusieurs rôles marquants dans les années 1990." },
  { id: "p8", slug: "uma-thurman", full_name: "Uma Thurman", bio: "Actrice américaine associée à plusieurs collaborations marquantes avec des réalisateurs d'auteur." },
  { id: "p9", slug: "francis-ford-coppola", full_name: "Francis Ford Coppola", bio: "Réalisateur américain, figure majeure du Nouvel Hollywood des années 1970." },
  { id: "p10", slug: "marlon-brando", full_name: "Marlon Brando", bio: "Acteur américain considéré comme l'un des plus influents de son époque." },
  { id: "p11", slug: "al-pacino", full_name: "Al Pacino", bio: "Acteur américain reconnu pour l'intensité de ses interprétations." },
  { id: "p12", slug: "christopher-nolan", full_name: "Christopher Nolan", bio: "Réalisateur britanno-américain connu pour ses récits complexes et son goût pour les effets pratiques." },
  { id: "p13", slug: "leonardo-dicaprio", full_name: "Leonardo DiCaprio", bio: "Acteur et producteur américain, l'un des plus reconnus de sa génération." },
  { id: "p14", slug: "marion-cotillard", full_name: "Marion Cotillard", bio: "Actrice française à la carrière internationale." },
  { id: "p15", slug: "david-fincher", full_name: "David Fincher", bio: "Réalisateur américain reconnu pour son style visuel maîtrisé et ses récits sombres." },
  { id: "p16", slug: "brad-pitt", full_name: "Brad Pitt", bio: "Acteur et producteur américain à la carrière prolifique." },
  { id: "p17", slug: "edward-norton", full_name: "Edward Norton", bio: "Acteur américain reconnu pour la précision de son jeu." },
  { id: "p18", slug: "robert-zemeckis", full_name: "Robert Zemeckis", bio: "Réalisateur américain connu pour son sens du spectacle populaire et son goût pour l'innovation technique." },
  { id: "p19", slug: "tom-hanks", full_name: "Tom Hanks", bio: "Acteur américain parmi les plus populaires de sa génération." },
  { id: "p20", slug: "steven-spielberg", full_name: "Steven Spielberg", bio: "Réalisateur et producteur américain, l'un des cinéastes les plus influents de l'histoire du cinéma populaire." },
  { id: "p21", slug: "sam-neill", full_name: "Sam Neill", bio: "Acteur néo-zélandais à la carrière internationale." },
  { id: "p22", slug: "james-cameron", full_name: "James Cameron", bio: "Réalisateur canadien connu pour ses productions à grand spectacle et ses innovations techniques." },
  { id: "p23", slug: "kate-winslet", full_name: "Kate Winslet", bio: "Actrice britannique à la carrière internationale saluée." },
  { id: "p24", slug: "peter-jackson", full_name: "Peter Jackson", bio: "Réalisateur néo-zélandais connu pour ses adaptations d'univers de fantasy à grande échelle." },
  { id: "p25", slug: "elijah-wood", full_name: "Elijah Wood", bio: "Acteur américain révélé enfant, puis dans des rôles marquants au début des années 2000." },
  { id: "p26", slug: "lana-wachowski", full_name: "Lana Wachowski", bio: "Réalisatrice américaine connue pour ses œuvres de science-fiction visuellement novatrices." },
  { id: "p27", slug: "keanu-reeves", full_name: "Keanu Reeves", bio: "Acteur canadien à la carrière marquée par plusieurs rôles iconiques de science-fiction et d'action." },
  { id: "p28", slug: "george-lucas", full_name: "George Lucas", bio: "Réalisateur et producteur américain, créateur de sagas de science-fiction populaires." },
  { id: "p29", slug: "mark-hamill", full_name: "Mark Hamill", bio: "Acteur américain associé à un rôle emblématique de space opera." },
  { id: "p30", slug: "harrison-ford", full_name: "Harrison Ford", bio: "Acteur américain associé à plusieurs franchises parmi les plus populaires du cinéma." },
  { id: "p31", slug: "michael-curtiz", full_name: "Michael Curtiz", bio: "Réalisateur d'origine hongroise, actif durant l'âge d'or hollywoodien." },
  { id: "p32", slug: "humphrey-bogart", full_name: "Humphrey Bogart", bio: "Acteur américain emblématique du cinéma classique hollywoodien." },
  { id: "p33", slug: "ingrid-bergman", full_name: "Ingrid Bergman", bio: "Actrice suédoise à la carrière hollywoodienne saluée." },
  { id: "p34", slug: "alfred-hitchcock", full_name: "Alfred Hitchcock", bio: "Réalisateur britannique surnommé le « maître du suspense »." },
  { id: "p35", slug: "anthony-perkins", full_name: "Anthony Perkins", bio: "Acteur américain marqué par un rôle devenu emblématique du cinéma d'horreur psychologique." },
  { id: "p36", slug: "martin-scorsese", full_name: "Martin Scorsese", bio: "Réalisateur américain, figure majeure du Nouvel Hollywood puis du cinéma d'auteur contemporain." },
  { id: "p37", slug: "robert-de-niro", full_name: "Robert De Niro", bio: "Acteur américain considéré comme l'un des plus influents de sa génération." },
  { id: "p38", slug: "jean-pierre-jeunet", full_name: "Jean-Pierre Jeunet", bio: "Réalisateur français au style visuel très reconnaissable." },
  { id: "p39", slug: "audrey-tautou", full_name: "Audrey Tautou", bio: "Actrice française révélée au grand public au début des années 2000." },
  { id: "p40", slug: "bong-joon-ho", full_name: "Bong Joon-ho", bio: "Réalisateur sud-coréen connu pour mêler critique sociale et genres populaires." },
  { id: "p41", slug: "song-kang-ho", full_name: "Song Kang-ho", bio: "Acteur sud-coréen, collaborateur régulier de plusieurs réalisateurs majeurs de son pays." },
  { id: "p42", slug: "matthew-mcconaughey", full_name: "Matthew McConaughey", bio: "Acteur américain à la carrière relancée par des rôles dramatiques marquants." },
  { id: "p43", slug: "damien-chazelle", full_name: "Damien Chazelle", bio: "Réalisateur américain connu pour ses films mêlant musique et ambition personnelle." },
  { id: "p44", slug: "ryan-gosling", full_name: "Ryan Gosling", bio: "Acteur canadien à la carrière internationale variée." },
  { id: "p45", slug: "emma-stone", full_name: "Emma Stone", bio: "Actrice américaine récompensée pour plusieurs rôles marquants." },
  { id: "p46", slug: "todd-phillips", full_name: "Todd Phillips", bio: "Réalisateur américain, d'abord connu pour des comédies avant de s'orienter vers des œuvres plus sombres." },
  { id: "p47", slug: "joaquin-phoenix", full_name: "Joaquin Phoenix", bio: "Acteur américain reconnu pour l'intensité et l'engagement physique de ses rôles." },
  { id: "p48", slug: "roger-allers", full_name: "Roger Allers", bio: "Réalisateur américain d'animation." },
  { id: "p49", slug: "ridley-scott", full_name: "Ridley Scott", bio: "Réalisateur britannique connu pour son sens visuel et la diversité de ses genres de prédilection." },
  { id: "p50", slug: "russell-crowe", full_name: "Russell Crowe", bio: "Acteur néo-zélandais à la carrière internationale saluée." },
];

export const mockPeople: Person[] = rawPeople.map((p) => ({
  id: p.id,
  slug: p.slug,
  full_name: p.full_name,
  photo_url: photoPlaceholder(p.full_name),
  birth_date: p.birth_date ?? null,
  death_date: p.death_date ?? null,
  birth_place: p.birth_place ?? null,
  biography: p.bio ?? null,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
}));

/** Toutes les personnes créditées avec un rôle donné (réalisateur ou acteur), dérivé du catalogue. */
export function getMockPeopleByRole(role: "director" | "actor"): Person[] {
  const ids = new Set<string>();
  Object.values(filmCreditsMap).forEach((credits) => {
    credits.forEach((c) => {
      if (c.role === role) ids.add(c.personId);
    });
  });
  return mockPeople.filter((p) => ids.has(p.id));
}

interface RawFilm {
  id: string;
  slug: string;
  title: string;
  original_title?: string;
  release_year: number;
  synopsis: string;
  runtime_minutes: number;
  country: string;
  countries?: string[];
  language: string;
  movement_id?: string | null;
  average_rating: number;
  rating_count: number;
  trailer_url?: string | null;
}

const rawFilms: RawFilm[] = [
  { id: "f1", slug: "a-bout-de-souffle", title: "À bout de souffle", release_year: 1960, synopsis: "Un petit malfrat cavale dans Paris après avoir tué un policier, entre romance avec une jeune Américaine et fuite inéluctable.", runtime_minutes: 90, country: "France", language: "Français", movement_id: "m1", average_rating: 8.2, rating_count: 134, trailer_url: "https://www.youtube.com/watch?v=Mxx8SGaFXGw" },
  { id: "f2", slug: "dune", title: "Dune", release_year: 2021, synopsis: "Sur la planète désertique Arrakis, le jeune Paul Atréides doit protéger sa famille et affronter son destin dans un monde de pouvoir et de sable.", runtime_minutes: 155, country: "États-Unis", countries: ["États-Unis", "Canada"], language: "Anglais", average_rating: 8.6, rating_count: 421, trailer_url: "https://www.youtube.com/watch?v=n9xhJrPXop4" },
  { id: "f3", slug: "le-voyage-de-chihiro", title: "Le Voyage de Chihiro", original_title: "千と千尋の神隠し", release_year: 2001, synopsis: "Une fillette de dix ans, en chemin vers sa nouvelle maison, pénètre dans le monde des esprits où ses parents sont transformés en cochons.", runtime_minutes: 125, country: "Japon", language: "Japonais", average_rating: 9.0, rating_count: 892, trailer_url: "https://www.youtube.com/watch?v=ByXuk9QqQkk" },
  { id: "f4", slug: "blade-runner-2049", title: "Blade Runner 2049", release_year: 2017, synopsis: "Un jeune blade runner découvre un secret longtemps enfoui qui pourrait plonger ce qu'il reste de la société dans le chaos.", runtime_minutes: 164, country: "États-Unis", language: "Anglais", average_rating: 8.4, rating_count: 356, trailer_url: "https://www.youtube.com/watch?v=gCcx85zbxz4" },
  { id: "f5", slug: "pulp-fiction", title: "Pulp Fiction", release_year: 1994, synopsis: "Les destins de plusieurs criminels de Los Angeles s'entrecroisent, entre un contrat à exécuter, une mallette mystérieuse et un couple de braqueurs de restaurant.", runtime_minutes: 154, country: "États-Unis", language: "Anglais", average_rating: 8.9, rating_count: 1204 },
  { id: "f6", slug: "le-parrain", title: "Le Parrain", original_title: "The Godfather", release_year: 1972, synopsis: "Le patriarche vieillissant d'une famille de la mafia new-yorkaise transmet le contrôle de son empire clandestin à son fils réticent.", runtime_minutes: 175, country: "États-Unis", language: "Anglais", average_rating: 9.1, rating_count: 1560 },
  { id: "f7", slug: "inception", title: "Inception", release_year: 2010, synopsis: "Un voleur capable de s'introduire dans les rêves des autres se voit confier une mission inverse : implanter une idée plutôt que la dérober.", runtime_minutes: 148, country: "États-Unis", language: "Anglais", average_rating: 8.7, rating_count: 1389 },
  { id: "f8", slug: "fight-club", title: "Fight Club", release_year: 1999, synopsis: "Un employé de bureau insomniaque et un vendeur de savon charismatique fondent un club de combat clandestin qui échappe bientôt à tout contrôle.", runtime_minutes: 139, country: "États-Unis", language: "Anglais", average_rating: 8.8, rating_count: 1102 },
  { id: "f9", slug: "forrest-gump", title: "Forrest Gump", release_year: 1994, synopsis: "Un homme au destin extraordinaire traverse malgré lui plusieurs décennies de l'histoire américaine, porté par sa loyauté et sa candeur.", runtime_minutes: 142, country: "États-Unis", language: "Anglais", average_rating: 8.7, rating_count: 1330 },
  { id: "f10", slug: "jurassic-park", title: "Jurassic Park", release_year: 1993, synopsis: "Un parc d'attractions peuplé de dinosaures ressuscités par ingénierie génétique tourne au cauchemar lorsque les systèmes de sécurité tombent en panne.", runtime_minutes: 127, country: "États-Unis", language: "Anglais", average_rating: 8.3, rating_count: 987 },
  { id: "f11", slug: "titanic", title: "Titanic", release_year: 1997, synopsis: "À bord du paquebot réputé insubmersible, une idylle naît entre deux passagers que tout sépare, la nuit où le navire heurte un iceberg.", runtime_minutes: 195, country: "États-Unis", language: "Anglais", average_rating: 8.1, rating_count: 1421 },
  { id: "f12", slug: "le-seigneur-des-anneaux-la-communaute-de-lanneau", title: "Le Seigneur des Anneaux : La Communauté de l'Anneau", release_year: 2001, synopsis: "Un jeune hobbit hérite d'un anneau doté d'un pouvoir immense et doit le détruire avant qu'il ne tombe entre de mauvaises mains.", runtime_minutes: 178, country: "États-Unis", countries: ["États-Unis", "Nouvelle-Zélande"], language: "Anglais", average_rating: 8.9, rating_count: 1650 },
  { id: "f13", slug: "matrix", title: "Matrix", release_year: 1999, synopsis: "Un programmeur découvre que la réalité qu'il connaît est une simulation informatique, et qu'une résistance clandestine l'attend pour la combattre.", runtime_minutes: 136, country: "États-Unis", language: "Anglais", average_rating: 8.7, rating_count: 1287 },
  { id: "f14", slug: "star-wars-un-nouvel-espoir", title: "Star Wars : Un nouvel espoir", release_year: 1977, synopsis: "Un jeune fermier d'une planète désertique rejoint la lutte contre un empire galactique tout-puissant après avoir découvert un message secret.", runtime_minutes: 121, country: "États-Unis", language: "Anglais", average_rating: 8.6, rating_count: 1502 },
  { id: "f15", slug: "casablanca", title: "Casablanca", release_year: 1942, synopsis: "Dans le Maroc occupé de la Seconde Guerre mondiale, un tenancier de bar désabusé retrouve son amour perdu, contraint de choisir entre passion et devoir.", runtime_minutes: 102, country: "États-Unis", language: "Anglais", average_rating: 8.5, rating_count: 743 },
  { id: "f16", slug: "psychose", title: "Psychose", original_title: "Psycho", release_year: 1960, synopsis: "Une jeune femme en fuite fait halte dans un motel isolé tenu par un jeune homme sous l'emprise étouffante de sa mère.", runtime_minutes: 109, country: "États-Unis", language: "Anglais", average_rating: 8.5, rating_count: 812 },
  { id: "f17", slug: "taxi-driver", title: "Taxi Driver", release_year: 1976, synopsis: "Un chauffeur de taxi solitaire, rongé par l'insomnie et le dégoût de la ville, sombre peu à peu dans une spirale de violence.", runtime_minutes: 114, country: "États-Unis", language: "Anglais", average_rating: 8.3, rating_count: 690 },
  { id: "f18", slug: "le-fabuleux-destin-damelie-poulain", title: "Le Fabuleux Destin d'Amélie Poulain", release_year: 2001, synopsis: "Une jeune serveuse parisienne au tempérament rêveur se met en tête d'améliorer discrètement la vie de ceux qui l'entourent.", runtime_minutes: 122, country: "France", language: "Français", average_rating: 8.3, rating_count: 980 },
  { id: "f19", slug: "parasite", title: "Parasite", release_year: 2019, synopsis: "Une famille désargentée s'infiltre peu à peu, poste après poste, dans le foyer d'une famille aisée, jusqu'à ce que l'équilibre bascule.", runtime_minutes: 132, country: "Corée du Sud", language: "Coréen", average_rating: 8.9, rating_count: 1345 },
  { id: "f20", slug: "interstellar", title: "Interstellar", release_year: 2014, synopsis: "Face à une Terre devenue inhabitable, un groupe d'explorateurs franchit un trou de ver à la recherche d'un nouveau foyer pour l'humanité.", runtime_minutes: 169, country: "États-Unis", countries: ["États-Unis", "Royaume-Uni"], language: "Anglais", average_rating: 8.8, rating_count: 1478 },
  { id: "f21", slug: "la-la-land", title: "La La Land", release_year: 2016, synopsis: "Une actrice en devenir et un pianiste de jazz idéaliste voient leur histoire d'amour se heurter à l'ambition de leurs rêves respectifs.", runtime_minutes: 128, country: "États-Unis", language: "Anglais", average_rating: 8.2, rating_count: 1023 },
  { id: "f22", slug: "joker", title: "Joker", release_year: 2019, synopsis: "Un humoriste raté et marginalisé, à la santé mentale fragile, bascule peu à peu dans la violence au sein d'une ville rongée par les inégalités.", runtime_minutes: 122, country: "États-Unis", language: "Anglais", average_rating: 8.4, rating_count: 1198 },
  { id: "f23", slug: "le-roi-lion", title: "Le Roi Lion", original_title: "The Lion King", release_year: 1994, synopsis: "Un jeune lionceau destiné à régner sur la savane doit fuir après un drame familial, avant d'apprendre à assumer son héritage.", runtime_minutes: 88, country: "États-Unis", language: "Anglais", average_rating: 8.5, rating_count: 1076 },
  { id: "f24", slug: "gladiator", title: "Gladiator", release_year: 2000, synopsis: "Un général romain trahi et réduit en esclavage gravit les rangs des gladiateurs pour venger sa famille assassinée.", runtime_minutes: 155, country: "États-Unis", language: "Anglais", average_rating: 8.5, rating_count: 1289 },
];

export const mockFilms: Film[] = rawFilms.map((f) => ({
  id: f.id,
  slug: f.slug,
  title: f.title,
  original_title: f.original_title ?? null,
  release_year: f.release_year,
  release_date: `${f.release_year}-01-01`,
  synopsis: f.synopsis,
  poster_url: posterPlaceholder(f.title),
  backdrop_url: null,
  trailer_url: f.trailer_url ?? null,
  runtime_minutes: f.runtime_minutes,
  country: f.country,
  countries: f.countries ?? [f.country],
  language: f.language,
  budget: null,
  movement_id: f.movement_id ?? null,
  average_rating: f.average_rating,
  rating_count: f.rating_count,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
}));

const filmGenreMap: Record<string, string[]> = {
  f1: ["g1"],
  f2: ["g2", "g1"],
  f3: ["g5", "g1"],
  f4: ["g2", "g3"],
  f5: ["g3", "g4"],
  f6: ["g1", "g3"],
  f7: ["g2", "g3"],
  f8: ["g1", "g3"],
  f9: ["g1", "g4"],
  f10: ["g2", "g6"],
  f11: ["g1", "g6"],
  f12: ["g6", "g7"],
  f13: ["g2", "g8"],
  f14: ["g2", "g6"],
  f15: ["g1"],
  f16: ["g3"],
  f17: ["g1", "g3"],
  f18: ["g4", "g1"],
  f19: ["g3", "g1"],
  f20: ["g2", "g1"],
  f21: ["g4", "g1"],
  f22: ["g1", "g3"],
  f23: ["g5", "g6"],
  f24: ["g1", "g6"],
};

const filmCreditsMap: Record<
  string,
  { personId: string; role: "director" | "actor"; character?: string }[]
> = {
  f1: [{ personId: "p1", role: "director" }, { personId: "p2", role: "actor", character: "Patricia Franchini" }],
  f2: [{ personId: "p3", role: "director" }, { personId: "p4", role: "actor", character: "Paul Atréides" }],
  f3: [{ personId: "p5", role: "director" }],
  f4: [{ personId: "p3", role: "director" }],
  f5: [{ personId: "p6", role: "director" }, { personId: "p7", role: "actor", character: "Vincent Vega" }, { personId: "p8", role: "actor", character: "Mia Wallace" }],
  f6: [{ personId: "p9", role: "director" }, { personId: "p10", role: "actor", character: "Vito Corleone" }, { personId: "p11", role: "actor", character: "Michael Corleone" }],
  f7: [{ personId: "p12", role: "director" }, { personId: "p13", role: "actor", character: "Dom Cobb" }, { personId: "p14", role: "actor", character: "Mal" }],
  f8: [{ personId: "p15", role: "director" }, { personId: "p16", role: "actor", character: "Tyler Durden" }, { personId: "p17", role: "actor", character: "Le narrateur" }],
  f9: [{ personId: "p18", role: "director" }, { personId: "p19", role: "actor", character: "Forrest Gump" }],
  f10: [{ personId: "p20", role: "director" }, { personId: "p21", role: "actor", character: "Dr. Alan Grant" }],
  f11: [{ personId: "p22", role: "director" }, { personId: "p13", role: "actor", character: "Jack Dawson" }, { personId: "p23", role: "actor", character: "Rose DeWitt Bukater" }],
  f12: [{ personId: "p24", role: "director" }, { personId: "p25", role: "actor", character: "Frodo Sacquet" }],
  f13: [{ personId: "p26", role: "director" }, { personId: "p27", role: "actor", character: "Neo" }],
  f14: [{ personId: "p28", role: "director" }, { personId: "p29", role: "actor", character: "Luke Skywalker" }, { personId: "p30", role: "actor", character: "Han Solo" }],
  f15: [{ personId: "p31", role: "director" }, { personId: "p32", role: "actor", character: "Rick Blaine" }, { personId: "p33", role: "actor", character: "Ilsa Lund" }],
  f16: [{ personId: "p34", role: "director" }, { personId: "p35", role: "actor", character: "Norman Bates" }],
  f17: [{ personId: "p36", role: "director" }, { personId: "p37", role: "actor", character: "Travis Bickle" }],
  f18: [{ personId: "p38", role: "director" }, { personId: "p39", role: "actor", character: "Amélie Poulain" }],
  f19: [{ personId: "p40", role: "director" }, { personId: "p41", role: "actor", character: "Kim Ki-taek" }],
  f20: [{ personId: "p12", role: "director" }, { personId: "p42", role: "actor", character: "Cooper" }],
  f21: [{ personId: "p43", role: "director" }, { personId: "p44", role: "actor", character: "Sebastian" }, { personId: "p45", role: "actor", character: "Mia" }],
  f22: [{ personId: "p46", role: "director" }, { personId: "p47", role: "actor", character: "Arthur Fleck" }],
  f23: [{ personId: "p48", role: "director" }],
  f24: [{ personId: "p49", role: "director" }, { personId: "p50", role: "actor", character: "Maximus" }],
};

export function getMockFilmDetail(slug: string): FilmDetail | null {
  const film = mockFilms.find((f) => f.slug === slug);
  if (!film) return null;

  const genres = (filmGenreMap[film.id] ?? []).map((gid) => mockGenres.find((g) => g.id === gid)!);
  const credits = (filmCreditsMap[film.id] ?? []).map((c, i) => ({
    id: `${film.id}-credit-${i}`,
    film_id: film.id,
    person_id: c.personId,
    role: c.role,
    character_name: c.character ?? null,
    billing_order: i,
    person: mockPeople.find((p) => p.id === c.personId),
  }));
  const movement = film.movement_id ? mockMovements.find((m) => m.id === film.movement_id) ?? null : null;

  return { ...film, genres, credits, images: [], movement } as FilmDetail;
}

export function getMockFilmography(personId: string) {
  return Object.entries(filmCreditsMap)
    .filter(([, credits]) => credits.some((c) => c.personId === personId))
    .map(([filmId, credits]) => {
      const credit = credits.find((c) => c.personId === personId)!;
      const film = mockFilms.find((f) => f.id === filmId)!;
      return { id: `${filmId}-${personId}`, role: credit.role, character_name: credit.character ?? null, film };
    });
}

export const mockArticleCategories: ArticleCategory[] = [
  { id: "c1", slug: "analyse", name: "Analyse" },
  { id: "c2", slug: "portrait", name: "Portrait" },
];

export const mockArticles: Article[] = [
  {
    id: "a1",
    slug: "la-rupture-godardienne",
    title: "La rupture godardienne : le montage comme manifeste",
    excerpt: "Comment À bout de souffle a redéfini les règles du montage cinématographique.",
    content:
      "En 1960, Jean-Luc Godard bouleverse la grammaire du cinéma classique avec des jump cuts assumés, refusant la continuité fluide chère au cinéma hollywoodien.\n\nCe choix esthétique, perçu à l'époque comme une maladresse par certains critiques, devient rapidement une signature stylistique reprise par toute une génération de cinéastes.\n\nAu-delà du procédé technique, cette rupture traduit une nouvelle manière de penser le rapport entre le spectateur et l'image : moins d'illusion, plus de conscience du dispositif.",
    cover_url: null,
    category_id: "c1",
    related_film_id: "f1",
    author_id: null,
    status: "published",
    published_at: "2024-02-01",
    created_at: "2024-02-01",
    updated_at: "2024-02-01",
    category: mockArticleCategories[0],
  },
  {
    id: "a2",
    slug: "denis-villeneuve-l-epique-intime",
    title: "Denis Villeneuve : l'épique et l'intime",
    excerpt: "Comment le réalisateur québécois marie grand spectacle et émotions retenues.",
    content:
      "Des paysages désertiques de Dune aux ruelles pluvieuses de Blade Runner 2049, Denis Villeneuve construit une œuvre où l'ampleur visuelle ne sacrifie jamais l'intériorité des personnages.\n\nSa mise en scène, souvent silencieuse, laisse une large place au hors-champ et à la contemplation, dans une industrie où le rythme soutenu est pourtant la norme.",
    cover_url: null,
    category_id: "c2",
    related_film_id: "f2",
    author_id: null,
    status: "published",
    published_at: "2024-03-10",
    created_at: "2024-03-10",
    updated_at: "2024-03-10",
    category: mockArticleCategories[1],
  },
];
