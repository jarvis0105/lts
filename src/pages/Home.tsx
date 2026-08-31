import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'wouter';
import { Gift, Instagram, Phone } from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Sparkles } from '@/components/Sparkles';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { Button } from '@/components/ui/button';
import { useConsent } from '@/components/CookieBanner';
import { useLang } from '@/i18n';
import { openBooking } from '@/lib/booking';
import { RESTAURANT } from '@/lib/restaurant';
import { MENUS_APERCU, REVIEWS_APERCU } from '@/lib/content';
import { useLightParallax } from '@/hooks/useLightParallax';



/* Extraits d'avis Google réels, repris de src/pages/Reviews.tsx. */
const AVIS_APERCU = [
  'Le restaurant est très intimiste, peu de tables et lumière tamisée ce qui donne une atmosphère très plaisante.',
  'Tout était parfait, de l’apéritif au dessert.',
];

/* Avis mis en scène en grande citation centrée, section « Avis » de
   la page d'accueil — voir plus bas. Le texte le plus long des avis
   mis en avant : sur toute la largeur, il se déploie sur environ six
   lignes plutôt que deux ou trois. */
const reviewMiseEnAvant =
  REVIEWS_APERCU.find((r) => r.category === 'Service & Émotion') ?? REVIEWS_APERCU[0];

/* Titre du hero, révélé mot par mot : chaque mot vit dans sa propre
   fenêtre masquée (`.hero-title__mask`, overflow caché) et glisse
   depuis le bas avec un délai qui augmente d'un mot à l'autre — le
   compteur `wordIndex` reste continu d'une ligne à l'autre, pour que
   le regard suive une seule vague de gauche à droite puis de haut en
   bas, plutôt que deux vagues qui repartiraient chacune de zéro.

   Le nombre de mots par ligne diffère selon la langue (« L'Élégance »
   est un seul mot, « The Elegance » en compte deux) : compter dans le
   composant plutôt que coder un index en dur dans l'appelant est ce
   qui permet à l'anglais de garder le même effet que le français. */
function HeroTitle({ lines }: { lines: string[] }) {
  let wordIndex = 0;
  return (
    <>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').flatMap((word, wi, arr) => {
            const delay = (wordIndex++ * 0.09).toFixed(2);
            const span = (
              <span className="hero-title__mask" key={`${li}-${wi}`}>
                <span
                  className="hero-title__word"
                  style={{ '--word-delay': `${delay}s` } as CSSProperties}
                >
                  {word}
                </span>
              </span>
            );
            return wi < arr.length - 1 ? [span, ' '] : [span];
          })}
        </span>
      ))}
    </>
  );
}

export default function Home() {
  const { t, path } = useLang();
  const consent = useConsent();
  const [opening, setOpening] = useState(false);
  /* 16px : au milieu de la fourchette 10–20px demandée. */
  const productParallaxRef = useLightParallax<HTMLDivElement>(16);

  const reserve = async () => {
    setOpening(true);
    try {
      await openBooking({}, consent.measurement);
    } finally {
      setOpening(false);
    }
  };

  return (
    <Layout>
      <SEO
        title={t('LAIT THYM SEL — Restaurant gastronomique à Angers')}
        description={t(
          'Restaurant gastronomique étoilé à Angers, par Fanny et Gaëtan Morvan. Cuisine de saison, produits d’exception. Réservez votre table.',
        )}
        canonicalPath="/"
      />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section
        /* Hero plein écran (100svh) : la photo occupe tout le viewport
           à l'arrivée sur la page. */
        data-nav-theme="dark"
        className="hero-grain relative h-[100svh] min-h-[440px] flex items-center justify-start overflow-hidden"
      >
        <div className="absolute inset-0 z-0 bg-foreground">
          {/* Diaporama en fondu entre plusieurs photos de plats —
              voir src/components/HeroSlideshow.tsx. */}
          <HeroSlideshow
            primaryAlt={t('Salle du restaurant Lait Thym Sel dressée pour un dîner, à Angers')}
          />
        </div>

          {/* Unique <h1> de la page : c'est lui que les moteurs lisent
              en premier pour comprendre de quoi parle le site.

              Révélé mot par mot (voir `HeroTitleLine` plus bas) plutôt
              qu'en un seul bloc : chaque mot glisse depuis sa propre
              fenêtre masquée, avec un léger décalage — un principe
              repris d'un gabarit de référence où le H1 est découpé en
              mots individuels plutôt qu'en texte plein. */}

        {/* Conteneur principal du texte - pt-32 au lieu de py-20 pour descendre le texte */}
        <div
          className="relative z-10 flex w-full max-w-4xl flex-col items-start px-6 pt-32 pb-20 text-left md:px-16 lg:px-20"
        >
          {/* Kicker : petite étiquette au-dessus du titre — largeur
              libre (fill), hauteur au contenu (une seule ligne). */}
          <span className="reveal-fade block text-[10px] uppercase tracking-[0.4em] text-white/70">
            {t('Restaurant gastronomique · Angers')}
          </span>

          {/* Titre affiné : une taille sous celle d'avant à chaque
              palier — un rendu plus discret, plus proche d'une carte
              de visite que d'une affiche. */}
          <h1 className="mt-4 max-w-[780px] font-serif text-2xl md:text-3xl lg:text-4xl tracking-tight text-white leading-[1.05]">
            <HeroTitle lines={[t('L’Élégance'), t('de la Simplicité')]} />
          </h1>

          {/* Sous-titre : accroche courte, largeur contrainte pour
              rester lisible sur une à deux lignes. */}
          <p className="reveal-fade mt-5 max-w-[580px] text-sm md:text-base text-white/80 leading-relaxed">
            {t('Cuisine de saison, produits d’exception, atmosphère intime.')}
          </p>
        </div>
      </section>

      {/* ── La cuisine ────────────────────────────────────────────
          Grande photographie du geste — la sauce versée à la cuillère —
          en parallaxe douce, face à un texte court. La section
          respire : une image, quatre phrases, un lien. */}
      <section id="decouvrir" className="py-16 md:py-32 bg-background reveal-section">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 md:flex-row-reverse md:gap-12 lg:gap-16">
            <div className="w-full md:w-[46%] shrink-0">
              {/* Effet de révélation dédié à cette image : flou/opacité/
                  échelle sur la photo elle-même, plus un voile qui se
                  retire de la gauche vers la droite (voir `.product-reveal`
                  dans index.css). Le parallaxe vertical (10–20px), lui,
                  vit sur ce conteneur via `useLightParallax` — un
                  mécanisme volontairement local, voir le commentaire du
                  hook.

                  Hauteur resserrée à 560px sur desktop (au lieu de
                  640px) : la photo garde sa présence sans dominer le
                  bloc de texte, désormais plus large en face
                  (`.product-reveal-media` couvre le conteneur en
                  `object-fit: cover`, donc le cadrage reste correct
                  quelle que soit la largeur réelle de la colonne). Le
                  ratio d'origine reste le comportement mobile, où une
                  hauteur figée en pixels serait disproportionnée sur un
                  écran étroit. */}
              <div
                ref={productParallaxRef}
                className="product-reveal aspect-[674/640] md:aspect-auto md:h-[560px]"
                style={{ ['--reveal-delay' as string]: '180ms' }}
              >
                <img
                  src="/photos/dessert-coquillage.webp"
                  srcSet="/photos/dessert-coquillage-480.webp 480w, /photos/dessert-coquillage.webp 500w"
                  sizes="(max-width: 767px) 92vw, 440px"
                  alt={t('Dessert en coquille Saint-Jacques, agrumes et sorbet, Lait Thym Sel')}
                  width={500}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="product-reveal-media"
                />
              </div>
            </div>
            <div className="w-full space-y-6 md:w-[54%]">
              <div className="lift" style={{ ['--reveal-delay' as string]: '100ms' }}>
                <h2 className="font-serif text-4xl uppercase tracking-tight text-foreground leading-tight lg:text-5xl">
                  {t('La Cuisine')}
                </h2>
              </div>
              <div
                className="title-line h-px w-10 bg-brand/70"
                style={{ ['--reveal-delay' as string]: '200ms' }}
              />
              <p
                className="reveal-fade text-lg text-muted-foreground leading-relaxed"
                style={{ ['--reveal-delay' as string]: '260ms' }}
              >
                {t('Une cuisine de produits, construite au rythme des saisons et des arrivages de nos producteurs, pour l’essentiel installés à quelques kilomètres d’Angers.')}
              </p>
              <p
                className="reveal-fade text-muted-foreground leading-relaxed"
                style={{ ['--reveal-delay' as string]: '340ms' }}
              >
                {t('Chaque assiette recherche la précision du geste et la netteté du goût : peu d’éléments, des cuissons justes, une créativité au service du produit.')}
              </p>
              <Button
                variant="outline"
                className="reveal-fade mt-2 h-12 rounded-none border-foreground/20 px-8 uppercase tracking-widest"
                style={{ ['--reveal-delay' as string]: '420ms' }}
                asChild
                data-testid="link-home-cuisine"
              >
                <Link href={path('/menus')}>{t('Découvrir notre cuisine')} →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── La maison ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-32 bg-background reveal-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16 max-w-5xl mx-auto">
            <div className="w-full md:w-[44%] shrink-0">
              {/* Une seule photo, pleine — le second cliché en
                  chevauchement (repris du gabarit Framer de référence)
                  a été retiré : il faisait de cette photo une
                  composition à déchiffrer plutôt qu'un simple portrait
                  des deux chefs. Colonne resserrée à 44 % (au lieu de
                  52 %) pour que le texte, en face, prenne davantage de
                  largeur — la photo garde sa présence sans dominer le
                  récit qui l'accompagne. */}
              <div className="photo-breathe reveal-mask home-photo-reveal aspect-[2/3] overflow-hidden max-w-[380px] mx-auto md:max-w-none">
                <img
                  src="/chefs/fanny-gaetan.webp"
                  alt={t('Fanny et Gaëtan Morvan, chefs de Lait Thym Sel')}
                  loading="lazy"
                  className="home-photo-media w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div className="scroll-fade relative w-full md:w-[56%] space-y-6 md:pl-10">
              {/* Filet vertical qui se déploie du haut vers le bas au
                  moment où la section entre dans le champ : il relie
                  visuellement la photo au texte. */}
              <div
                className="rule-drop absolute left-0 top-1 hidden h-[calc(100%-0.5rem)] w-px bg-brand/45 md:block"
                style={{ ['--reveal-delay' as string]: '250ms' }}
              />
              <span
                className="reveal-slide block text-[11px] uppercase tracking-[0.35em] text-brand"
                style={{ ['--reveal-delay' as string]: '40ms' }}
              >
                {t('Notre histoire')}
              </span>
              <div className="lift" style={{ ['--reveal-delay' as string]: '100ms' }}>
                <h2 className="font-serif text-4xl lg:text-5xl text-foreground leading-tight">
                  {t('Deux cuisiniers,')}
                  <br />
                  {t('une maison.')}
                </h2>
              </div>
              <p
                className="reveal-slide text-lg text-muted-foreground leading-relaxed"
                style={{ ['--reveal-delay' as string]: '320ms' }}
              >
                {t(
                  'Fanny et Gaëtan Morvan se sont rencontrés dans les cuisines de grands établissements, avant de tout quitter pour ouvrir, en 2017, leur propre maison à Angers.',
                )}
              </p>
              <p
                className="reveal-slide text-muted-foreground leading-relaxed"
                style={{ ['--reveal-delay' as string]: '440ms' }}
              >
                {t(
                  'Lait, thym, sel — trois mots simples pour une cuisine droite, exigeante et honnête. Étoilée Michelin depuis 2019.',
                )}
              </p>
              <Button
                variant="outline"
                className="reveal-fade h-12 px-8 uppercase tracking-widest rounded-none border-foreground/20 mt-2"
                style={{ ['--reveal-delay' as string]: '480ms' }}
                asChild
                data-testid="link-home-about"
              >
                <Link href={path('/a-propos')}>{t('Découvrir la maison')} →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Aperçu de la carte ─────────────────────────────────────
          La page d'accueil ne menait ni vers /menus ni vers /avis : les
          deux informations que l'on cherche avant de réserver à ce
          niveau de prix. Cette section comble les deux à la fois et
          rompt la suite de blocs de texte centré qui suivait. */}
      <section className="relative py-16 md:py-32 bg-background reveal-section">
        <Sparkles className="opacity-70" />
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div
              className="reveal-fade md:flex md:items-end md:justify-between mb-12 gap-8"
              style={{ ['--reveal-delay' as string]: '0ms' }}
            >
              <div>
                <span className="mt-2 block text-[11px] uppercase tracking-[0.35em] text-brand">
                  {t('La carte')}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-3">
                  {t('Des menus en étincelles')}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md mt-4 md:mt-0">
                {t(
                  'De trois à neuf étincelles, un menu unique qui suit la saison et les arrivages de nos producteurs.',
                )}
              </p>
            </div>

            <ul className="border-t border-border/60">
              {MENUS_APERCU.map((m, i) => (
                <li
                  key={m.name}
                  /* Chaque ligne se dévoile à son tour, en glissant
                     depuis la gauche : la carte se « lit » de haut en
                     bas au lieu d'apparaître d'un seul bloc. */
                  className="menu-row reveal-slide flex items-baseline gap-4 border-b border-border/60 px-2 py-5"
                  style={{ ['--reveal-delay' as string]: `${160 + i * 140}ms` }}
                >
                  <span className="font-serif text-brand-strong text-sm tabular-nums w-8 shrink-0">
                    {String(m.etincelles).padStart(2, '0')}
                  </span>
                  <span className="menu-row__name font-serif text-lg md:text-xl text-foreground flex-1">
                    {m.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
                    {t(m.service)}
                  </span>
                  <span className="font-serif text-lg text-foreground tabular-nums w-16 text-right">
                    {m.prix}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className="reveal-fade mt-10 flex flex-col sm:flex-row sm:items-center gap-6"
              style={{ ['--reveal-delay' as string]: '280ms' }}
            >
              <Button
                variant="outline"
                className="h-12 px-8 uppercase tracking-widest rounded-none border-foreground/20"
                asChild
                data-testid="link-home-menus"
              >
                <Link href={path('/menus')}>{t('Voir toute la carte')}</Link>
              </Button>
              <div className="flex-1 space-y-2">
                {AVIS_APERCU.map((a) => (
                  <p key={a} className="font-serif italic text-muted-foreground text-sm leading-relaxed">
                    {t('« ')}{t(a)}{t(' »')}
                  </p>
                ))}
                <Link
                  href={path('/avis')}
                  className="text-[11px] uppercase tracking-[0.2em] text-brand-strong underline underline-offset-4 inline-block"
                  data-testid="link-home-avis"
                >
                  {t('Lire les avis')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Avis ───────────────────────────────────────────────────
          Un seul avis, pas trois : une grande citation centrée plutôt
          qu'une grille de cartes. Mesure resserrée (max-w-2xl) pour une
          longueur de ligne plus confortable, et un CTA en bouton sobre
          plutôt qu'un lien souligné — cohérent avec le reste de la
          page et plus posé visuellement. */}
      <section className="py-20 md:py-32 bg-background reveal-section">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="reveal-fade block text-[11px] uppercase tracking-[0.35em] text-brand"
              style={{ ['--reveal-delay' as string]: '50ms' }}
            >
              {t('Avis')}
            </span>

            <blockquote
              className="reveal-fade mt-8 font-serif text-xl italic leading-relaxed text-foreground sm:text-2xl lg:leading-[1.6]"
              style={{ ['--reveal-delay' as string]: '150ms' }}
            >
              {t('« ')}{t(reviewMiseEnAvant.text)}{t(' »')}
            </blockquote>

            <div
              className="reveal-fade mt-10"
              style={{ ['--reveal-delay' as string]: '260ms' }}
            >
              <Button
                variant="outline"
                className="h-12 px-8 uppercase tracking-widest rounded-none border-foreground/20"
                asChild
                data-testid="link-home-reviews"
              >
                <Link href={path('/avis')}>{t('Lire tous les avis')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Réservation ────────────────────────────────────────────── */}
      <section data-nav-theme="dark" className="py-16 md:py-32 bg-foreground text-background text-center relative overflow-hidden reveal-section">
        {/* Emblème de la maison, en filigrane.

            Deux corrections par rapport aux versions précédentes.

            1. LA COULEUR. `logo-emblem.png` est un carré CRÈME OPAQUE
               portant des traits terracotta, sans aucune transparence.
               D'où le `invert` employé jusqu'ici : il noircissait le
               fond pour le fondre dans la section, mais retournait du
               même coup la couleur des traits — le terracotta de la
               maison virait au bleu-vert. `logo-emblem-mark.png` est
               une version détourée : fond réellement transparent,
               traits conservés dans leur teinte d'origine (183,146,115).
               Plus besoin d'inverser.

            2. LE CADRAGE. Une version l'avait décalé à droite, à cheval
               sur le bord : il s'y trouvait tranché en plein milieu de
               sa forme, ce qui se lit comme un défaut d'affichage et
               non comme un parti pris. Il revient donc au centre,
               ENTIÈREMENT visible et symétrique avec le texte, qui est
               lui aussi centré.

               Le risque du centrage — les traits qui croisent les
               lettres — est écarté par l'opacité (16 %) et par le
               fait que l'emblème est un dessin au trait, très ajouré :
               le texte passe dans ses vides.

            Une lueur chaude est posée derrière, en dégradé radial :
            elle décolle l'emblème du brun uni et donne de la
            profondeur au bloc, comme un halo de bougie.

            L'emblème ne dérive plus au défilement — il a porté un
            temps un mouvement inspiré du second mode de la
            bibliothèque de parallaxe du site de référence
            (`ParallaxMove`, `stage: true`), en pensant qu'ils
            l'utilisaient pour faire dériver des éléments de fond sur
            toute la hauteur de la page. Une archive plus complète de
            leur site, avec leur vraie feuille de style de production
            (`main.css`, absente des extractions précédentes), a
            montré que ce n'est pas le cas : aucun `data-parallax-*`
            nulle part dans leur HTML réel, aucune instance de
            `ParallaxMove` jamais créée sur leurs pages, et leur propre
            hero n'a lui-même aucun mouvement lié au scroll — une
            image à opacité fixe, un logo qui bascule en un
            interrupteur plutôt qu'un calcul continu. La bibliothèque
            existe chez eux, mais ne sert pas à ça sur le site réel.
            Le filigrane reste donc simplement fixe, centré derrière
            le titre. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 md:left-[82%]"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--brand) / 0.13) 0%, hsl(var(--brand) / 0.05) 45%, transparent 72%)',
            }}
          />
          <img
            src="/logos/logo-emblem-mark.png"
            alt=""
            aria-hidden="true"
            width={512}
            height={512}
            /* Centré sur mobile (place limitée), déplacé nettement vers la
               droite dès `md` : purement décoratif, en arrière-plan, sans
               jamais toucher au bloc de texte qui reste centré dans son
               propre conteneur `max-w-2xl`. Bornée par `max-w-[80vw]` pour
               ne pas déborder ni revenir se tronquer en bord d'écran. */
            className="absolute left-1/2 top-1/2 w-[420px] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.38] md:left-[82%] md:w-[460px]"
          />
        </div>
        <div className="scroll-fade container relative z-10 mx-auto px-4 max-w-2xl space-y-6">
          <h2
            className="reveal-fade font-serif text-4xl md:text-5xl"
            style={{ ['--reveal-delay' as string]: '110ms' }}
          >
            {t('Réservez votre table')}
          </h2>
          <div
            className="title-line title-line--center w-8 h-px bg-brand/70 mx-auto"
            style={{ ['--reveal-delay' as string]: '220ms' }}
          />
          <p
            className="reveal-fade font-serif italic text-background/65 text-lg leading-relaxed"
            style={{ ['--reveal-delay' as string]: '300ms' }}
          >
            {t(
              'Nos disponibilités s’affichent en temps réel : votre table est confirmée immédiatement.',
            )}
          </p>
          <div
            className="reveal-fade flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            style={{ ['--reveal-delay' as string]: '400ms' }}
          >
            <button
              onClick={reserve}
              disabled={opening}
              className="inline-flex items-center justify-center h-14 px-10 text-sm tracking-[0.25em] uppercase font-medium rounded-none bg-background text-foreground hover:bg-brand/10 transition-colors duration-300 w-full sm:w-auto cursor-pointer disabled:opacity-70"
              data-testid="btn-home-reserve"
            >
              {opening ? t('Ouverture…') : t('Réserver en ligne')}
            </button>
            <a
              href={RESTAURANT.phoneHref}
              className="inline-flex items-center justify-center h-14 px-10 text-sm tracking-[0.25em] uppercase font-medium rounded-none border border-background/20 text-background hover:bg-background hover:text-foreground transition-colors duration-300 w-full sm:w-auto"
              data-testid="link-reserve-call"
            >
              <Phone className="w-4 h-4 mr-2" />
              {RESTAURANT.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── Coffrets cadeaux ─────────────────────────────────────────
          Fond hachuré : des rayures à 45°, tracées en CSS pur
          (`repeating-linear-gradient`) plutôt qu'en image, donc sans
          un octet à télécharger et net à toutes les densités d'écran.

          Posées à 4 % d'opacité, elles ne se lisent pas comme un motif
          mais comme une texture de papier — juste assez pour que la
          section se détache des blocs voisins, qui sont en aplat.
          `currentColor` les fait hériter de la couleur du texte : elles
          s'accordent donc automatiquement au thème. */}
      <section className="py-16 md:py-32 bg-card relative overflow-hidden reveal-section">
        <div
          className="absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="scroll-fade max-w-2xl mx-auto text-center space-y-6">
            <div
              className="reveal-fade inline-flex items-center justify-center w-14 h-14 rounded-full border border-brand/40 mb-2"
              style={{ ['--reveal-delay' as string]: '0ms' }}
            >
              <Gift className="w-6 h-6 text-brand-strong" />
            </div>
            <h2
              className="reveal-fade font-serif text-3xl md:text-5xl text-foreground leading-snug"
              style={{ ['--reveal-delay' as string]: '110ms' }}
            >
              {t('Faites plaisir…')}
              <br />
              <span className="italic text-muted-foreground">
                {t('à ceux que vous aimez')}
              </span>
            </h2>
            <p
              className="reveal-fade text-muted-foreground leading-relaxed text-lg"
              style={{ ['--reveal-delay' as string]: '220ms' }}
            >
              {t(
                'Offrez une parenthèse gastronomique. Chèques et coffrets cadeaux sont disponibles sur notre boutique en ligne.',
              )}
            </p>
            <a
              href="https://laitthymsel.secretbox.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal-fade inline-flex h-14 items-center justify-center gap-3 bg-foreground px-10 text-[11px] uppercase tracking-[0.3em] text-background transition-colors duration-300 hover:bg-brand-strong"
              style={{ ['--reveal-delay' as string]: '330ms' }}
              data-testid="link-gift-shop"
            >
              <Gift className="h-4 w-4" strokeWidth={1.5} />
              {t('Notre boutique')}
            </a>
          </div>
        </div>
      </section>

      {/* ── Instagram ──────────────────────────────────────────────
          Quatre clichés en bandeau, dans l'esprit d'un mur d'Instagram
          éditorial — inspiré du principe vu chez des maisons comme
          Café de la Paix (bandeau photo + mention du compte), sans en
          reprendre la mise en page : ici pas de peinture d'archive, un
          eyebrow discret plutôt qu'un dégradé pastel, et le hashtag
          aligné à droite du titre plutôt que centré au-dessus. */}
      <section className="py-16 md:py-32 bg-background reveal-section">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 flex max-w-4xl flex-col items-center justify-between gap-3 text-center md:mb-12 md:flex-row md:text-left">
            <h2
              className="reveal-fade font-serif text-2xl text-foreground md:text-3xl"
              style={{ ['--reveal-delay' as string]: '0ms' }}
            >
              {t('Suivez-nous sur Instagram')}
            </h2>
            <a
              href={RESTAURANT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal-fade wake-color text-[11px] uppercase tracking-[0.3em] text-brand hover:text-brand-strong"
              style={{ ['--reveal-delay' as string]: '140ms' }}
              data-testid="link-instagram-hashtag"
            >
              @{RESTAURANT.instagramHandle}
            </a>
          </div>
          {/* Grille contenue dans `max-w-4xl` plutôt qu'étirée sur toute
              la largeur du conteneur : quatre vignettes plus petites,
              avec un écart RÉGULIER (`gap-5`/`gap-6`, identique partout)
              plutôt que le bandeau plein cadre et quasi sans air d'avant
              — inspiré de la grille Instagram de Café de la Paix. */}
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
            {[
              { src: '/photos/st-jacques.webp', alt: 'Noix de Saint-Jacques dressée en salle' },
              { src: '/photos/dessert-poire.webp', alt: 'Dessert à la poire, dressage minute' },
              { src: '/photos/salle-vitrail.webp', alt: 'La salle et son vitrail, en fin de service' },
              { src: '/photos/fanny-gaetan-cuisine.webp', alt: 'Fanny et Gaëtan en cuisine' },
            ].map((img, i) => (
              <a
                key={img.src}
                href={RESTAURANT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('Voir sur Instagram')}
                className="photo-breathe group relative block aspect-square overflow-hidden bg-muted/30"
              >
                <img
                  src={img.src}
                  alt={t(img.alt)}
                  loading="lazy"
                  decoding="async"
                  className="reveal-photo h-full w-full object-cover"
                  style={{ ['--reveal-delay' as string]: `${i * 130}ms` }}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-500 group-hover:bg-foreground/25 group-hover:opacity-100">
                  <Instagram className="h-5 w-5 text-background" strokeWidth={1.5} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

          </Layout>
  );
}
