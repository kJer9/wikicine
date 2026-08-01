import type { AcademyCategory, CourseWithLessons } from "@/types/academy";

// ---------------------------------------------------------
// Contenu rédigé pour le MVP — à remplacer par tes propres cours.
// Chaque leçon garde le même format (titre, contenu markdown, question de
// compréhension optionnelle) pour que le remplacement soit simple.
// ---------------------------------------------------------

export const mockAcademyCategories: AcademyCategory[] = [
  { id: "cat1", slug: "histoire-du-cinema", name: "Histoire du cinéma", description: "Des origines à aujourd'hui.", icon: "🎞️" },
  { id: "cat2", slug: "scenario", name: "Scénario", description: "Construire une histoire qui fonctionne.", icon: "📝" },
  { id: "cat3", slug: "realisation", name: "Réalisation", description: "Le langage visuel de la mise en scène.", icon: "🎬" },
  { id: "cat4", slug: "montage", name: "Montage", description: "Assembler le rythme d'un film.", icon: "✂️" },
  { id: "cat5", slug: "lumiere", name: "Lumière", description: "Bientôt disponible.", icon: "💡" },
  { id: "cat6", slug: "son", name: "Son", description: "Bientôt disponible.", icon: "🔊" },
  { id: "cat7", slug: "genres", name: "Genres", description: "Bientôt disponible.", icon: "🎭" },
  { id: "cat8", slug: "auteurs", name: "Auteurs", description: "Bientôt disponible.", icon: "✍️" },
  { id: "cat9", slug: "studios", name: "Studios", description: "Bientôt disponible.", icon: "🏛️" },
  { id: "cat10", slug: "metiers-du-cinema", name: "Métiers du cinéma", description: "Bientôt disponible.", icon: "👥" },
  { id: "cat11", slug: "industrie-cinematographique", name: "Industrie cinématographique", description: "Bientôt disponible.", icon: "💰" },
];

export const mockCourses: CourseWithLessons[] = [
  {
    id: "course1",
    slug: "les-origines-du-cinema",
    title: "Les origines du cinéma",
    description: "Comment l'image animée est née, des jouets optiques du 19e siècle au premier film projeté en public.",
    level: "debutant",
    cover_url: null,
    category: mockAcademyCategories[0],
    lessonCount: 2,
    lessons: [
      {
        id: "l1",
        slug: "persistance-retinienne",
        title: "Avant le cinéma : la persistance rétinienne",
        duration_minutes: 4,
        xp_reward: 20,
        position: 0,
        content:
          "Avant même l'invention de la caméra, l'idée de faire bouger des images fascinait déjà les inventeurs du 19e siècle.\n\nTout repose sur un phénomène appelé la persistance rétinienne : l'œil humain retient une image pendant une fraction de seconde après qu'elle a disparu. Si on lui présente une succession rapide d'images légèrement différentes, le cerveau les fusionne en un mouvement continu.\n\nDes jouets optiques exploitent ce principe dès les années 1830 : le phénakistiscope, le zootrope, puis le praxinoscope. Ce sont de simples disques ou cylindres tournants percés de fentes, à travers lesquels on observe une série de dessins qui semblent s'animer.\n\nCes objets ne sont pas encore du cinéma — il n'y a ni caméra, ni projection sur un écran partagé — mais ils posent les bases techniques et perceptives sur lesquelles le cinéma va se construire quelques décennies plus tard.",
        check: {
          question_text: "Quel phénomène physiologique permet la sensation de mouvement dans les jouets optiques ?",
          options: ["La persistance rétinienne", "La vision périphérique", "L'accommodation oculaire"],
          correct_index: 0,
        },
      },
      {
        id: "l2",
        slug: "naissance-du-cinematographe",
        title: "1895 : la naissance du cinématographe",
        duration_minutes: 5,
        xp_reward: 20,
        position: 1,
        content:
          "Le 28 décembre 1895, à Paris, les frères Auguste et Louis Lumière organisent la première projection publique et payante de films devant une salle de spectateurs. C'est cette date qui est traditionnellement retenue comme celle de la naissance du cinéma.\n\nLeur appareil, le Cinématographe, est à la fois caméra, tireuse de copies et projecteur — une prouesse d'ingénierie pour l'époque. Les films durent moins d'une minute et montrent des scènes de la vie quotidienne : des ouvriers sortant d'une usine, un train entrant en gare, un jardinier arrosé par sa propre lance.\n\nCe qui frappe les premiers spectateurs, ce n'est pas l'histoire racontée — il n'y en a pas vraiment — mais le simple fait de voir le monde réel se mouvoir sur un écran. L'anecdote (peut-être exagérée) selon laquelle le public aurait fui la salle terrifié devant l'arrivée d'un train à l'écran illustre à quel point cette expérience était inédite.\n\nTrès vite, d'autres pionniers vont chercher à dépasser la simple captation du réel pour raconter des histoires : c'est le début d'un art narratif à part entière.",
        check: {
          question_text: "Quel est le nom de l'appareil inventé par les frères Lumière ?",
          options: ["Le Kinétoscope", "Le Cinématographe", "Le Praxinoscope"],
          correct_index: 1,
        },
      },
    ],
  },
  {
    id: "course2",
    slug: "construire-une-histoire",
    title: "Construire une histoire",
    description: "Les fondations du scénario : structure narrative et construction des personnages.",
    level: "debutant",
    cover_url: null,
    category: mockAcademyCategories[1],
    lessonCount: 2,
    lessons: [
      {
        id: "l3",
        slug: "structure-en-trois-actes",
        title: "La structure en trois actes",
        duration_minutes: 6,
        xp_reward: 20,
        position: 0,
        content:
          "La grande majorité des films — pas tous, mais une large majorité — s'organisent autour d'une structure en trois actes, héritée du théâtre classique.\n\nLe premier acte pose le monde du personnage principal, son quotidien, ses manques. Il se termine par un événement déclencheur qui bouleverse cet équilibre et lance l'intrigue : c'est le point de non-retour qui pousse le personnage à agir.\n\nLe deuxième acte, généralement le plus long, développe les obstacles que rencontre le personnage dans sa tentative d'atteindre son objectif. C'est là que se nouent les tensions, les alliances, les revers. Il se termine souvent par un point bas, où tout semble perdu.\n\nLe troisième acte apporte la résolution : la confrontation finale, puis les conséquences. Le personnage a changé — ou a échoué à changer, ce qui est aussi une forme de résolution.\n\nCette structure n'est pas une formule rigide à appliquer mécaniquement, mais un outil de compréhension : beaucoup de films qui semblent s'en écarter jouent en réalité avec ses attentes plutôt que de l'ignorer complètement.",
        check: {
          question_text: "Que marque généralement la fin du premier acte ?",
          options: ["La résolution du conflit", "L'événement déclencheur", "Le climax"],
          correct_index: 1,
        },
      },
      {
        id: "l4",
        slug: "le-personnage-et-son-desir",
        title: "Le personnage et son désir",
        duration_minutes: 5,
        xp_reward: 20,
        position: 1,
        content:
          "Un personnage de fiction se définit avant tout par ce qu'il veut. Ce désir — obtenir quelque chose, retrouver quelqu'un, échapper à une situation — est le moteur qui met l'histoire en mouvement.\n\nOn distingue souvent le désir conscient du personnage (ce qu'il pense vouloir, ce qu'il poursuit activement) de son besoin inconscient (ce dont il a réellement besoin pour évoluer, qu'il ne perçoit pas toujours au début du récit). Le meilleur des scénarios crée une tension entre les deux : le personnage obtient parfois ce qu'il voulait, mais découvre que ce n'était pas ce dont il avait besoin — ou l'inverse.\n\nCe désir doit aussi rencontrer des obstacles crédibles, externes (un antagoniste, des circonstances) ou internes (une peur, une faille). Sans obstacle, il n'y a pas de tension dramatique, donc pas d'histoire à raconter.\n\nEnfin, un personnage mémorable n'est pas nécessairement sympathique — il doit surtout être compréhensible. Le spectateur doit pouvoir suivre sa logique interne, même s'il ne partage pas ses choix.",
        check: {
          question_text: "Quelle est la distinction clé entre désir conscient et besoin inconscient d'un personnage ?",
          options: [
            "Il n'y a pas de différence, ce sont des synonymes",
            "Le désir conscient est ce que le personnage poursuit activement, le besoin est ce dont il a réellement besoin pour évoluer",
            "Le besoin inconscient n'existe que dans les films d'horreur",
          ],
          correct_index: 1,
        },
      },
    ],
  },
  {
    id: "course3",
    slug: "le-langage-de-la-mise-en-scene",
    title: "Le langage de la mise en scène",
    description: "Comment le cadre et le mouvement de caméra racontent une histoire, sans un mot de dialogue.",
    level: "debutant",
    cover_url: null,
    category: mockAcademyCategories[2],
    lessonCount: 2,
    lessons: [
      {
        id: "l5",
        slug: "le-cadre-et-la-composition",
        title: "Le cadre et la composition",
        duration_minutes: 5,
        xp_reward: 20,
        position: 0,
        content:
          "Chaque plan de film est une composition : un choix de ce qui entre dans le cadre, de ce qui en est exclu, et de la manière dont les éléments visibles sont disposés les uns par rapport aux autres.\n\nLa taille du cadrage porte déjà du sens. Un gros plan sur un visage isole une émotion et crée une proximité intime avec le personnage. Un plan large, au contraire, situe le personnage dans son environnement — parfois pour le mettre en valeur, parfois pour souligner sa solitude ou son insignifiance face à un décor immense.\n\nLa position des éléments dans le cadre compte aussi. Un personnage centré project un sentiment de stabilité ou d'importance ; décentré, il peut sembler vulnérable, marginal, ou en déséquilibre avec son environnement. La règle des tiers — diviser l'image en trois bandes horizontales et verticales — est un repère classique pour construire des compositions équilibrées, que les cinéastes suivent ou transgressent délibérément.\n\nLa profondeur de champ (ce qui est net ou flou selon la distance) permet également de diriger le regard du spectateur vers ce qui compte, ou au contraire de brouiller la lecture pour créer de l'ambiguïté.",
        check: {
          question_text: "Qu'exprime généralement un gros plan sur un visage ?",
          options: ["La solitude du personnage dans son environnement", "Une proximité intime avec l'émotion du personnage", "L'importance du décor"],
          correct_index: 1,
        },
      },
      {
        id: "l6",
        slug: "les-mouvements-de-camera",
        title: "Les mouvements de caméra",
        duration_minutes: 5,
        xp_reward: 20,
        position: 1,
        content:
          "Une caméra immobile n'est déjà pas un choix neutre, mais la mettre en mouvement ajoute une dimension supplémentaire au récit visuel.\n\nLe panoramique (la caméra pivote sur son axe, horizontalement ou verticalement) permet de balayer un espace ou de suivre un personnage sans déplacer la caméra elle-même. Le travelling, à l'inverse, déplace physiquement la caméra — en avant, en arrière, latéralement — créant une sensation de mouvement dans l'espace qui accompagne ou anticipe l'action.\n\nLe zoom modifie la focale de l'objectif pour rapprocher ou éloigner visuellement le sujet, sans déplacement réel de la caméra : l'effet est différent d'un travelling, plus artificiel, souvent utilisé pour son caractère abrupt ou stylisé.\n\nLa caméra portée à l'épaule, avec ses légers tremblements, crée une sensation d'immédiateté et de proximité physique — un choix esthétique fréquent dans le cinéma naturaliste ou les scènes de tension.\n\nCes mouvements ne sont jamais de simples prouesses techniques : chaque choix modifie la relation émotionnelle entre le spectateur et ce qui se déroule à l'écran.",
        check: {
          question_text: "Quelle est la différence principale entre un travelling et un zoom ?",
          options: [
            "Il n'y a aucune différence, ce sont deux noms pour le même effet",
            "Le travelling déplace physiquement la caméra, le zoom change seulement la focale de l'objectif",
            "Le zoom ne s'utilise qu'en noir et blanc",
          ],
          correct_index: 1,
        },
      },
    ],
  },
  {
    id: "course4",
    slug: "les-bases-du-montage",
    title: "Les bases du montage",
    description: "Comment l'assemblage des plans construit le sens et le rythme d'un film.",
    level: "debutant",
    cover_url: null,
    category: mockAcademyCategories[3],
    lessonCount: 2,
    lessons: [
      {
        id: "l7",
        slug: "champ-contrechamp-et-raccord",
        title: "Le champ-contrechamp et le raccord",
        duration_minutes: 5,
        xp_reward: 20,
        position: 0,
        content:
          "Le champ-contrechamp est l'une des figures de montage les plus utilisées au cinéma, en particulier dans les scènes de dialogue. Il consiste à alterner des plans sur chacun des interlocuteurs, généralement filmés depuis une position symétrique, comme si la caméra prenait tour à tour la place de chaque personnage.\n\nPour que cette alternance reste fluide et compréhensible, elle repose sur un principe fondamental : le raccord. Un raccord réussi donne l'illusion d'une continuité parfaite entre deux plans différents — même s'ils ont été tournés à des moments et depuis des angles différents, parfois à plusieurs jours d'intervalle.\n\nLa règle des 180 degrés est l'un des outils qui garantit cette continuité : elle consiste à ne jamais faire franchir à la caméra une ligne imaginaire reliant les deux personnages, pour que leur position relative (qui regarde à gauche, qui regarde à droite) reste cohérente d'un plan à l'autre. La transgresser volontairement peut créer un effet de désorientation — un choix parfois recherché, mais qui doit être délibéré.\n\nUn raccord raté ou un faux mouvement (un objet qui change de main d'un plan à l'autre, par exemple) est ce qu'on appelle un « faux raccord » — souvent une erreur, mais parfois utilisé consciemment à des fins stylistiques.",
        check: {
          question_text: "À quoi sert la règle des 180 degrés ?",
          options: [
            "À garantir la cohérence de la position des personnages d'un plan à l'autre",
            "À déterminer la durée d'un plan",
            "À choisir la couleur de l'éclairage",
          ],
          correct_index: 0,
        },
      },
      {
        id: "l8",
        slug: "rythme-et-ellipse",
        title: "Le rythme et l'ellipse",
        duration_minutes: 5,
        xp_reward: 20,
        position: 1,
        content:
          "Le montage ne se contente pas d'assembler des plans dans l'ordre logique de l'histoire : il façonne le rythme du film, c'est-à-dire la vitesse à laquelle l'information visuelle et émotionnelle est délivrée au spectateur.\n\nDes plans courts, montés rapidement, créent une sensation d'urgence, de tension ou de chaos — un procédé fréquent dans les scènes d'action. À l'inverse, des plans longs, peu découpés, invitent à la contemplation, laissent le temps à une émotion de s'installer, ou soulignent l'ennui ou la lenteur d'une situation.\n\nL'ellipse est un autre outil essentiel : elle consiste à omettre volontairement une partie du temps ou de l'action, en passant directement d'un moment à un autre sans montrer ce qui les relie. Un personnage sort de chez lui ; le plan suivant le montre arrivant à destination — le trajet lui-même n'a aucun intérêt narratif, on le saute.\n\nL'ellipse permet de resserrer un récit sur ce qui compte vraiment, mais elle demande au spectateur de combler mentalement les vides — un exercice que le cinéma, contrairement à d'autres formes narratives, nous a appris à faire presque instinctivement.",
        check: {
          question_text: "Que permet principalement l'ellipse au montage ?",
          options: [
            "D'omettre un moment sans intérêt narratif pour resserrer le récit",
            "De ralentir systématiquement le rythme du film",
            "D'ajouter des effets spéciaux entre deux plans",
          ],
          correct_index: 0,
        },
      },
    ],
  },
];
