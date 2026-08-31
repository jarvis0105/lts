import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Leaf, AlertCircle, GlassWater } from "lucide-react";
import { Sparkles } from "@/components/Sparkles";

import { useLang } from "@/i18n";
import { DEJEUNERS as dejeuners, DINERS as diners } from "@/lib/content";


function EtincellesDisplay({ count }: { count: number }) {
  const { t } = useLang();
  return (
    <span className="flex items-center gap-1" aria-label={t(`Menu en ${count} étincelles`)}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="inline-block w-1.5 h-1.5 rounded-full bg-brand/80" />
      ))}
      <span className="ml-2 text-xs uppercase tracking-widest text-muted-foreground font-sans">
        {t(count > 1 ? `${count} étincelles` : `${count} étincelle`)}
      </span>
    </span>
  );
}

function MenuCard({
  item,
  index,
  delay = 0,
}: {
  item: (typeof dejeuners)[0];
  index: number;
  delay?: number;
}) {
  const { t } = useLang();
  return (
    <div
      className="group premium-card reveal-fade border border-border/40 bg-card p-8 md:p-10 flex flex-col gap-5 hover:border-brand/40"
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
      data-testid={`menu-card-${index}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-serif text-2xl md:text-3xl text-foreground leading-snug">
          {t(item.name)}
        </h3>
        <span className="font-serif text-2xl md:text-3xl text-foreground shrink-0">
          {item.prix}
        </span>
      </div>

      <EtincellesDisplay count={item.etincelles} />

      <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
        {item.vegetarien && (
          <span className="inline-flex items-center gap-1.5 border border-brand/30 bg-brand/10 px-3 py-1 text-xs uppercase tracking-widest text-brand-strong">
            <Leaf className="w-3 h-3" />
            {t("Version végétarienne sur demande")}
          </span>
        )}
        {item.note && (
          <span className="text-xs text-muted-foreground italic">{t(item.note)}</span>
        )}
      </div>
    </div>
  );
}

export default function Menus() {
  const { t, path } = useLang();
  return (
    <Layout>
      <SEO
        title={t("Nos Menus — LAIT THYM SEL | Restaurant gastronomique Angers")}
        description={t(
          "Découvrez nos menus déjeuners et dîners : Mise en lumière, Le chant des flammes, Incandescence, Crépitement des étoiles, La danse du feu. Restaurant gastronomique à Angers.",
        )}
      />

      {/* Header */}
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 bg-background text-center">
        <Sparkles />
        <div className="container mx-auto px-4">
          <span
            className="reveal-fade inline-block text-[11px] uppercase tracking-[0.35em] text-brand mb-6"
            style={{ ['--reveal-delay' as string]: '0ms' }}
          >
            {t("Fanny & Gaëtan Morvan")}
          </span>
          <div className="lift" style={{ ['--reveal-delay' as string]: '100ms' }}>
            <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6">
              {t("Nos Menus")}
            </h1>
          </div>
          <div
            className="title-line title-line--center w-8 h-px bg-brand/80 mx-auto mb-8"
            style={{ ['--reveal-delay' as string]: '240ms' }}
          />
          <p
            className="reveal-fade font-serif text-lg md:text-xl text-muted-foreground max-w-xl mx-auto italic leading-relaxed"
            style={{ ['--reveal-delay' as string]: '320ms' }}
          >
            {t("Les Menus prennent vie au fil des saisons de nos producteurs et de nos inspirations.")}
          </p>
        </div>
      </section>

      {/* Image plein format */}
      <div className="w-full h-[35vh] overflow-hidden">
        <img
          src="/photos/st-jacques.webp"
          alt={t("Saint-Jacques, émulsion herbacée")}
          width={1026}
          height={1280}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Déjeuners */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="reveal-fade mb-14">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand font-sans">{t("Service du midi")}</span>
              <div className="h-px flex-1 bg-border/60" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground text-center mt-6 mb-2">
              {t("Nos Déjeuners Solaires")}
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {dejeuners.map((item, i) => (
              <MenuCard key={i} item={item} index={i} delay={i * 130} />
            ))}
          </div>
        </div>
      </section>

      {/* Diners */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="reveal-fade mb-14">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand font-sans">{t("Service du soir")}</span>
              <div className="h-px flex-1 bg-border/60" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground text-center mt-6 mb-2">
              {t("Nos Dîners Lunaires")}
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {diners.map((item, i) => (
              <MenuCard key={i} item={item} index={100 + i} delay={i * 130} />
            ))}
          </div>
        </div>
      </section>

      {/* ── La Cave ────────────────────────────────────────────────
          Placée juste après les menus, et avant les mentions
          pratiques : c'est l'ordre dans lequel on compose un repas —
          on choisit d'abord ce qu'on mange, puis ce qu'on boit. Les
          allergies et le rappel « menu unique pour la table » ferment
          la page, comme des mentions de bas de carte.

          Refonte : la version précédente était deux blocs de texte
          nus, correcte mais plate pour une page qui montre par
          ailleurs des photos partout. Le Vin gagne une image (même
          traitement que les portraits de Fanny/Gaëtan sur la page
          Histoire — photo d'un côté, texte de l'autre) ; le chiffre
          450 reste isolé en grand, c'est la seule donnée factuelle et
          vérifiable de la section. Les Sans-Alcools reçoit un repère
          graphique (icône + filet) pour se distinguer visuellement du
          Vin plutôt que de n'être qu'un second bloc de paragraphes. */}
      <section className="bg-card reveal-section">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
            <img
              src="/photos/cocktail-fleur.webp"
              srcSet="/photos/cocktail-fleur-480.webp 480w, /photos/cocktail-fleur-960.webp 960w, /photos/cocktail-fleur.webp 1920w"
              sizes="(max-width: 767px) 100vw, 50vw"
              alt={t('Coupe garnie d\u2019une fleur de bourrache, servie au bar de Lait Thym Sel')}
              width={1920}
              height={1920}
              loading="lazy"
              decoding="async"
              className="reveal-mask-left absolute inset-0 h-full w-full object-cover object-[center_38%]"
            />
          </div>

          <div className="flex items-center py-14 md:py-0">
            <div className="px-4 md:px-14 lg:px-20">
              <span className="reveal-fade block text-[11px] uppercase tracking-[0.35em] text-brand">
                {t('La cave')}
              </span>
              <h2
                className="reveal-fade mt-4 font-serif text-4xl text-foreground md:text-5xl"
                style={{ ['--reveal-delay' as string]: '90ms' }}
              >
                {t('Le Vin')}
              </h2>
              <div
                className="title-line mt-7 h-px w-12 origin-left bg-brand/70"
                style={{ ['--reveal-delay' as string]: '200ms' }}
              />
              <div className="mt-8 flex items-baseline gap-3">
                <span
                  className="reveal-fade font-serif text-5xl leading-none text-brand-strong md:text-6xl"
                  style={{ ['--reveal-delay' as string]: '260ms' }}
                >
                  450
                </span>
                <span
                  className="reveal-fade text-[11px] uppercase tracking-[0.25em] text-brand"
                  style={{ ['--reveal-delay' as string]: '320ms' }}
                >
                  {t('références')}
                </span>
              </div>

              <div className="mt-8 max-w-md space-y-5 text-muted-foreground">
                <p
                  className="reveal-fade leading-relaxed"
                  style={{ ['--reveal-delay' as string]: '120ms' }}
                >
                  {t('Avec plus de 450 références, notre cave reflète notre attachement aux terroirs français et aux vignerons que nous aimons. Une sélection cohérente, vivante, pensée pour accompagner notre cuisine avec justesse.')}
                </p>
                <p
                  className="reveal-fade leading-relaxed"
                  style={{ ['--reveal-delay' as string]: '220ms' }}
                >
                  {t('Nous proposons, sur chacun de nos menus, un accord Mets & Vins soigneusement réfléchi. Chaque verre est choisi pour prolonger le plat, sans excès, avec précision et équilibre.')}
                </p>
                <p
                  className="reveal-fade leading-relaxed"
                  style={{ ['--reveal-delay' as string]: '300ms' }}
                >
                  {t('Pour plus de liberté, une sélection de vins au verre complète la carte et permet de découvrir notre cave autrement.')}
                </p>
                <p
                  className="reveal-fade border-l border-brand/40 pl-6 font-serif text-xl italic leading-relaxed text-foreground"
                  style={{ ['--reveal-delay' as string]: '380ms' }}
                >
                  {t('Ici, le vin a un rôle simple : accompagner la cuisine avec justesse, discrétion et exigence.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Les Sans-Alcools ───────────────────────────────────────
          Section à part entière, et non une note en bas de la
          précédente : ces accords sont signés, ils portent le travail
          personnel de Fanny. Les réduire à une ligne « sans alcool
          disponible » aurait effacé exactement ce qui les distingue.
          L'icône verre, posée à côté de la signature, fait office de
          petit repère visuel — le seul de la section, pour ne pas
          concurrencer le texte. */}
      <section className="py-20 md:py-28 bg-background reveal-section">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div
              className="reveal-scale mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-brand/40 text-brand-strong"
              style={{ ['--reveal-delay' as string]: '0ms' }}
            >
              <GlassWater className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <span className="reveal-fade block text-center text-[11px] uppercase tracking-[0.35em] text-brand">
              {t('Signés Fanny Morvan')}
            </span>
            <h2
              className="reveal-fade mt-4 text-center font-serif text-4xl text-foreground md:text-5xl"
              style={{ ['--reveal-delay' as string]: '90ms' }}
            >
              {t('Les Sans-Alcools')}
            </h2>
            <div
              className="title-line title-line--center mx-auto mt-7 h-px w-12 origin-center bg-brand/70"
              style={{ ['--reveal-delay' as string]: '200ms' }}
            />

            <div className="scroll-fade mt-10 space-y-6 text-muted-foreground">
              <p
                className="reveal-fade text-lg leading-relaxed"
                style={{ ['--reveal-delay' as string]: '120ms' }}
              >
                {t('Les accords sans alcool sont le terrain de jeu de Fanny, entièrement imaginés et réalisés par elle. Chaque boisson est travaillée comme une véritable sauce, conçue pour prolonger le plat sans jamais en reproduire les saveurs.')}
              </p>
              <p
                className="reveal-fade leading-relaxed"
                style={{ ['--reveal-delay' as string]: '200ms' }}
              >
                {t('L’objectif n’est pas d’imiter, mais d’accompagner avec justesse, en créant un lien naturel entre la cuisine et le verre.')}
              </p>
              <p
                className="reveal-fade leading-relaxed"
                style={{ ['--reveal-delay' as string]: '280ms' }}
              >
                {t('Fanny joue avec les textures, les acidités, les tempéraments des produits, toujours guidée par la saisonnalité et la cohérence du menu. À cela s’ajoute son amour pour la verrerie, qui devient un écrin à part entière pour mettre en valeur ces créations.')}
              </p>
              <p
                className="reveal-fade leading-relaxed"
                style={{ ['--reveal-delay' as string]: '360ms' }}
              >
                {t('Ces accords offrent une lecture différente du repas : précise, sensible et profondément réfléchie.')}
              </p>
            </div>

            <p
              className="reveal-fade mt-12 text-center font-serif text-2xl italic text-foreground md:text-3xl"
              style={{ ['--reveal-delay' as string]: '440ms' }}
            >
              {t('« Une autre manière de vivre la table »')}
            </p>

            {/* La création de Fanny, en image.

                La section était seule à n'avoir aucune photo, alors
                qu'elle décrit un travail éminemment visuel — les
                textures, les couleurs, et « son amour pour la
                verrerie, qui devient un écrin à part entière ». Le
                texte le disait, rien ne le montrait.

                Cadrage carré et large, sous la citation : l'image
                clôt la section au lieu de la précéder, pour qu'on
                lise d'abord l'intention et qu'on voie ensuite le
                résultat. */}
            <figure className="reveal-mask mt-14 overflow-hidden">
              <img
                src="/photos/cocktail-petales.webp"
                srcSet="/photos/cocktail-petales-480.webp 480w, /photos/cocktail-petales-960.webp 960w, /photos/cocktail-petales.webp 1100w"
                sizes="(max-width: 767px) 92vw, 768px"
                alt={t('Coupe couronnée de pétales séchés, création sans alcool de Fanny Morvan')}
                width={1100}
                height={1100}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Notes importantes */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="reveal-fade border border-border/60 bg-card p-8 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>{t("Ces menus sont servis pour l'ensemble de la table.")}</p>
                <p>
                  {t("Nous ne sommes cependant pas en mesure d'adapter notre menu totalement exempt de lactose, de gluten et d'œuf.")}
                </p>
                <p className="font-medium text-foreground">
                  {t("Il est essentiel de bien nous signaler toutes allergies ou régime particulier.")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p
              className="reveal-fade font-serif text-lg text-muted-foreground italic mb-8"
              style={{ ['--reveal-delay' as string]: '100ms' }}
            >
              {t("\"De belles surprises, tant dans la qualité du travail des produits que leur fraîcheur.")}<br className="hidden md:block" />
              {t("Laissez-vous surprendre par l'explosion des saveurs en bouche et le mariage des textures contrastées.\"")}
            </p>
            <Button
              size="lg"
              className="reveal-fade h-14 px-10 uppercase tracking-widest rounded-none bg-foreground text-background hover:bg-foreground/85 text-sm"
              style={{ ['--reveal-delay' as string]: '200ms' }}
              asChild
              data-testid="link-menus-reserve"
            >
              <Link href={path("/reservation")}>{t("Réserver votre table")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
