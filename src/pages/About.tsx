import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLang } from "@/i18n";
import { cn } from "@/lib/utils";

/* Les neuf images de la galerie éditoriale ci-dessous. */
const GALLERY_TILES = [
  {
    src: "/photos/cuisine-verriere.webp",
    w: 2000,
    alt: "La cuisine ouverte sous verrière",
    caption: "La cuisine",
  },
  {
    src: "/photos/fanny-gaetan-cuisine.webp",
    w: 1260,
    alt: "Fanny et Gaëtan en cuisine",
    caption: "En cuisine",
  },
  {
    src: "/photos/st-jacques.webp",
    w: 1026,
    alt: "Noix de Saint-Jacques, émulsion herbacée",
    caption: "Les assiettes",
  },
  {
    src: "/photos/salle-soir.webp",
    w: 1600,
    alt: "La salle à la tombée du soir",
    caption: "La maison",
  },
  {
    src: "/photos/equipe.webp",
    w: 1260,
    alt: "La brigade de Lait Thym Sel en cuisine",
    caption: "L'équipe",
  },
  {
    src: "/photos/bol-pied.webp",
    w: 1200,
    alt: "Mousseline et herbes fraîches, dressée en salle",
    caption: "Le dressage",
  },
  {
    src: "/photos/plat-huitre.webp",
    w: 900,
    alt: "Huître, perles de betterave",
    caption: "Les assiettes",
  },
  {
    src: "/photos/bar.webp",
    w: 1200,
    alt: "Le bar et sa verrerie",
    caption: "Le service",
  },
  {
    src: "/photos/dessert-poire.webp",
    w: 1176,
    alt: "Dessert à la poire, dressage minute",
    caption: "La pâtisserie",
  },
  {
    src: "/photos/plat-sauce.webp",
    w: 1500,
    alt: "Dressage d'une assiette",
    caption: "Les détails",
  },
  {
    src: "/photos/salle-vitrail.webp",
    w: 1600,
    alt: "La salle et son vitrail",
    caption: "La maison",
  },
  {
    src: "/photos/mangue.webp",
    w: 1400,
    alt: "Mangue, fruit de la passion",
    caption: "Les détails",
  },
] as const;


export default function About() {
  const { t, path } = useLang();
  return (
    <Layout>
      <SEO
        title={t("Notre Histoire — LAIT THYM SEL | Restaurant Angers")}
        description={t(
          "Découvrez l'histoire de Fanny et Gaëtan Morvan, le duo derrière Lait Thym Sel, restaurant gastronomique à Angers. Une cuisine droite, exigeante et honnête.",
        )}
      />

      {/* ── Hero ────────────────────────────────────────────────
          Une image, un nom, rien d'autre. Les volets à onglets qui
          occupaient cette place empilaient trois blocs de texte que
          personne ne lit debout devant une photo pleine page : le
          récit est déjà développé dans les sections qui suivent.

          Le <h1> est ici visible et non plus masqué : il n'y a plus de
          titre concurrent à l'écran. */}
      <section data-nav-theme="dark" className="hero-grain relative h-[100svh] min-h-[560px] overflow-hidden bg-foreground">
        <img
          /* La photo doit montrer le lieu ACTUEL (rue Boisnet).
             `salle-tables-verres.webp` est l'ancienne salle de la
             Doutre — rideaux jaunes, mur de schiste — quittée fin
             2023 : à ne pas remettre ici. Elle était de plus en
             870x400, trop peu pour un plein écran. */
          src="/photos/salle-vitrail.webp"
          srcSet="/photos/salle-vitrail-480.webp 480w, /photos/salle-vitrail-960.webp 960w, /photos/salle-vitrail.webp 1600w"
          sizes="100vw"
          alt={t("Table dressée devant le vitrail, Lait Thym Sel")}
          width={1600}
          height={1067}
          fetchPriority="high"
          /* object-position calé en haut : sur un écran très haut, le
             recadrage doit rogner le sol plutôt que les visages. */
          className="absolute inset-0 h-full w-full object-cover object-[center_45%] [filter:contrast(1.08)_saturate(1.08)]"
        />
        {/* Voile dégradé du bas vers le haut — même grammaire que le
            hero d'accueil, maintenant que le titre est lui aussi calé
            en bas à gauche plutôt qu'au centre du cadre. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,14,10,0.85) 0%, rgba(20,14,10,0.55) 32%, rgba(20,14,10,0.22) 62%, rgba(20,14,10,0.08) 100%)',
          }}
        />
        <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-16 pt-20 text-left text-background md:px-16 md:pb-20 lg:px-20">
          <span className="text-[11px] uppercase tracking-[0.45em] text-background/70">
            {t("Notre histoire")}
          </span>
          <h1 className="mt-4 font-serif text-4xl leading-[1.05] md:text-6xl">
            {t("Deux cuisiniers,")}
            <br />
            {t("une maison.")}
          </h1>
        </div>
      </section>

      {/* La section Distinctions qui figurait ici a été retirée : elle
          fait doublon avec celle de l'accueil, désormais placée juste
          après le hero — la reconnaissance de la maison s'affiche
          donc dès la première page qu'on visite, pas une seconde fois
          sur celle-ci. */}

      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center max-w-5xl mx-auto">
            {/* Photo duo */}
            <div className="w-full md:w-5/12 shrink-0">
              <div className="photo-breathe aspect-[2/3] overflow-hidden">
                <img
                  src="/photos/equipe.webp"
                  alt={t("La brigade de Lait Thym Sel en cuisine")}
                  className="reveal-photo w-full h-full object-cover object-top"
                />
              </div>
            </div>
            {/* Texte */}
            <div className="scroll-fade relative w-full md:w-7/12 space-y-6 md:pl-10">
              <div
                className="rule-drop absolute left-0 top-1 hidden h-[calc(100%-0.5rem)] w-px bg-brand/45 md:block"
                style={{ ["--reveal-delay" as string]: "260ms" }}
              />
              <h2
                className="reveal-slide font-serif text-3xl md:text-4xl text-foreground leading-snug"
                style={{ ["--reveal-delay" as string]: "80ms" }}
              >
                {t("Un lieu qui nous ressemble davantage")}
              </h2>
              <p
                className="reveal-slide text-muted-foreground leading-relaxed text-lg"
                style={{ ["--reveal-delay" as string]: "220ms" }}
              >
                {t("Après six années passées dans le quartier historique de la Doutre à Angers, nous avons choisi de franchir la Maine en décembre 2023, pour ouvrir un nouveau lieu — un lieu qui nous ressemble davantage.")}
              </p>
              <p
                className="reveal-slide text-muted-foreground leading-relaxed"
                style={{ ["--reveal-delay" as string]: "340ms" }}
              >
                {t("En septembre 2025, un an et demi après notre installation, un dégât des eaux est venu tout arrêter. Ce coup d'arrêt brutal aurait pu nous abattre. Il nous a, au contraire, obligés à nous recentrer, à repenser notre organisation, et à renforcer l'identité de notre maison.")}
              </p>
              <p
                className="reveal-slide text-muted-foreground leading-relaxed"
                style={{ ["--reveal-delay" as string]: "460ms" }}
              >
                {t("Notre nouvelle maison, une élégante bâtisse en brique, a été transformée avec une attention redoublée. Chaque détail, chaque espace, chaque atmosphère reflète désormais pleinement notre personnalité et notre vision.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lait · Thym · Sel ── */}
      <section className="py-14 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="scroll-fade max-w-3xl mx-auto text-center space-y-10">
            <h2 className="reveal-fade font-serif text-3xl md:text-5xl text-foreground">
              {t("Lait · Thym · Sel")}
            </h2>
            <p
              className="reveal-fade text-muted-foreground"
              style={{ ["--reveal-delay" as string]: "120ms" }}
            >
              {t("Bien plus qu'un nom, Lait Thym Sel résume notre cuisine en trois mots.")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 text-left mt-14">
              {[
                { mot: "Lait",  def: "La gourmandise, la douceur, le réconfort.", num: "01" },
                { mot: "Thym",  def: "La créativité, le caractère, l'élan aromatique.", num: "02" },
                { mot: "Sel",   def: "Le brut, le minéral, la concentration des saveurs.", num: "03" },
              ].map((item, i) => (
                <div
                  key={item.mot}
                  className="reveal-slide relative border-t border-brand/45 pt-7"
                  style={{ ["--reveal-delay" as string]: `${220 + i * 170}ms` }}
                >
                  {/* Le chiffre passe d'une petite capitale grise à une
                      numérotation servant de repère visuel : c'est lui
                      qui donne son rythme à la triade. Il grandit en
                      apparaissant, légèrement après son bloc, ce qui
                      appuie la scansion 01 · 02 · 03. */}
                  <span
                    className="reveal-scale font-serif text-4xl leading-none text-brand/40 block mb-4"
                    style={{ ["--reveal-delay" as string]: `${340 + i * 170}ms` }}
                  >
                    {item.num}
                  </span>
                  <h3 className="font-serif text-2xl text-foreground mb-3 tracking-wide">
                    {t(item.mot)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(item.def)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bande photo plein-format ── */}
      <div className="h-[52vh] min-h-[300px] w-full overflow-hidden relative">
        <img
          /* Photo fournie pour cette bande : le plat aux pousses et
             pétales de fleurs comestibles — plus caractéristique du
             travail de dressage de la maison que le précédent cliché
             d'huître. Le voile sombre superposé ci-dessous garantit
             la lisibilité du texte blanc quel que soit le cliché
             utilisé ici. */
          src="/photos/assiette-petales.webp"
          srcSet="/photos/assiette-petales-480.webp 480w, /photos/assiette-petales-960.webp 960w, /photos/assiette-petales.webp 1100w"
          sizes="100vw"
          alt={t("Assiette signature de Lait Thym Sel, pousses et fleurs comestibles")}
          width={1100}
          height={1100}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(20,14,10,0.4) 0%, rgba(20,14,10,0) 75%)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="reveal-fade font-serif text-white text-xl md:text-3xl italic text-center px-6"
            style={{ textShadow: '0 2px 18px rgba(0,0,0,0.55)' }}
          >
            {t("\"Aujourd'hui, nous revenons avec un lieu plus personnel,")}
            <br className="hidden md:block" /> {t("plus intime, plus exclusif.\"")}
          </p>
        </div>
      </div>

      {/* ── Fanny & Gaëtan ────────────────────────────────────────────
          Un seul portrait de duo — plus fidèle à la réalité du binôme
          que deux photos individuelles côte à côte — accompagné de
          deux entrées courtes. La photo porte elle-même la mention
          Michelin 2019 brodée sur les vestes : superflu de la répéter
          ici, la section Distinctions de l'accueil fait déjà ce travail.

          Mise en page pensée mobile d'abord : la photo, pleine
          largeur, ouvre la section — c'est elle qui accroche l'œil en
          premier sur un petit écran — puis les deux bios se lisent
          l'une sous l'autre, séparées par un simple filet. */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mx-auto mb-14 max-w-2xl text-center space-y-4">
            <span className="reveal-fade block font-sans text-[11px] uppercase tracking-[0.4em] text-brand">
              {t("En cuisine")}
            </span>
            <h2
              className="reveal-fade font-serif text-3xl md:text-4xl text-foreground"
              style={{ ["--reveal-delay" as string]: "100ms" }}
            >
              {t("Fanny & Gaëtan")}
            </h2>
            <p
              className="reveal-fade text-muted-foreground leading-relaxed"
              style={{ ["--reveal-delay" as string]: "180ms" }}
            >
              {t("Deux parcours, deux sensibilités, un même niveau d'exigence — une maison construite à quatre mains.")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-14 md:items-center">
            {/* Portrait du duo */}
            <div className="mx-auto w-full max-w-sm md:max-w-none">
              <div
                className="reveal-mask-left overflow-hidden"
                style={{ aspectRatio: "1080 / 1470" }}
              >
                <img
                  src="/chefs/fanny-gaetan.webp"
                  srcSet="/chefs/fanny-gaetan-480.webp 480w, /chefs/fanny-gaetan.webp 1080w"
                  sizes="(max-width: 767px) 88vw, 42vw"
                  alt={t("Fanny et Gaëtan Morvan, chefs de Lait Thym Sel, distingués par le Guide Michelin en 2019")}
                  width={1080}
                  height={1470}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Deux entrées courtes */}
            <div className="space-y-10">
              <div className="border-l-2 border-brand/60 pl-6 space-y-2">
                <span className="reveal-fade block font-sans text-[10px] uppercase tracking-[0.35em] text-brand">
                  {t("Pâtisserie & Salle")}
                </span>
                <h3 className="reveal-fade font-serif text-2xl text-foreground">
                  {t("Fanny Morvan")}
                </h3>
                <p className="reveal-fade text-muted-foreground leading-relaxed">
                  {t("Née à Annecy, Fanny se forme entre Bonneville, Grenoble et Nice, puis s'ouvre au monde — Angleterre, Saint-Barthélemy, Courchevel. De cette itinérance naît une personnalité ambitieuse, précise, portée par un sens aigu du détail et du goût.")}
                </p>
              </div>

              <div className="h-px bg-border/60" />

              <div className="border-l-2 border-brand/60 pl-6 space-y-2">
                <span className="reveal-fade block font-sans text-[10px] uppercase tracking-[0.35em] text-brand">
                  {t("Chef")}
                </span>
                <h3 className="reveal-fade font-serif text-2xl text-foreground">
                  {t("Gaëtan Morvan")}
                </h3>
                <p className="reveal-fade text-muted-foreground leading-relaxed">
                  {t("Né à Angers, Gaëtan entre en cuisine à 15 ans, formé par Michel Guérard puis Alain Ducasse au Louis XV, avant Laurent Saudeau et le SaQuaNa à Honfleur. Une cuisine droite, exigeante et honnête, reconnue par le Guide Michelin depuis 2019.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Frise chronologique ──────────────────────────────────────
          Le récit de la rencontre et des grandes étapes de la maison,
          jusque-là noyé dans un long paragraphe, devient une frise
          repérable au premier coup d'œil. Un seul rail vertical, des
          jalons espacés régulièrement — la même lecture, mobile ou
          bureau, plutôt qu'une bascule horizontale/verticale délicate
          à maintenir.

          Polish : le rail plein d'origine (`border-l`) devient un
          dégradé qui s'estompe à ses deux extrémités plutôt que de
          s'arrêter net ; chaque jalon gagne un anneau fin autour du
          point, détaché du rail par une fine marge de la couleur du
          fond — un « punch » discret qui sépare visuellement le
          marqueur de la ligne plutôt que de l'y noyer. Un léger halo
          radial en fond de section ajoute de la profondeur sans
          concurrencer le texte. */}
      <section data-nav-theme="dark" className="relative overflow-hidden py-24 md:py-32 bg-foreground text-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 45% at 50% 0%, hsl(25 40% 22% / 0.55) 0%, transparent 65%)',
          }}
        />
        <div className="container relative mx-auto px-4 max-w-3xl">
          <div className="mb-16 text-center space-y-4 md:mb-20">
            <span className="reveal-fade block text-[11px] uppercase tracking-[0.4em] text-background/55">
              {t("Depuis 2017")}
            </span>
            <h2
              className="reveal-fade font-serif text-3xl md:text-5xl"
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              {t("Notre histoire")}
            </h2>
            <div
              className="title-line title-line--center w-8 h-px bg-brand/80 mx-auto"
              style={{ ["--reveal-delay" as string]: "160ms" }}
            />
          </div>

          <ol className="relative space-y-20 pl-9 md:space-y-28 md:pl-14">
            {/* Rail en dégradé : invisible aux deux bouts, pleinement
                visible au centre — plus délicat qu'un trait plein qui
                s'arrête net. */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-1 bottom-1 w-px"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, hsl(var(--background) / 0.22) 12%, hsl(var(--background) / 0.22) 88%, transparent)',
              }}
            />
            {[
              {
                date: "Shanghai",
                title: "La rencontre",
                text: "Entre Fanny et Gaëtan, la connexion est immédiate : exigence, curiosité, envie de ne jamais faire les choses à moitié. Ensemble, ils quittent tout pour participer à l'ouverture du restaurant d'un chef étoilé.",
              },
              {
                date: "2017",
                title: "Ouverture",
                text: "De retour en France, portés par cette aventure, ils ouvrent leur propre maison à Angers : Lait Thym Sel voit le jour, dans le quartier historique de la Doutre.",
              },
              {
                date: "2023",
                title: "Nouvelle maison",
                text: "Après six années dans la Doutre, ils franchissent la Maine pour ouvrir un lieu qui leur ressemble davantage — une élégante bâtisse en brique, rue Boisnet.",
              },
              {
                date: "2025",
                title: "Coup d'arrêt",
                text: "Un an et demi après l'installation, un dégât des eaux interrompt tout. Ce coup d'arrêt brutal les oblige à se recentrer et à renforcer l'identité de leur maison.",
              },
              {
                date: "Aujourd'hui",
                title: "Le duo, pleinement",
                text: "Fanny et Gaëtan reprennent leur duo en cuisine, côte à côte, plus soudés que jamais — une continuité naturelle pour une maison construite à quatre mains.",
              },
            ].map((step, i) => (
              <li
                key={step.date}
                className="reveal-fade relative"
                style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}
              >
                <span
                  className="absolute -left-[42px] top-[7px] flex h-[7px] w-[7px] items-center justify-center md:-left-[63px]"
                  aria-hidden="true"
                >
                  {/* Anneau large et fin + point réduit : le marqueur
                      respire au lieu de faire une grosse pastille. Le
                      halo de la couleur du fond le détache du rail
                      sans qu'on ait à interrompre celui-ci. */}
                  <span className="absolute -inset-[9px] rounded-full border border-brand/30" />
                  <span
                    className="relative h-[7px] w-[7px] rounded-full bg-brand"
                    style={{ boxShadow: "0 0 0 6px hsl(20 14% 10%)" }}
                  />
                </span>
                {/* Hiérarchie inversée par rapport à la version
                    précédente : la DATE devient l'élément dominant, en
                    grande serif terracotta, et le titre passe en petites
                    capitales au-dessus.

                    C'est ce qui distingue une frise d'une simple liste :
                    l'œil descend le long des dates et saisit la durée du
                    parcours d'un seul regard, avant même de lire. Dans
                    l'ordre inverse — titre en grand, date en petit — on
                    lisait cinq paragraphes sans percevoir le temps qui
                    passe.

                    `tabular-nums` aligne les chiffres sur une même
                    largeur, pour que les dates se superposent
                    exactement d'un jalon à l'autre. */}
                <span className="block text-[10px] uppercase tracking-[0.4em] text-background/45">
                  {t(step.title)}
                </span>
                <p className="mt-3 font-serif text-4xl leading-none tabular-nums text-brand md:text-5xl">
                  {t(step.date)}
                </p>
                <p className="mt-5 max-w-xl leading-relaxed text-background/70">
                  {t(step.text)}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-20 text-center">
            <Button
              size="lg"
              variant="outline"
              className="reveal-fade h-14 px-10 uppercase tracking-widest rounded-none border-background/30 text-background hover:bg-background hover:text-foreground text-sm"
              asChild
              data-testid="link-about-contact"
            >
              <Link href={path("/reservation")}>{t("Réserver votre table")}</Link>
            </Button>
          </div>
        </div>
      </section>


      {/* ── Galerie éditoriale ───────────────────────────────────────
          Une grille à trois colonnes, sans photo d'ouverture qui
          écrase les autres — inspirée de la galerie du gabarit
          Framer de référence, où neuf cadrages de proportions
          mêlées (portrait, carré, paysage) se répartissent en
          colonnes libres plutôt qu'autour d'une image vedette
          unique. Les fichiers gardent leur hauteur native : aucune
          assiette ni aucun portrait n'est coupé pour entrer dans une
          case artificielle. */}
      <section id="galerie" className="bg-background py-16 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-8 max-w-5xl border-b border-border/60 pb-5 text-center md:mb-12">
            <span className="text-[11px] uppercase tracking-[0.4em] text-brand">
              {t("Galerie")}
            </span>
          </div>

          {/* Grille 3 + 2 : trois images sur la première ligne, deux
              sur la seconde dont la dernière étirée sur deux colonnes —
              reprise exacte de la maquette fournie, plutôt que la
              mosaïque à neuf images précédente. */}
          <div className="mx-auto grid max-w-5xl grid-cols-3 gap-3 md:gap-4">
            {GALLERY_TILES.slice(0, 5).map((img, i) => (
              <figure
                key={img.src}
                className={cn('group', i === 4 && 'col-span-2')}
              >
                <div
                  className={cn(
                    'gallery-tile photo-breathe relative block w-full overflow-hidden bg-muted/30',
                    i < 3 ? 'aspect-[3/4]' : i === 3 ? 'aspect-[4/3]' : 'aspect-[21/9]',
                  )}
                  data-testid={`gallery-tile-${i}`}
                >
                  <img
                    src={img.src}
                    srcSet={[480, 960]
                      .filter((w) => w <= img.w)
                      .map((w) => `${img.src.replace('.webp', `-${w}.webp`)} ${w}w`)
                      .concat(`${img.src} ${img.w}w`)
                      .join(', ')}
                    sizes="(max-width: 639px) 46vw, (max-width: 1023px) 31vw, 368px"
                    alt={t(img.alt)}
                    loading={i < 3 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : undefined}
                    decoding="async"
                    style={{ ['--reveal-delay' as string]: `${(i % 3) * 120}ms` }}
                    className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="gallery-tile__glow" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}