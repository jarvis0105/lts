import { useState } from 'react';

import { useConsent } from '@/components/CookieBanner';
import { useLang } from '@/i18n';
import { openBooking } from '@/lib/booking';
import { cn } from '@/lib/utils';

interface ReserveButtonProps {
  onDarkHero?: boolean;
  className?: string;
}

/**
 * Bouton « Réserver » : ouvre le module de réservation, avec les
 * disponibilités réelles du restaurant. Le libellé correspond donc
 * bien à ce que fait le bouton.
 *
 * Pas de contour : le bouton se rapproche d'un lien élégant, comme
 * les liens de navigation qui le précèdent. Le survol y garde un
 * soulignement qui se déploie de gauche à droite (`.btn-underline`),
 * pour rester le geste d'action le plus visible de la barre malgré
 * l'absence de bordure. */
export function ReserveButton({ onDarkHero = false, className }: ReserveButtonProps) {
  const { t } = useLang();
  const consent = useConsent();
  const [opening, setOpening] = useState(false);

  const handleClick = async () => {
    setOpening(true);
    try {
      await openBooking({}, consent.measurement);
    } finally {
      setOpening(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={opening}
      className={cn(
        'inline-flex h-10 cursor-pointer items-center justify-center whitespace-nowrap px-1 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 hover:text-[#B8865B] focus-visible:text-[#B8865B] disabled:cursor-default disabled:opacity-60 md:text-xs md:tracking-[0.2em]',
        onDarkHero ? 'text-white' : 'text-foreground',
        className,
      )}
      data-testid="btn-nav-reserve"
    >
      <span className="btn-underline">
        {opening ? t('Ouverture…') : t('Réserver')}
      </span>
    </button>
  );
}
