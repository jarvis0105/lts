import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/* Diaporama en fondu du hero d'accueil : plusieurs photos superposées
   en absolute et animées en opacité — jamais un changement de `src`,
   qui remplacerait le pixel instantanément sans transition possible.
   Toutes les images restent montées ; seule l'opacité de la photo
   active passe à 100%, les autres à 0%, avec une transition CSS de
   FADE_DURATION.

   Trois registres différents plutôt que trois assiettes qui se
   ressembleraient : un plat, l'intérieur (le bar), et la verrière qui
   laisse deviner le ciel d'Angers au-dessus de la salle — une manière
   d'évoquer la ville sans sortir des photos réellement prises pour le
   restaurant. */
interface HeroSlide {
  desktopSrc: string;
  desktopSrcSet: string;
  mobileSrcSet: string;
  /* Dimensions intrinsèques réelles du fichier — évitent un décalage
     de mise en page (CLS) et laissent le navigateur calculer le bon
     ratio le temps que la photo charge. */
  width: number;
  height: number;
  /* Classe Tailwind object-position : chaque photo cadre son sujet
     à un endroit différent selon la composition d'origine. */
  objectPositionClassName: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    desktopSrc: '/photos/hero-salle-tables.webp',
    desktopSrcSet:
      '/photos/hero-salle-tables-480.webp 480w, /photos/hero-salle-tables-960.webp 960w, /photos/hero-salle-tables-1440.webp 1440w, /photos/hero-salle-tables.webp 2400w',
    mobileSrcSet:
      '/photos/hero-salle-tables-480.webp 480w, /photos/hero-salle-tables-960.webp 960w, /photos/hero-salle-tables.webp 2400w',
    width: 2400,
    height: 1600,
    objectPositionClassName: 'object-center',
  },
  {
    desktopSrc: '/photos/hero-salle-doree.webp',
    desktopSrcSet:
      '/photos/hero-salle-doree-480.webp 480w, /photos/hero-salle-doree-960.webp 960w, /photos/hero-salle-doree-1440.webp 1440w, /photos/hero-salle-doree.webp 2400w',
    mobileSrcSet:
      '/photos/hero-salle-doree-480.webp 480w, /photos/hero-salle-doree-960.webp 960w, /photos/hero-salle-doree.webp 2400w',
    width: 2400,
    height: 1350,
    objectPositionClassName: 'object-center',
  },
  {
    desktopSrc: '/photos/hero-salle-fresque.webp',
    desktopSrcSet:
      '/photos/hero-salle-fresque-480.webp 480w, /photos/hero-salle-fresque-960.webp 960w, /photos/hero-salle-fresque-1440.webp 1440w, /photos/hero-salle-fresque.webp 2400w',
    mobileSrcSet:
      '/photos/hero-salle-fresque-480.webp 480w, /photos/hero-salle-fresque-960.webp 960w, /photos/hero-salle-fresque.webp 2400w',
    width: 2400,
    height: 1599,
    objectPositionClassName: 'object-[center_35%]',
  },
  {
    desktopSrc: '/photos/hero-table-citron.webp',
    desktopSrcSet:
      '/photos/hero-table-citron-480.webp 480w, /photos/hero-table-citron-960.webp 960w, /photos/hero-table-citron-1440.webp 1440w, /photos/hero-table-citron.webp 2400w',
    mobileSrcSet:
      '/photos/hero-table-citron-480.webp 480w, /photos/hero-table-citron-960.webp 960w, /photos/hero-table-citron.webp 2400w',
    width: 2400,
    height: 1600,
    objectPositionClassName: 'object-center',
  },
  {
    desktopSrc: '/photos/hero-plat.webp',
    desktopSrcSet:
      '/photos/hero-plat-480.webp 480w, /photos/hero-plat-960.webp 960w, /photos/hero-plat-1440.webp 1440w, /photos/hero-plat.webp 2400w',
    mobileSrcSet:
      '/photos/hero-plat-480.webp 480w, /photos/hero-plat-960.webp 960w, /photos/hero-plat.webp 2400w',
    width: 2400,
    height: 1800,
    objectPositionClassName: 'object-center',
  },
  {
    desktopSrc: '/photos/hero-salle-bleue.webp',
    desktopSrcSet:
      '/photos/hero-salle-bleue-480.webp 480w, /photos/hero-salle-bleue-960.webp 960w, /photos/hero-salle-bleue-1440.webp 1440w, /photos/hero-salle-bleue.webp 2400w',
    mobileSrcSet:
      '/photos/hero-salle-bleue-480.webp 480w, /photos/hero-salle-bleue-960.webp 960w, /photos/hero-salle-bleue.webp 2400w',
    width: 2400,
    height: 1859,
    objectPositionClassName: 'object-center',
  },
];

const SLIDE_DURATION_MS = 7000; // temps d'affichage de chaque photo
const FADE_DURATION_MS = 2400; // doit correspondre à duration-[2400ms] plus bas — fondu plus lent et chic

export function HeroSlideshow({ primaryAlt }: { primaryAlt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;

    /* Respecte prefers-reduced-motion : la première photo reste
       affichée, sans rotation automatique. */
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const start = () => {
      intervalRef.current = setInterval(() => {
        setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
      }, SLIDE_DURATION_MS);
    };
    const stop = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    /* Coupe le minuteur quand l'onglet passe en arrière-plan — pas de
       raison de continuer à faire tourner un fondu invisible. */
    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <>
      {HERO_SLIDES.map((slide, i) => (
        <picture key={slide.desktopSrc}>
          <source media="(max-width: 767px)" srcSet={slide.mobileSrcSet} />
          <img
            src={slide.desktopSrc}
            srcSet={slide.desktopSrcSet}
            sizes="100vw"
            alt={i === 0 ? primaryAlt : ''}
            width={slide.width}
            height={slide.height}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
            className={cn(
              'absolute inset-0 h-full w-full object-cover [filter:contrast(1.08)_saturate(1.08)]',
              'transition-opacity duration-[2400ms] ease-in-out',
              slide.objectPositionClassName,
              i === activeIndex ? 'opacity-100' : 'opacity-0',
            )}
          />
        </picture>
      ))}
    </>
  );
}
