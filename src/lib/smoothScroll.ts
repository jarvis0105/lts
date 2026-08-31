/**
 * Défilement fluide — reproduction du mécanisme RÉEL du site de
 * référence (Café de la Paix), retrouvé en lisant leur bibliothèque
 * `parallax.min.js` :
 *
 *   this.body.style.height = this.scrollContainer.clientHeight + 'px';
 *   ...
 *   parallax.y += (window.apyScroll - parallax.y) * parallax.smooth;
 *   this.scrollContainer.style.transform = `translate3d(0, -${parallax.y}px, 0)`;
 *
 * Ce n'est PAS ce que Lenis (utilisé ici jusqu'à ce tour) fait : Lenis
 * lisse `window.scrollY` LUI-MÊME, en rappelant `scrollTo()` en continu
 * vers une position interpolée — la position de défilement réelle du
 * navigateur devient donc la valeur déjà lissée.
 *
 * Le site de référence fait l'inverse : `window.scrollY` reste NATIF
 * et instantané (la molette, le clavier, la barre de défilement
 * répondent sans le moindre délai) ; seule la position VISUELLE du
 * contenu — un calque séparé, transformé — accuse un léger retard,
 * recalculé à chaque frame par amortissement exponentiel. Deux
 * mécanismes différents, qui peuvent donner un ressenti différent même
 * avec le même facteur 0,1.
 *
 * ── Comment on évite de casser tout ce qui est `position: fixed` ──
 * C'est précisément ce qui nous avait fait écarter cette approche plus
 * tôt : un ancêtre transformé change le point de référence de tout
 * descendant en `position: fixed`. La réponse, trouvée dans le HTML
 * réel du site de référence : leur en-tête (`<header class="siteHeader">`)
 * est un FRÈRE du conteneur transformé, jamais un enfant —
 *
 *   <header class="siteHeader">...</header>
 *   <div class="viewport"><div class="viewport-scroll">
 *     <main>...</main>
 *   </div></div>
 *
 * On reprend exactement cette disposition dans Layout.tsx : seuls
 * `<main>` et `<Footer>` vivent dans le conteneur transformé : la
 * barre de navigation, la modale de réservation et les boutons
 * flottants restent des frères, donc de vrais éléments fixes à
 * l'écran, jamais affectés par le `transform`.
 */

type ScrollEngine = {
  raf: number;
  current: number;
  running: boolean;
  content: HTMLElement | null;
  resizeObserver: ResizeObserver | null;
};

const engine: ScrollEngine = {
  raf: 0,
  current: 0,
  running: true,
  content: null,
  resizeObserver: null,
};

let started = false;

function syncBodyHeight() {
  if (!engine.content) return;
  // C'est ce qui recrée une zone de défilement native de la bonne
  // longueur : le conteneur réellement visible est `position: fixed`
  // (voir `.smooth-viewport` dans index.css), donc totalement hors du
  // flux normal du document — sans cette ligne, `<body>` ferait 0px de
  // haut et il n'y aurait tout simplement rien à faire défiler.
  const height = Math.ceil(engine.content.getBoundingClientRect().height);
  document.body.style.height = `${height}px`;
}

function frame() {
  engine.raf = 0;
  if (!engine.running) return;

  const target = window.scrollY;
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    engine.current = target;
    if (engine.content) {
      engine.content.style.transform = `translate3d(0, 0px, 0)`;
    }
    return;
  }

  // Amortissement exponentiel, indépendant du taux de rafraîchissement
  // de l'écran — c'est la même formule que `damp()` dans le code
  // source de Lenis, et le même principe que `parallax.y += (target -
  // parallax.y) * smooth` chez la référence. 0,1 : leur valeur, reprise
  // telle quelle.
  engine.current += (target - engine.current) * 0.1;
  if (Math.abs(target - engine.current) < 0.05) engine.current = target;

  if (engine.content) {
    engine.content.style.transform = `translate3d(0, ${(-engine.current).toFixed(2)}px, 0)`;
  }

  // La boucle s'arrête d'elle-même une fois la cible atteinte, plutôt
  // que de tourner indéfiniment en arrière-plan sur une page immobile.
  if (Math.abs(target - engine.current) > 0.01) {
    engine.raf = requestAnimationFrame(frame);
  }
}

function wake() {
  if (!engine.raf && engine.running) engine.raf = requestAnimationFrame(frame);
}

/** Démarre le moteur — appelé une seule fois, au montage de l'App. */
export function initSmoothScroll() {
  if (started || typeof window === "undefined") return;
  started = true;

  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", () => {
    syncBodyHeight();
    wake();
  });
}

export function destroySmoothScroll() {
  // Rien à détruire : les écouteurs vivent pour la durée de vie de
  // l'application, comme `useSmoothScroll` le documente. Conservé pour
  // ne pas casser l'appel existant dans le hook.
}

/**
 * Enregistre l'élément à transformer — appelé par `Layout.tsx` à
 * chaque montage de page (la page change, le conteneur de contenu
 * aussi). Un `ResizeObserver` recalcule la hauteur du document à
 * chaque changement de taille du contenu réel (images qui finissent
 * de charger, polices, changement de langue) : sans lui, la zone de
 * défilement native resterait figée à la taille du premier rendu et
 * couperait la fin de la page.
 */
export function registerScrollContent(el: HTMLElement) {
  engine.content = el;
  engine.current = window.scrollY;
  el.style.transform = `translate3d(0, ${-engine.current}px, 0)`;

  engine.resizeObserver?.disconnect();
  engine.resizeObserver = new ResizeObserver(() => syncBodyHeight());
  engine.resizeObserver.observe(el);
  syncBodyHeight();
  wake();
}

export function unregisterScrollContent(el: HTMLElement) {
  if (engine.content !== el) return;
  engine.resizeObserver?.disconnect();
  engine.resizeObserver = null;
  engine.content = null;
  document.body.style.height = "";
}

/** Coupe le moteur — verrouillage du défilement (rideau, modale, menu
 *  mobile). Remplace `getLenis()?.stop()`. */
export function stopScroll() {
  engine.running = false;
  if (engine.raf) {
    cancelAnimationFrame(engine.raf);
    engine.raf = 0;
  }
}

/** Reprend le moteur. Remplace `getLenis()?.start()`. */
export function startScroll() {
  engine.running = true;
  wake();
}

/** Repositionne la page instantanément — utilisé au changement de
 *  route, où toute animation serait perçue comme un défaut plutôt
 *  qu'un effet. */
export function resetScroll() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  engine.current = 0;
  if (engine.content) engine.content.style.transform = "translate3d(0, 0px, 0)";
}

/**
 * Défilement animé jusqu'à un élément (ou le haut de page si `target`
 * est omis) — clic sur une ancre, bouton « remonter en haut ».
 *
 * Anime `window.scrollY` LUI-MÊME (la position réelle, native), et
 * seulement elle : la boucle d'amortissement ci-dessus, elle, continue
 * de tourner sans rien savoir de cette animation — elle se contente de
 * poursuivre, comme toujours, la valeur réelle de `scrollY`, où qu'elle
 * se trouve à chaque instant. Le résultat est exactement le
 * comportement observé chez la référence, où le clic anime le
 * `scrollTop` réel (leur `cache.scroll.speed`, en jQuery) pendant que
 * leur propre calque de lissage continue de suivre, avec son propre
 * léger retard, la position réelle en mouvement — un double lissage,
 * mais c'est très exactement le leur.
 */
export function scrollToElement(target?: string | HTMLElement, offset = -96) {
  if (typeof window === "undefined") return;

  let destination = 0;
  if (target) {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    destination = el.getBoundingClientRect().top + window.scrollY + offset;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  destination = Math.max(0, Math.min(destination, maxScroll));

  const start = window.scrollY;
  const distance = destination - start;
  if (Math.abs(distance) < 1) return;

  const duration = 900; // ms — voir la justification dans l'ancien fichier, conservée à l'identique.
  const easing = (t: number) => 1 - Math.pow(1 - t, 4);
  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    window.scrollTo(0, start + distance * easing(t));
    wake();
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
