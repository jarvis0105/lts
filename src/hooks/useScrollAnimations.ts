import { useEffect } from "react";

/**
 * Cross-browser scroll animation engine.
 *
 * Replaces the old `animation-timeline: view()` approach (Chromium-only,
 * and largely unsupported as an arbitrary Tailwind value) with:
 *
 *  — Reveal (one-shot): elements carrying one of the REVEAL classes start
 *    hidden/offset via CSS, and get `.in-view` added the moment they cross
 *    into the viewport (IntersectionObserver). The actual fade / translate /
 *    mask animation is plain CSS `transition`, defined in index.css — so it
 *    works identically in Chrome, Firefox and Safari.
 *
 * A MutationObserver watches for DOM changes (route changes swap whole
 * page trees; a few components like the cookie banner mount conditionally)
 * so newly added elements are picked up automatically without needing to
 * re-run this hook per page.
 *
 * SUPPRIMÉ — le mécanisme de parallaxe (`.parallax-soft` / `.parallax-global`).
 *
 * Construit plus tôt en s'inspirant de la bibliothèque `parallax.min.js`
 * du site de référence (Café de la Paix), sur la base du code SOURCE de
 * cette bibliothèque — qui expose bien une classe `ParallaxMove` capable
 * de faire dériver des éléments. Mais une archive plus complète de leur
 * site (cette fois avec leur vraie feuille de style de production,
 * `main.css`, 180 Ko — les extractions précédentes n'étaient que la
 * coquille de l'application, sans le contenu réellement rendu) a permis
 * de vérifier l'USAGE réel, pas seulement la bibliothèque chargée :
 *
 *   — Aucun attribut `data-parallax-*` nulle part dans leur HTML réel.
 *   — Aucune instance de `ParallaxMove` n'est jamais créée sur leurs
 *     pages.
 *   — La classe `parallax` posée sur `<body>` n'est qu'un DRAPEAU de
 *     fonctionnalité, au même titre que `smoothScroll` et
 *     `scrollAnimations` juste à côté — elle active leur système de
 *     révélation au défilement (`.parallax h1.wow{opacity:1}`), pas un
 *     effet de profondeur sur des images.
 *   — Leur hero (`.heroscreen`) n'a lui-même aucun mouvement lié au
 *     défilement : une image à 50 % d'opacité fixe, et un logo qui
 *     bascule en `opacity:0` une fois qu'on a dépassé l'écran — un
 *     interrupteur, pas un calcul continu par frame.
 *
 * La bibliothèque existe chez eux, mais elle ne sert pas à ça sur le
 * site réel. Notre propre mécanisme de dérive d'éléments au scroll n'a
 * donc plus de fondement dans la référence qui l'avait motivé — retiré.
 */

const REVEAL_SELECTOR = [
  ".reveal-fade",
  ".reveal-rise",
  ".reveal-mask",
  ".reveal-mask-left",
  ".reveal-photo",
  ".reveal-slide",
  ".reveal-scale",
  ".rule-drop",
  ".title-line",
  ".lift > *",
  ".reveal-section",
  ".gallery-tile img",
  ".product-reveal",
].join(", ");

function collect(node: Node, selector: string): HTMLElement[] {
  if (!(node instanceof HTMLElement)) return [];
  const out: HTMLElement[] = [];
  if (node.matches(selector)) out.push(node);
  node.querySelectorAll<HTMLElement>(selector).forEach((el) => out.push(el));
  return out;
}

export function useScrollAnimations() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Révélations RÉSERVÉES AU BUREAU (>= 768px). Sur téléphone, tout
       le contenu s'affiche directement, sans fondu ni translation —
       trois raisons à cela, pas une seule esthétique :

         1. Un écran de téléphone est court : une section entre et
            sort du champ en une fraction du geste qui la ferait
            entrer sur un grand écran. L'animation n'a pas la place
            de se dérouler, elle se voit à peine — et ce qu'on
            perçoit alors, ce n'est pas un mouvement mais un scintil-
            lement, ou pire, un contenu qui reste invisible un instant
            de trop pendant qu'on scrolle vite (habitude tactile).

         2. C'est là que le filet de sécurité (voir plus bas) coûte le
            plus cher en performance perçue : sur un appareil moins
            puissant qu'un ordinateur de bureau, animer l'opacité et
            le transform de dizaines de blocs à chaque frame de
            défilement pèse sur la fluidité — précisément là où elle
            est déjà la plus fragile.

         3. Le même traitement s'applique à `useScrollFade` (fondu du
            texte) et `useHeroScrollEffect` (recul du hero) : les
            mécanismes suivent la même règle, pour une cohérence de
            bout en bout plutôt qu'un mélange où certains effets
            survivraient sur mobile et d'autres non.

       La requête n'est évaluée qu'une fois, au montage — comme pour
       `reduced` ci-dessus — plutôt que suivie en continu au
       redimensionnement : le hook ne se remonte qu'au changement de
       page, jamais à la rotation de l'écran, ce qui est le compromis
       déjà en place pour `prefers-reduced-motion`. */
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const skipMotion = reduced || !desktop;

    // ---------------------------------------------------------------
    // Reveal: threshold-triggered, plays once.
    // ---------------------------------------------------------------
    let revealObserver: IntersectionObserver | null = null;

    // Garde-fou PAR ÉLÉMENT : rien ne doit rester invisible.
    //
    // L'ancienne version ne posait qu'un seul minuteur global, au montage,
    // sur les éléments déjà présents dans le DOM à cet instant. Tout élément
    // ajouté plus tard (changement de page, contenu chargé en différé) était
    // observé par le MutationObserver mais ne bénéficiait plus d'aucun
    // filet de sécurité : s'il ratait — pour quelque raison que ce soit —
    // sa notification d'intersection, il restait bloqué à `opacity:0` /
    // `clip-path` fermé pour toujours. C'est ce qui produisait des sections
    // ou des images invisibles de façon permanente chez certains visiteurs.
    //
    // Ici, CHAQUE élément observé reçoit son propre minuteur de secours : si
    // l'observateur ne l'a pas révélé au bout de 1,2 s, on force `.in-view`
    // nous-mêmes. Le minuteur est annulé dès que la révélation a lieu
    // normalement, donc ce filet ne coûte rien dans le cas nominal.
    const pending = new Map<Element, number>();

    const reveal = (el: Element) => {
      el.classList.add("in-view");
      const t = pending.get(el);
      if (t) {
        window.clearTimeout(t);
        pending.delete(el);
      }
      revealObserver?.unobserve(el);
    };

    const arm = (el: Element) => {
      if (pending.has(el) || el.classList.contains("in-view")) return;
      pending.set(
        el,
        window.setTimeout(() => reveal(el), 1200),
      );
    };

    if (skipMotion) {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(reveal);
    } else {
      try {
        revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) reveal(entry.target);
            });
          },
          // `threshold: 0` et non 0.12 : un seuil de 12 % suppose que
          // l'élément tienne à l'écran. Une image plus haute que le
          // viewport — hero, grande photo en pied de section — ne peut
          // jamais exposer 12 % de sa surface en une fois, et restait
          // donc bloquée à opacity:0 indéfiniment. Avec 0, l'élément se
          // révèle dès qu'il affleure ; la marge basse retarde juste
          // assez le déclenchement pour que l'effet reste visible.
          //
          // Marge fixe (-30px), et durée/valeurs (30px, 1000ms,
          // ease-in-out sur `.reveal-fade`) : reprises TELLES QUELLES
          // de la vraie feuille de style de production du site de
          // référence (`main.css`) — confirmées au caractère près :
          //   .parallax h1:not(.wow){opacity:0;transform:translateY(30px)}
          //   .parallax h1.wow{opacity:1;transform:translateY(0)}
          //   transition: all 1s ease-in-out
          { threshold: 0, rootMargin: "0px 0px -30px 0px" }
        );
      } catch {
        revealObserver = null;
      }

      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        if (revealObserver) {
          revealObserver.observe(el);
          arm(el);
        } else {
          reveal(el);
        }
      });
    }

    // ---------------------------------------------------------------
    // Watch for DOM changes: route swaps, conditional mounts (cookie
    // banner, toasts...) get wired up automatically.
    // ---------------------------------------------------------------
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (skipMotion) {
            collect(node, REVEAL_SELECTOR).forEach(reveal);
            return;
          }
          collect(node, REVEAL_SELECTOR).forEach((el) => {
            if (revealObserver) {
              revealObserver.observe(el);
              arm(el);
            } else {
              reveal(el);
            }
          });
        });
        mutation.removedNodes.forEach((node) => {
          collect(node, REVEAL_SELECTOR).forEach((el) => {
            revealObserver?.unobserve(el);
            const t = pending.get(el);
            if (t) {
              window.clearTimeout(t);
              pending.delete(el);
            }
          });
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      revealObserver?.disconnect();
      mutationObserver.disconnect();
      pending.forEach((t) => window.clearTimeout(t));
      pending.clear();
    };
  }, []);
}
