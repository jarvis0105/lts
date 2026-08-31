/* ────────────────────────────────────────────────────────────────
   Système graphique propriétaire — LAIT / THYM / SEL.

   Trois motifs au trait extrêmement fin, un par mot du nom de la
   maison, pensés comme des gravures plutôt que des icônes :

     lait  — une courbe unique, fluide, sans angle : la douceur.
     thym  — une tige et quelques feuilles, tracé organique : le végétal.
     sel   — un semis de petits points assemblés en cristal : le minéral.

   Un seul composant, trois variantes : la cohérence (même épaisseur
   de trait, même opacité par défaut, même taille de base) importe
   plus que la richesse de chaque motif pris seul. Toujours en
   `currentColor` — la couleur et l'opacité se pilotent depuis
   l'appelant (`className="text-brand/25"` par ex.), jamais en dur
   ici, pour rester cohérent avec la teinte de chaque section. */

type OrnamentVariant = 'lait' | 'thym' | 'sel';

interface OrnamentProps {
  variant: OrnamentVariant;
  className?: string;
}

export function Ornament({ variant, className = '' }: OrnamentProps) {
  const common = {
    className,
    'aria-hidden': true as const,
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 0.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    xmlns: 'http://www.w3.org/2000/svg',
  };

  if (variant === 'lait') {
    return (
      <svg {...common}>
        {/* Une seule courbe continue, sans rupture — la fluidité. */}
        <path d="M4 40 C 16 12, 32 12, 32 32 C 32 52, 48 52, 60 24" />
      </svg>
    );
  }

  if (variant === 'thym') {
    return (
      <svg {...common}>
        {/* Une tige centrale, des feuilles en paires alternées — le végétal. */}
        <path d="M32 58 V 8" />
        <path d="M32 46 C 24 42, 18 34, 16 24" />
        <path d="M32 34 C 40 30, 46 22, 48 12" />
        <path d="M32 22 C 25 19, 20 13, 18 6" />
      </svg>
    );
  }

  /* sel : un semis de points inégaux, assemblés sans grille parfaite
     — le cristal, jamais tout à fait symétrique. */
  return (
    <svg {...common} strokeWidth={0}>
      {[
        [32, 10],
        [20, 22],
        [44, 22],
        [32, 32],
        [14, 40],
        [50, 40],
        [26, 48],
        [38, 48],
        [32, 58],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.4} fill="currentColor" />
      ))}
    </svg>
  );
}
