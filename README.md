# LAIT THYM SEL — Site vitrine

Site du restaurant gastronomique LAIT THYM SEL (Fanny & Gaëtan Morvan, Angers).
Application React statique, bilingue français / anglais, sans dépendance à un
hébergeur particulier.

## Démarrer

Node.js 20 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # génère dist/
npm run preview
npm run typecheck
```

## Mise en ligne

| Réglage           | Valeur          |
| ----------------- | --------------- |
| Commande de build | `npm run build` |
| Dossier à publier | `dist`          |

Et **une règle de réécriture indispensable** : `/*` → `/index.html`. Sans elle,
un accès direct à `/menus` renvoie une 404.

<details>
<summary>nginx</summary>

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```
</details>

Avant la première mise en ligne, remplacez `SITE_URL` dans
`src/lib/restaurant.ts` et les URL absolues d'`index.html` et de
`public/sitemap.xml` si le domaine final diffère de `www.laitthymsel.fr`.

## Réservation

Le restaurant utilise **Zenchef**, qui reste la source de vérité : c'est lui
qui connaît le plan de salle et les tables réellement disponibles. Le site ne
tient aucun registre de réservations de son côté — il n'y a donc aucun risque
de double réservation ni de couvert perdu.

Tout passe par `src/lib/booking.ts` :

- le SDK officiel `sdk.zenchef.com/v1/sdk.min.js` est chargé **à la demande**
  — au premier clic sur « Réserver », ou à l'ouverture de `/reservation` —
  jamais au chargement des autres pages ;
- sur `/reservation`, le module s'ouvre automatiquement et `useDockedBookingWidget`
  (`src/lib/dockWidget.ts`) le superpose à un emplacement réservé dans le flux
  de la page, au lieu de le laisser flotter contre le bord de l'écran ;
- si le script est bloqué ou indisponible, un encart propose la page de
  réservation hébergée par Zenchef et le numéro de téléphone.

### Piège du SDK : `data-hide-default-button`

Cet attribut est lu **par sa présence, pas par sa valeur**. Absent, le module
s'affiche en permanence sous forme de barre repliée. Présent — que la valeur
soit `"true"` ou `"false"` — il reste caché jusqu'à un appel explicite à
`open()`. L'ancien site le déclarait sans fournir aucun déclencheur : le
module était donc littéralement inatteignable.

L'identifiant du restaurant est dans `src/lib/restaurant.ts` (`bookingId`).

## Bilingue

Le français est la langue source. Les clés du dictionnaire sont les phrases
françaises elles-mêmes (`t("Réserver une table")`), ce qui rend le code lisible
et fait retomber une traduction manquante sur le français plutôt que sur une
clé technique.

- Dictionnaire anglais : `src/i18n/en.ts`
- L'anglais vit sous `/en` (ex. `/en/menus`) — une URL distincte par langue,
  avec `hreflang` et `canonical`, pour que les deux versions soient indexées.

Pour ajouter une phrase : écrivez-la en français dans le composant, entourée de
`t("…")`, puis ajoutez l'entrée correspondante dans `en.ts`.

## Vie privée

- **Polices auto-hébergées** (`@fontsource`) : aucun appel aux serveurs de
  Google, donc aucun transfert d'adresse IP vers un tiers.
- **Bandeau de consentement** à deux catégories (`src/lib/consent.ts`) : mesure
  d'audience, et carte de la page Contact. Rien n'est chargé sans accord ; la
  décision est redemandée au bout de six mois.
- **Carte Contact** : remplacée par l'adresse et un lien d'itinéraire tant que
  le visiteur n'a pas accepté.
- Le choix reste modifiable depuis la page Politique de confidentialité.

## SEO

Les balises Open Graph, le `canonical`, les `hreflang` et les données
structurées `Restaurant` sont écrits **en dur dans `index.html`**. C'est
volontaire : Facebook, WhatsApp, LinkedIn et Slack lisent le HTML brut sans
exécuter le JavaScript, donc des balises injectées par React ne leur
parviendraient jamais.

`src/components/SEO.tsx` complète ces balises par page, pour les moteurs de
recherche qui exécutent le JavaScript. **Limite connue** : les aperçus de
partage restent identiques quelle que soit la page partagée. Pour un aperçu
spécifique par page, il faut un prérendu au build — `vite-plugin-ssg`, ou
l'option « Prerendering » de Netlify.

Le JSON-LD ne contient volontairement **pas** d'`aggregateRating` : Google
déconseille les notes auto-déclarées sur sa propre fiche et sanctionne l'usage.

## Organisation

```
index.html              balises statiques, données structurées
src/
  App.tsx               routes FR (/) et EN (/en)
  i18n/                 mécanisme de traduction + dictionnaire anglais
  lib/restaurant.ts     coordonnées, horaires, identifiant de réservation
  lib/booking.ts        chargement et ouverture du module de réservation
  lib/dockWidget.ts     ancrage du module dans le flux de la page
  lib/consent.ts        consentement cookies
  pages/                une page par route (dont Legal, Privacy, Terms)
  components/layout/    Navbar, Footer, Layout, bouton Réserver
  components/ui/        composants d'interface réellement utilisés
  assets/               visuels importés par le code
public/
  chefs/ logos/         photos et logos
  og-image.jpg          image des aperçus de partage (1200×630)
  robots.txt sitemap.xml
docs/                   briefs et textes source du projet
```

## Performance

Le JavaScript est découpé pour alléger le premier affichage :

- chaque page est un fichier séparé, téléchargé seulement quand le visiteur
  s'y rend (`lazy()` dans `App.tsx`) ;
- React et Framer Motion ont leurs propres fichiers, gardés en cache d'une
  mise en ligne à l'autre (`manualChunks` dans `vite.config.ts`) ;
- la page Contact isole `react-hook-form` et `zod` (~28 ko compressés) : ils
  ne pèsent plus sur l'accueil.

Premier chargement : environ 162 ko compressés, contre 209 ko en un seul
fichier auparavant.

## Pages légales

Trois documents, repris **à l'identique** de ceux fournis par le restaurant :

| Page              | Route               |
| ----------------- | ------------------- |
| Conditions Générales | `/cgu`           |
| RGPD              | `/rgpd`             |
| Mentions légales  | `/mentions-legales` |

Les textes vivent dans `src/content/legal.ts`, en données structurées, et sont
rendus par un composant unique. **Ne rien reformuler ici** : ce sont des
documents opposables ; toute modification doit venir du restaurant ou de son
conseil.

Ils restent en français dans les deux versions du site — traduire un document
juridique en changerait la portée, et la version française fait foi. Un
avertissement s'affiche en anglais.

## Ce qui reste à faire

### Bloquant pour la mise en ligne

- **Incohérences dans les textes fournis** — à faire trancher par le restaurant
  avant mise en ligne :
  - la raison sociale est écrite `SARL FG2M` dans les conditions générales et
    `SARL F2GM` dans les mentions légales ;
  - le domaine est `laitthymsel.com` dans les trois documents, alors que le
    courriel de contact est en `.fr` ; `SITE_URL` (`src/lib/restaurant.ts`),
    `index.html` et `public/sitemap.xml` pointent vers `www.laitthymsel.fr` ;
  - le téléphone est le fixe `02 41 27 20 40` dans les documents, le mobile
    `07 89 65 89 07` sur le site.
- **Hébergeur** : les mentions légales déclarent WEBO-FACTO, qui héberge le
  site WordPress actuel. À corriger dès que le nouvel hébergeur est choisi,
  c'est une mention obligatoire.
- **Créateur du site** : les mentions légales créditent l'Agence Creanova. À
  mettre à jour au moment de la reprise.
- **Médiateur de la consommation** : toujours absent des trois documents. Son
  adhésion est obligatoire pour un restaurant qui vend en ligne.
- **Module de réservation** : l'ouverture et l'ancrage dans la page n'ont pas
  pu être testés en conditions réelles. À vérifier avant toute démonstration.

### Photos

- `public/chefs/exterior.webp` ne fait que 49×49 px : inutilisable. La bande
  photo de la page À propos utilise `ambiance1.webp` en attendant une vraie
  photo de façade.
- Les pages Accueil, Menus et Services utilisent encore les visuels
  temporaires de `src/assets/` (hero, dish1, wine), générés et non
  photographiés. `public/chefs/` contient les vraies photos.
- Aucune image n'est déclinée en plusieurs tailles (`srcset`). Sur mobile,
  `fanny-gaetan.webp` est téléchargée en 1707×2560 pour être affichée bien
  plus petit.

### Reste ouvert

- **Prérendu** : les aperçus de partage sont corrects mais identiques pour
  toutes les pages. Un aperçu par page demande `vite-plugin-ssg` ou l'option
  de prérendu de l'hébergeur.
- **Mesure d'audience** : le consentement est en place, mais aucun outil n'est
  branché derrière.
- **Édition du contenu** : changer un menu ou un prix demande aujourd'hui de
  modifier le code. Leur WordPress actuel leur permet de le faire seuls.
#   l a i t t h y m s e l 
 
 #   l t s  
 