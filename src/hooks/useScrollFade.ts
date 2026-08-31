import { useEffect } from 'react';

/* ────────────────────────────────────────────────────────────────
   Fondu des textes au défilement.

   Différent des révélations existantes (`reveal-fade`, `reveal-slide`),
   qui se déclenchent une fois et restent acquises. Ici l'opacité suit
   en continu la position du bloc dans l'écran : un texte est pleinement
   lisible quand il occupe le centre du champ, et s'estompe légèrement
   en s'approchant du haut ou du bas. L'attention se porte donc
   naturellement sur ce qu'on est en train de lire.

   Trois règles pour que l'effet reste élégant plutôt que gênant :

   — Le fondu est PLUS MARQUÉ qu'au premier réglage (0,12 d'opacité
     minimale, contre 0,35) : le texte devient presque invisible aux
     bords du champ, ce qui rend l'effet net à l'œil au lieu de se
     deviner. Il reste toutefois un fondu, jamais une disparition
     totale — la valeur ne descend pas à zéro, pour ne pas donner
     l'impression d'un défaut d'affichage.

   — La zone centrale reste large (55 % de la hauteur d'écran) et
     entièrement à pleine opacité. Un paragraphe long ne doit jamais
     avoir sa première ligne estompée pendant qu'on lit la dernière —
     un fondu plus fort rend cette réserve plus importante encore,
     pas moins.

   — Rien ne s'applique sous 768 px. Sur un téléphone, le viewport est
     si court qu'un bloc de texte traverse la zone de fondu en
     permanence : le texte scintillerait à chaque geste.

   Une seule boucle et un seul observateur pour toute la page, greffés
   automatiquement au changement de route. */

const SELECTOR = '.scroll-fade';

export function useScrollFade() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mq = window.matchMedia('(min-width: 768px)');
    const visible = new Set<HTMLElement>();
    let rafId = 0;
    let observer: IntersectionObserver | null = null;
    let mutation: MutationObserver | null = null;

    const clear = () => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        el.style.opacity = '';
      });
    };

    const tick = () => {
      const vh = window.innerHeight;
      const center = vh / 2;
      // Demi-hauteur de la zone pleinement opaque.
      const plateau = vh * 0.275;
      // Distance au-delà de laquelle on atteint l'opacité minimale.
      const falloff = vh * 0.5;

      visible.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elCenter - center);
        const excess = Math.max(0, distance - plateau);
        const ratio = Math.min(1, excess / falloff);
        el.style.opacity = String(1 - ratio * 0.88);
      });

      rafId = visible.size ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) visible.add(el);
            else {
              visible.delete(el);
              // Un bloc sorti du champ est laissé lisible : s'il
              // revient par un saut d'ancre plutôt que par un
              // défilement, il ne doit pas rester à moitié effacé.
              el.style.opacity = '';
            }
          });
          if (visible.size && !rafId) rafId = requestAnimationFrame(tick);
        },
        { rootMargin: '10% 0px 10% 0px' },
      );

      const attach = () => {
        document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => observer?.observe(el));
      };
      attach();
      mutation = new MutationObserver(attach);
      mutation.observe(document.body, { childList: true, subtree: true });
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      observer?.disconnect();
      mutation?.disconnect();
      observer = null;
      mutation = null;
      visible.clear();
      clear();
    };

    if (mq.matches) start();
    const onChange = () => (mq.matches ? start() : stop());
    mq.addEventListener('change', onChange);

    return () => {
      mq.removeEventListener('change', onChange);
      stop();
    };
  }, []);
}
