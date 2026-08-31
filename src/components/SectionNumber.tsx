/* ────────────────────────────────────────────────────────────────
   Numérotation éditoriale des grandes sections du récit (Accueil) :
   « 01 / 05 », « 02 / 05 »… Un seul composant partagé pour que le
   style (taille, tracking, opacité du séparateur) reste identique
   partout où il apparaît, plutôt que ré-écrit section par section.

   Volontairement minuscule et sourd : il accompagne l'eyebrow sans
   jamais rivaliser avec lui — la numérotation situe le lecteur dans
   le récit, elle ne le lui annonce pas. */

interface SectionNumberProps {
  current: number;
  total: number;
  className?: string;
}

export function SectionNumber({ current, total, className = '' }: SectionNumberProps) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <span
      className={`reveal-fade inline-flex items-baseline gap-1 font-sans text-[11px] tracking-[0.3em] text-muted-foreground/70 ${className}`}
      aria-hidden="true"
    >
      <span>{pad(current)}</span>
      <span className="text-muted-foreground/40">/</span>
      <span>{pad(total)}</span>
    </span>
  );
}
