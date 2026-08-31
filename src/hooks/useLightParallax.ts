import { useEffect, useRef } from 'react';

/**
 * Dérive verticale très légère (quelques pixels) d'un élément au
 * défilement — demandée spécifiquement pour la photo de la section
 * « Le Produit » de l'accueil.
 *
 * Volontairement LOCAL et minimal, et non une réintroduction du
 * mécanisme général retiré (voir l'en-tête de useScrollAnimations.ts,
 * `SUPPRIMÉ — le mécanisme de parallaxe`) : celui-là avait été bâti
 * pour tout le site sur la foi d'une bibliothèque de référence qui,
 * vérification faite sur leur vraie feuille de style, ne l'utilisait
 * nulle part. Ici c'est l'inverse — une demande explicite, ponctuelle,
 * pour un seul élément. Pas d'observer partagé, pas de dépendance
 * croisée avec le moteur de révélation : juste un écouteur de scroll
 * traversé par `requestAnimationFrame`, posé et retiré avec l'élément.
 * Le style est appliqué directement en `transform` (hors React), donc
 * sans re-rendu à chaque frame.
 */
export function useLightParallax<T extends HTMLElement>(rangePx = 16) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 quand l'élément affleure tout en bas de l'écran,
      // +1 quand il affleure tout en haut : une dérive proportionnelle
      // à la progression dans le viewport plutôt qu'au défilement
      // absolu, pour rester cohérente quelle que soit la position de
      // la section sur la page.
      const center = rect.top + rect.height / 2;
      const progress = (vh / 2 - center) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.transform = `translateY(${(clamped * rangePx).toFixed(1)}px)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rangePx]);

  return ref;
}
