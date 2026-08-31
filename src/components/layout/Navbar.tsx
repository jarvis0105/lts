import { Link, useLocation } from "wouter";
import { Mail, MapPin, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ReserveButton } from "@/components/layout/ReserveButton";
import { useLang, stripLangPrefix } from "@/i18n";
import {
  RESTAURANT,
  ADDRESS_ONE_LINE,
  LUNCH,
  DINNER,
  LUNCH_DAYS_LABEL,
  DINNER_DAYS_LABEL,
  formatService,
} from "@/lib/restaurant";
import { stopScroll, startScroll } from "@/lib/smoothScroll";
import { useNavTheme } from "@/hooks/useNavTheme";

/* Liens de navigation « métier » — ni Accueil (déjà atteint par un
   clic sur le logo) ni Réserver (qui a son propre bouton, à part) :
   ce sont les quatre mêmes liens qu'on retrouve dans la barre
   centrée sur grand écran ET dans le panneau plein écran du menu
   mobile — Réserver s'ajoute uniquement dans ce second cas, comme
   dernier geste de la cascade. */
const NAV_LINKS = [
  { href: "/a-propos", label: "Restaurant" },
  { href: "/menus", label: "Menus" },
  { href: "/avis", label: "Avis" },
  { href: "/contact", label: "Contact" },
];

/* Sélecteur de langue : deux libellés textuels, FR puis EN, séparés
   d'une barre oblique — la même écriture que celle déjà en place au
   pied de page, plutôt qu'un globe et son panneau déroulant. Un
   globe est une icône à décoder ; « EN / FR » se lit tout de suite,
   et ce sont deux vrais liens <a hrefLang>, pas un menu piloté en
   JavaScript qui priverait les moteurs du lien vers la traduction. */
function LangSwitch({ onDark, className }: { onDark: boolean; className?: string }) {
  const { lang, otherLangHref, other } = useLang();

  return (
    <nav
      aria-label={lang === 'fr' ? 'Choisir la langue' : 'Choose language'}
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-300',
        onDark ? 'text-white' : 'text-foreground',
        className,
      )}
    >
      <span className={lang === 'fr' ? 'opacity-100' : 'opacity-50 transition-opacity hover:opacity-80'}>
        {lang === 'fr' ? (
          'FR'
        ) : (
          <Link href={otherLangHref} hrefLang={other} data-testid="link-lang-fr">FR</Link>
        )}
      </span>
      <span aria-hidden="true" className="opacity-40">/</span>
      <span className={lang === 'en' ? 'opacity-100' : 'opacity-50 transition-opacity hover:opacity-80'}>
        {lang === 'en' ? (
          'EN'
        ) : (
          <Link href={otherLangHref} hrefLang={other} data-testid="link-lang-en">EN</Link>
        )}
      </span>
    </nav>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const { t, path } = useLang();
  const bare = stripLangPrefix(location);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    /* Seuil basé sur la hauteur d'écran (le hero fait ~100svh) plutôt
       qu'une valeur fixe de 60 px : l'en-tête étant TOUJOURS
       transparent (plus de plaque ivoire qui se pose derrière), le
       texte doit rester blanc tant que la photo sombre du hero est
       encore visible sous lui, et ne bascule en foncé qu'une fois
       qu'on l'a réellement quittée. */
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.72);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Les liens de navigation ne vivent QUE dans le hero : visibles tant
     qu'on ne l'a pas quitté, masqués dès qu'on passe ce seuil — quel
     que soit le sens du scroll. Avant, un déplacement vers le haut
     ailleurs sur la page les faisait réapparaître à tort ; ils sont
     désormais purement liés à la position (dans le hero ou non), plus
     à la direction du geste. */
  const navLinksVisible = !isScrolled;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  /* Le panneau couvre tout l'écran : il faut donc verrouiller le
     défilement derrière lui, comme pour la modale de réservation.
     Lenis pilote le défilement du site et ignore `overflow: hidden`
     — il faut l'arrêter explicitement. */
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stopScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      startScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  /* Thème de l'en-tête : déterminé par les sections réellement
     marquées `data-nav-theme="dark"` sur la page (voir useNavTheme).
     Couvre désormais le hero ET tout le reste de la page — la
     section Réservation, le pied de page — plutôt que le seul haut
     de page. */
  const sectionTheme = useNavTheme(bare, 104);

  /* Contact reste un cas à part : sa page s'ouvre sur deux moitiés
     horizontales (photo sombre à gauche, formulaire ivoire à droite).
     L'observateur de sections, purement VERTICAL, ne sait pas
     distinguer gauche et droite — il verrait la ligne entière comme
     sombre alors que seule sa moitié gauche l'est vraiment. On garde
     donc ce cas calculé à part : l'en-tête reste toujours considéré
     comme « sur fond sombre » tant que cet écran scindé est visible
     (texte blanc), et c'est la page elle-même qui porte désormais un
     voile sombre en haut de sa moitié claire — le même principe que
     le dégradé posé sur les photos du hero d'accueil — pour que ce
     blanc reste lisible aussi au-dessus du formulaire (voir
     Contact.tsx). Plus besoin de forcer le texte en foncé rien que
     pour cette page. */
  const isContactSplitHero = bare === "/contact" && !isScrolled;
  const onDarkHero = sectionTheme === 'dark' || isContactSplitHero;
  const navOnDark = onDarkHero;

  /* Le panneau plein écran du menu mobile, lui, s'ouvre TOUJOURS en
     sombre — c'est un fondu sombre posé sur le hero, quelle que soit
     la section survolée au moment du clic. */
  const mobileOnDark = true;

  return (
    <header
      className={cn(
        /* Hauteur à nouveau variable au scroll (104px → 86px desktop,
           92px → 76px mobile) : logo, bouton Réserver et sélecteur de
           langue suivent ce rétrécissement, comme avant. Les quatre
           liens de navigation, eux, ne sont plus dans ce flux — voir
           plus bas — ils restent fixés à la hauteur du hero. */
        "fixed top-0 left-0 right-0 z-50 flex items-center bg-transparent transition-[height] duration-300",
        isScrolled ? "h-[76px] md:h-[86px]" : "h-[92px] md:h-[104px]",
      )}
    >
      {/* Les quatre liens de navigation, sortis du flux qui suit le
          rétrécissement de l'en-tête : positionnés en `fixed` avec un
          `top` constant (la moitié de la hauteur du hero, 104px/2),
          ils ne bougent plus au scroll — contrairement au logo, au
          bouton Réserver et au sélecteur de langue, qui restent dans
          l'en-tête et suivent, eux, son changement de hauteur.
          Masqué en dessous de `xl` : sur téléphone/tablette, c'est le
          menu plein écran qui porte ces mêmes liens. */}
      <nav
        aria-label={t('Navigation')}
        className={cn(
          'fixed left-1/2 top-[52px] z-[70] hidden -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-300 ease-out xl:pointer-events-auto xl:block',
          navLinksVisible ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95',
        )}
      >
        <ul className="flex items-center gap-12 2xl:gap-16">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {/* Même traitement visuel par défaut quelle que soit la
                  page active : pas de surlignement du lien courant.
                  Le survol se limite à un léger changement d'opacité —
                  sobre, sans trait ni fond. */}
              <a
                href={path(link.href)}
                className={cn(
                  'nav-link-premium font-nav text-[17px] tracking-[0.12em] transition-colors duration-300 hover:text-[#C69357] focus-visible:text-[#C69357]',
                  navOnDark || mobileMenuOpen ? 'text-white' : 'text-foreground',
                )}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {t(link.label)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Pleine largeur avec une simple marge, au lieu d'un
          `container mx-auto` : celui-ci centre son contenu et applique
          une gouttière calculée, ce qui décalait le logo du bord de
          l'écran — d'autant plus nettement sur grand écran. Ici, il
          est réellement aligné à gauche, et le bouton de réservation
          à droite. */}
      <div className="pointer-events-auto relative z-[70] w-full px-5 md:px-8">
        <div className="relative flex items-center justify-between gap-4">
          {/* Gauche : le nom de la maison, seul. */}
          <Link
            href={path("/")}
            className="inline-flex items-center"
            data-testid="link-home-logo"
          >
            {/* Le logo officiel de la maison, en une seule image plutôt
                qu'une icône et un libellé composés séparément — c'est
                la version exacte fournie par la maison qui s'affiche,
                jamais une reconstitution typographique. Deux fichiers
                se relaient selon `navOnDark` (dérivé de `useNavTheme`) :
                lettrage blanc sur section sombre, lettrage foncé sur
                fond clair — chacun garde l'emblème dans sa teinte de
                marque d'origine, seul le texte du logo change de
                couleur d'un fichier à l'autre. Un `<img>` unique
                (jamais deux superposées à faire alterner en opacité) :
                la transition de 400 ms sur `opacity` suffit à adoucir
                le changement de fichier au passage d'une section à
                l'autre. Pas d'effet au survol : le logo reste
                strictement statique, quel que soit le pointeur. */}
            <div className="relative flex h-9 items-center sm:h-11 md:h-14">
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute -inset-x-5 -inset-y-3 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(18,15,12,0.16)_0%,rgba(18,15,12,0.06)_52%,transparent_76%)] blur-md transition-opacity duration-[400ms] ease',
                  navOnDark || mobileMenuOpen ? 'opacity-60' : 'opacity-0',
                )}
              />
              {/* Deux images superposées, chacune s'effaçant vers
                  l'autre en opacité (400 ms) plutôt qu'un `<img>`
                  unique dont on change la source : un changement de
                  `src` remplace le pixel instantanément, sans transition
                  possible — la seule façon d'obtenir un vrai fondu
                  entre les deux fichiers est de les garder tous deux
                  montés, superposés, et de piloter leur opacité
                  respective. La largeur de référence (`invisible`, non
                  affichée) fixe la place occupée par le logo dans la
                  mise en page, pour que les deux versions absolues
                  s'y calent sans jamais faire sauter le reste de
                  l'en-tête. */}
              <img
                src="/logos/logo-fonce-total.png"
                alt="Lait Thym Sel — Fanny & Gaëtan Morvan"
                className="invisible h-full w-auto object-contain"
                aria-hidden="true"
              />
              <img
                src="/logos/logo-fonce-total.png"
                alt="Lait Thym Sel — Fanny & Gaëtan Morvan"
                className={cn(
                  'absolute inset-0 block h-full w-auto object-contain transition-opacity duration-[400ms] ease',
                  navOnDark || mobileMenuOpen ? 'opacity-0' : 'opacity-100',
                )}
              />
              <img
                src="/logos/logo-horizontal-blanc.png"
                alt=""
                aria-hidden="true"
                className={cn(
                  'absolute inset-0 block h-full w-auto object-contain transition-opacity duration-[400ms] ease',
                  navOnDark || mobileMenuOpen ? 'opacity-100' : 'opacity-0',
                )}
              />
            </div>
          </Link>

          {/* Droite : langue, réserver, puis — seulement sur
              téléphone — le bouton qui ouvre le panneau plein écran.
              Plus de bouton flottant qui suit le défilement : ce
              bouton-ci, toujours à la même place dans l'en-tête,
              suffit. */}
          <div className="flex items-center gap-5 md:gap-7">
            <LangSwitch onDark={navOnDark || mobileMenuOpen} className="hidden sm:flex" />
            <ReserveButton onDarkHero={navOnDark || mobileMenuOpen} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'toggle-nav group relative -mr-1.5 inline-flex items-center p-1.5 transition-opacity duration-300 xl:hidden',
                mobileMenuOpen && 'is-open',
              )}
              data-testid="button-mobile-menu"
              aria-label={mobileMenuOpen ? t('Fermer') : t('Menu')}
              aria-expanded={mobileMenuOpen}
            >
              {/* Icône seule, sans libellé texte. Deux <line> plutôt que
                  trois : silhouette plus fine, et les deux traits
                  pivotent l'un vers l'autre en croix à l'ouverture, sans
                  qu'un troisième trait central n'ait besoin de
                  s'effacer. */}
              <svg
                viewBox="0 0 26 14"
                width="26"
                height="14"
                aria-hidden="true"
                className={cn(
                  'relative block overflow-visible',
                  navOnDark || mobileMenuOpen ? 'text-white' : 'text-foreground',
                )}
              >
                <line x1="0" y1="3" x2="26" y2="3" className="toggle-nav__bar toggle-nav__bar--1" />
                <line x1="0" y1="11" x2="26" y2="11" className="toggle-nav__bar toggle-nav__bar--3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Panneau plein écran du menu mobile : noir, sombre et
          largement transparent (au lieu du brun de la marque) pour
          un rendu plus chic et plus neutre — un fondu qui laisse
          deviner ce qu'il y a derrière plutôt qu'une plaque opaque.
          Au repos il est positionné hors champ (`translate-y-full`,
          invisible) ; à l'ouverture il remonte à sa place. */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-black/75 text-background backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          mobileMenuOpen ? "translate-y-0" : "translate-y-full pointer-events-none",
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-8 pb-10 pt-[104px]">
          <nav className="flex flex-1 flex-col items-start justify-center gap-0.5">
            {[...NAV_LINKS, { href: "/reservation", label: "Réserver" }].map((link, i) => (
              <a
                key={link.href}
                href={path(link.href)}
                /* Cascade : chaque lien part invisible et légèrement
                   réduit, puis apparaît avec un délai croissant —
                   70 ms d'écart entre deux liens. Fermé, le délai
                   retombe à zéro : la sortie doit être immédiate, pas
                   rejouer la cascade à l'envers. */
                className={cn(
                  "menu-item inline-block w-full py-2 text-left font-serif text-2xl text-background/90 transition-[opacity,transform,color] duration-500 ease-out hover:text-brand md:py-2.5 md:text-3xl",
                  mobileMenuOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0",
                )}
                style={{ transitionDelay: mobileMenuOpen ? `${160 + i * 70}ms` : "0ms" }}
                data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
              >
                {t(link.label)}
              </a>
            ))}
          </nav>

          {/* Bloc contact, en bas : adresse, téléphone, e-mail,
              horaires — dernier à apparaître, après un délai
              nettement plus long que les liens. Pas de sur-titre :
              l'icône devant chaque ligne suffit à en lire la nature. */}
          <div
            className={cn(
              "mt-8 shrink-0 border-t border-background/15 pt-6 transition-[opacity,transform] duration-500 ease-out",
              mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
            style={{ transitionDelay: mobileMenuOpen ? `${160 + (NAV_LINKS.length + 1) * 70 + 60}ms` : "0ms" }}
          >
            <div className="space-y-3 text-left text-xs text-background/70">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                <span>{ADDRESS_ONE_LINE}</span>
              </p>
              <p>
                <a href={RESTAURANT.phoneHref} className="hover:text-background" data-testid="link-mobile-nav-phone">
                  {RESTAURANT.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                <a href={`mailto:${RESTAURANT.email}`} className="hover:text-background" data-testid="link-mobile-nav-email">
                  {RESTAURANT.email}
                </a>
              </p>
              <p className="flex items-center gap-2 text-background/55">
                <Clock className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  {t(LUNCH_DAYS_LABEL)} · {t(formatService(LUNCH))} — {t(DINNER_DAYS_LABEL)} · {t(formatService(DINNER))}
                </span>
              </p>
            </div>

            <div className="mt-7 flex justify-start sm:hidden">
              <LangSwitch onDark className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
