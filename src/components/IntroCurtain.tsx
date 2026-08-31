import { useEffect, useState } from 'react';

import { RESTAURANT } from '@/lib/restaurant';
import { stopScroll, startScroll } from '@/lib/smoothScroll';

/* ────────────────────────────────────────────────────────────────
   Écran d'ouverture.

   Un voile sombre couvre l'écran, l'emblème et son filet s'y posent,
   puis l'ensemble s'efface en fondu pour découvrir la page.

   La sortie est un FONDU SIMPLE, et non plus deux pans qui
   s'écartaient avec un zoom de la marque : trois mouvements
   superposés pour quitter un écran de chargement, là où le visiteur
   attend seulement d'arriver sur le site. Un fondu unique fait le
   passage sans le commenter — c'est ce qui donne le chic.

   Trois garde-fous :

   — 2,2 s au maximum. Au-delà, le visiteur qui revient a le
     sentiment d'attendre, et sur mobile ce délai s'ajoute au
     chargement réel.

   — Une seule fois par session. Charmant la première fois, agaçant
     à la troisième.

   — Interruptible : un clic, une touche ou un début de défilement
     l'escamote aussitôt. Personne ne doit être retenu devant une
     animation. */

const SESSION_KEY = 'lts-intro-seen';
const HOLD_MS = 2200;
const FADE_MS = 600;

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    // Navigation privée ou stockage refusé : on joue le rideau sans
    // pouvoir le mémoriser. Jamais d'erreur remontée au visiteur.
    return false;
  }
}

export function IntroCurtain() {
  // La décision est prise AVANT le premier rendu : monter le rideau
  // puis le retirer aussitôt provoquerait un flash.
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (alreadySeen()) return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* sans effet */
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    /* Le moteur de défilement (voir smoothScroll.ts) lit `window.scrollY`
       en continu ; `overflow: hidden` sur `<body>` suffit à l'empêcher
       de changer, mais on coupe aussi la boucle elle-même par
       propreté — pas de calcul inutile tant que rien ne peut bouger.
       Contrairement à l'ancien Lenis, `stopScroll()` est une fonction
       simple, toujours disponible immédiatement : plus besoin de
       différer l'appel d'un tick pour attendre une initialisation
       asynchrone. */
    stopScroll();

    let removeId = 0;
    const dismiss = () => {
      setLeaving(true);
      removeId = window.setTimeout(() => setVisible(false), FADE_MS);
    };
    const holdId = window.setTimeout(dismiss, HOLD_MS);

    const skip = () => {
      window.clearTimeout(holdId);
      dismiss();
    };
    window.addEventListener('click', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('wheel', skip, { once: true, passive: true });
    window.addEventListener('touchstart', skip, { once: true, passive: true });

    return () => {
      window.clearTimeout(holdId);
      window.clearTimeout(removeId);
      document.body.style.overflow = previousOverflow;
      startScroll();
      window.removeEventListener('click', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
    };
  }, [visible]);

  // Le défilement est rendu dès le début du fondu, pour que la page
  // soit utilisable pendant la dernière demi-seconde.
  useEffect(() => {
    if (!leaving) return;
    document.body.style.overflow = '';
    startScroll();
  }, [leaving]);

  if (!visible) return null;

  return (
    <div
      className={`intro-curtain ${leaving ? 'intro-curtain--leaving' : ''}`}
      aria-hidden="true"
      data-testid="intro-curtain"
    >
      <div className="intro-curtain__mark">
        <img
          src="/logos/logo-horizontal-blanc.png"
          alt=""
          className="intro-curtain__logo"
          decoding="async"
        />
        <span className="intro-curtain__rule" />
        <span className="intro-curtain__sub">{RESTAURANT.city}</span>
      </div>
    </div>
  );
}
