# WikiCiné

Plateforme moderne dédiée à la culture cinématographique : catalogue de films,
fiches réalisateurs/acteurs, mouvements cinématographiques, articles d'analyse,
recherche avancée et comptes utilisateurs (favoris, à voir plus tard).

**Stack :** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (DB + Auth + Storage) · Vercel

---

## 🚀 Démarrage ultra-rapide (sans Supabase)

Le projet démarre **directement avec des données de démonstration intégrées** — aucune base de données à configurer pour prévisualiser le design et la navigation.

```bash
cd wikicine
npm install
npm run dev
```

Ouvre **http://localhost:3000**. C'est tout.

Tant qu'aucune variable Supabase n'est renseignée dans `.env.local`, le site tourne automatiquement en **mode démo** (un badge "Mode démo" apparaît dans la barre de navigation) : catalogue, fiches films, fiches réalisateurs/acteurs, articles et recherche fonctionnent avec quelques exemples de contenu. Seules les fonctionnalités nécessitant un compte (connexion, favoris, notes, back-office admin) restent inactives — un message l'indique clairement à chaque endroit concerné.

Pour connecter une vraie base de données et débloquer ces fonctionnalités, suis la section suivante.

---

## 1. Architecture du projet

```
wikicine/
├── app/                        # Routes (App Router)
│   ├── page.tsx                 # Accueil
│   ├── films/
│   │   ├── page.tsx              # Catalogue (filtres, pagination)
│   │   └── [slug]/page.tsx       # Fiche film détaillée
│   ├── people/[slug]/page.tsx    # Fiche réalisateur/acteur
│   ├── articles/
│   │   ├── page.tsx              # Liste des analyses
│   │   └── [slug]/page.tsx       # Article détaillé
│   ├── search/page.tsx           # Recherche avancée
│   ├── login/, register/         # Authentification
│   ├── profile/, favorites/, watchlist/   # Espace utilisateur
│   └── admin/                    # Back-office (rôle admin/editor requis)
│       ├── films/ (liste, new, [id])
│       ├── articles/ (liste, new, [id])
│       └── users/
├── components/                 # Composants UI réutilisables
│   └── admin/                    # Composants spécifiques au back-office
├── lib/
│   ├── supabase/                 # Clients Supabase (browser, server)
│   └── data/                     # Fonctions de requête (films, people, articles)
├── types/database.ts            # Types TypeScript du domaine
├── supabase/
│   ├── schema.sql                # Schéma complet (tables, RLS, storage)
│   └── seed.ts                   # Données de démonstration
└── middleware.ts                # Rafraîchissement de session Supabase
```

**Principes de conception :**
- Server Components par défaut (lecture de données côté serveur, SEO natif) ; Client Components uniquement pour l'interactivité (formulaires, boutons favoris/notes).
- Toute la sécurité d'accès aux données passe par **Row Level Security** côté Supabase, pas seulement par l'UI — même un appel API direct respecte les permissions.
- La couche `lib/data/` isole les requêtes Supabase des pages : facile à faire évoluer (ex. migrer vers des vues SQL ou des RPC) sans toucher à l'UI.

---

## 2. Installation locale

### Prérequis
- Node.js 18.18+ (recommandé : 20 LTS)
- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [Vercel](https://vercel.com) pour le déploiement (optionnel en local)

### Étapes

```bash
# 1. Extraire l'archive puis se placer dans le dossier
cd wikicine

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement et le remplir (voir section 3)
cp .env.local.example .env.local

# 4. Lancer le serveur de développement
npm run dev
```

Le site est alors accessible sur **http://localhost:3000**.

---

## 3. Configuration Supabase

### 3.1 Créer le projet
1. Sur [supabase.com](https://supabase.com), cliquer sur **New Project**.
2. Noter l'URL du projet et la clé `anon public` (Project Settings → API).
3. Noter également la clé `service_role` (nécessaire uniquement pour le seed, à garder secrète).

### 3.2 Exécuter le schéma
1. Ouvrir **SQL Editor** dans le dashboard Supabase.
2. Copier-coller l'intégralité du fichier `supabase/schema.sql`.
3. Exécuter (**Run**). Cela crée :
   - Les tables (`films`, `people`, `genres`, `movements`, `articles`, `favorites`, `watchlist`, `ratings`, `profiles`, etc.)
   - Les triggers (création automatique de profil à l'inscription, recalcul de note moyenne)
   - Les policies **Row Level Security** (lecture publique du contenu éditorial, écriture réservée aux admins/éditeurs, données utilisateur strictement privées)
   - Les buckets de stockage (`posters`, `people`, `articles`, `avatars`)

### 3.3 Renseigner `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 3.4 Peupler avec des données de démonstration (optionnel)

```bash
npm run seed
```

Cela crée quelques genres, un mouvement (Nouvelle Vague), des personnes, deux films et un article de démo — utile pour vérifier que tout fonctionne avant de saisir du vrai contenu.

### 3.5 Créer le premier compte administrateur
1. S'inscrire normalement via `/register` sur le site.
2. Dans Supabase → **Table Editor** → `profiles`, trouver la ligne correspondant à ce compte.
3. Modifier la colonne `role` de `user` à `admin`.
4. Se reconnecter : le lien **Admin** apparaît dans la barre de navigation, donnant accès à `/admin`.

---

## 4. Alimenter le catalogue

Deux méthodes :
- **Via l'interface admin** (`/admin/films`, `/admin/articles`) : formulaires classiques, adaptés à une saisie manuelle progressive.
- **Via SQL direct / scripts** : pour un import en masse (ex. depuis un export CSV ou une autre base), insérer directement dans `films`, `people`, `film_credits`, `film_genres` depuis le SQL Editor ou un script Node utilisant `SUPABASE_SERVICE_ROLE_KEY`.

Pour les images (affiches, photos, galerie), deux options :
- Héberger sur les buckets Supabase Storage créés par le schéma (`posters`, `people`, `articles`) et utiliser l'URL publique générée.
- Utiliser une URL externe (ex. `image.tmdb.org`) — déjà autorisée dans `next.config.mjs`.

---

## 5. Déploiement sur Vercel

```bash
# Pousser le projet sur un repo GitHub, puis :
npx vercel
```

Ou via l'interface Vercel :
1. **New Project** → importer le repo GitHub.
2. Renseigner les variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) dans Project Settings → Environment Variables.
3. Déployer. Le framework Next.js est détecté automatiquement, aucune configuration supplémentaire n'est nécessaire.

⚠️ `SUPABASE_SERVICE_ROLE_KEY` n'est utilisée que par le script de seed (exécuté en local/CI, jamais dans le runtime web) — elle n'a pas besoin d'être définie sur Vercel sauf si vous automatisez des imports côté serveur.

---

## 6. Roadmap — au-delà du MVP

Le MVP livré couvre l'intégralité du cahier des charges avec une administration fonctionnelle. Pistes d'évolution naturelles :

- **Éditeur de contenu riche** : remplacer les textarea markdown par un éditeur WYSIWYG (ex. Tiptap) + rendu `react-markdown` sécurisé.
- **Upload d'images direct** : formulaire d'upload vers Supabase Storage plutôt que collage d'URL.
- **Gestion du casting en admin** : interface dédiée pour lier acteurs/réalisateurs à un film (actuellement via SQL direct ou table editor Supabase).
- **Pages "Mouvements cinématographiques"** : la table existe déjà (`movements`), il reste à créer les pages de listing/détail correspondantes (même structure que `people/[slug]`).
- **Recherche full-text avancée** : migrer `ilike` vers `tsvector`/`to_tsquery` PostgreSQL pour de meilleures performances à grande échelle.
- **Système de commentaires sur les articles.**
- **Tests automatisés** (Vitest + Playwright) et CI GitHub Actions.
- **Génération de types Supabase** : remplacer le `Database = any` de `types/database.ts` par `npx supabase gen types typescript` pour un typage strict de bout en bout.

---

## 7. Commandes utiles

| Commande            | Description                                  |
|---------------------|-----------------------------------------------|
| `npm run dev`        | Serveur de développement (localhost:3000)     |
| `npm run build`      | Build de production                           |
| `npm run start`      | Lance le build de production en local         |
| `npm run lint`       | Vérifie le code avec ESLint                   |
| `npm run seed`       | Peuple Supabase avec des données de démo      |
