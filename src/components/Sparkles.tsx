/* ────────────────────────────────────────────────────────────────
   Étincelles — un semis de points minuscules qui scintillent très
   doucement, pour la section « Des menus en étincelles ». Purement
   décoratif, purement `opacity`/`transform` (voir §26 du brief :
   aucune animation ne doit reposer sur une propriété qui déclenche
   un recalcul de mise en page).

   Aucun mouvement : les points ne se déplacent pas, ils
   apparaissent et s'estompent, chacun à son rythme — l'effet doit
   évoquer une braise qui couve, pas une pluie d'étoiles. */

const SPARKS = [
  { top: '12%', left: '6%', size: 3, delay: '0s', duration: '4.5s' },
  { top: '68%', left: '2%', size: 2, delay: '1.1s', duration: '3.8s' },
  { top: '22%', left: '94%', size: 2, delay: '2.2s', duration: '4.2s' },
  { top: '80%', left: '90%', size: 3, delay: '0.6s', duration: '5s' },
  { top: '48%', left: '98%', size: 2, delay: '3s', duration: '4s' },
  { top: '4%', left: '55%', size: 2, delay: '1.8s', duration: '3.6s' },
];

export function Sparkles({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
