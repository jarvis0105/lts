import { useCallback, useEffect, useState } from 'react';
import { Link } from 'wouter';

import {
  NO_CONSENT,
  onConsentChange,
  readConsent,
  writeConsent,
  type Consent,
} from '@/lib/consent';
import { useLang } from '@/i18n';

/** État du consentement, réactif dans toute l'application. */
export function useConsent(): Consent {
  const [consent, setConsent] = useState<Consent>(
    () => readConsent() ?? NO_CONSENT,
  );
  useEffect(
    () => onConsentChange(() => setConsent(readConsent() ?? NO_CONSENT)),
    [],
  );
  return consent;
}

export function CookieBanner() {
  const { t, path } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsent()) setVisible(true);
    return onConsentChange(() => setVisible(!readConsent()));
  }, []);

  const decide = useCallback((choice: { measurement: boolean; maps: boolean }) => {
    writeConsent(choice);
    setVisible(false);
  }, []);

  return (
    <>
      {visible && (
        <div
          className="reveal-fade fixed bottom-0 inset-x-0 z-[60] w-full border-t border-border/60 bg-card py-8 md:py-10"
          role="dialog"
          aria-modal="false"
          aria-label={t('Gestion des cookies')}
        >
          <div className="container mx-auto px-4">
            <div className="mx-auto flex w-full max-w-[700px] flex-col items-center justify-between gap-6 md:flex-row">
              <p className="text-sm leading-relaxed text-muted-foreground md:pr-10">
                {t('Ce site utilise des')}{' '}
                <Link href={path('/rgpd')} className="underline underline-offset-2 hover:text-foreground">
                  {t('cookies')}
                </Link>{' '}
                {t('à des fins d’analyse et pour améliorer votre expérience.')}
              </p>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => decide({ measurement: true, maps: true })}
                  className="bg-foreground px-6 py-2.5 text-xs uppercase tracking-[0.15em] font-medium text-background transition-colors hover:bg-foreground/85"
                  data-testid="btn-consent-accept"
                >
                  {t('Accepter')}
                </button>
                <button
                  onClick={() => decide({ measurement: false, maps: false })}
                  className="px-6 py-2.5 text-xs uppercase tracking-[0.15em] font-medium text-foreground transition-colors hover:bg-muted/40"
                  data-testid="btn-consent-refuse"
                >
                  {t('Refuser')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
