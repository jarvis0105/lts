import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/i18n";
import { DINNER_DAYS_LABEL, LUNCH_DAYS_LABEL, formatService, LUNCH, DINNER, RESTAURANT } from "@/lib/restaurant";

/* Sommaire éditorial du pied de page — numéroté comme un index de
   revue plutôt qu'égrené comme un simple menu de liens. */
const EXPLORE_LINKS = [
  { href: '/menus', label: 'La carte' },
  { href: '/a-propos', label: 'La maison' },
  { href: '/avis', label: 'Les avis' },
  { href: '/reservation', label: 'Réserver' },
  { href: 'https://laitthymsel.secretbox.fr', label: 'La boutique', external: true },
];

/* Logos officiels Instagram / Facebook (traits pleins, pas des
   icônes génériques) — repris tels quels pour que les boutons
   sociaux du pied de page soient reconnaissables au premier coup
   d'œil. */
function InstagramMark(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookMark(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export function Footer() {
  const { t, path, lang, otherLangHref, other } = useLang();

  return (
    <footer data-nav-theme="dark" className="relative overflow-hidden bg-foreground text-background/90">
      <div className="absolute inset-x-0 top-0 h-px bg-brand/70" />

      <div className="container relative mx-auto px-5 pb-8 pt-16 md:px-8 md:pb-10 md:pt-24">
        <div className="mx-auto max-w-5xl">
        <div className="mt-0 grid gap-12 md:grid-cols-3 md:gap-14 lg:gap-20">
          {/* ── Colonne "La maison" : le colophon ─────────────────── */}
          <div className="reveal-fade text-left">
            <img
              src="/logos/logo-horizontal-blanc.png"
              alt={t('LAIT THYM SEL')}
              className="h-12 w-auto opacity-95 transition-opacity duration-300 hover:opacity-80 md:h-16"
            />
            <p className="mt-5 font-serif text-xl italic text-background/60">
              {t('L’Élégance de la Simplicité')}
            </p>
            <div className="mt-8 text-sm leading-relaxed text-background/65">
              <p>{RESTAURANT.street}, {RESTAURANT.postalCode} {RESTAURANT.city}</p>
              <p className="mt-2 text-xs text-background/45">
                {t(LUNCH_DAYS_LABEL)} · {t(formatService(LUNCH))} / {t(DINNER_DAYS_LABEL)} · {t(formatService(DINNER))}
              </p>
              <div className="mt-3 flex flex-col items-start gap-1">
                <a href={RESTAURANT.phoneHref} className="footer-link" data-testid="link-footer-phone">
                  {RESTAURANT.phone}
                </a>
                <a href={`mailto:${RESTAURANT.email}`} className="footer-link" data-testid="link-footer-email">
                  {RESTAURANT.email}
                </a>
              </div>
            </div>
            <div className="mt-10 border-t border-background/10 pt-5 text-xs text-background/45">
              <div className="mt-4 flex items-center gap-4">
                <a href={RESTAURANT.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-link h-9 w-9" data-testid="link-social-instagram" aria-label="Instagram">
                  <InstagramMark className="h-4 w-4" />
                </a>
                <a href={RESTAURANT.facebookUrl} target="_blank" rel="noopener noreferrer" className="social-link h-9 w-9" data-testid="link-social-facebook" aria-label="Facebook">
                  <FacebookMark className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* ── Colonne "Sommaire" : l'index numéroté ─────────────── */}
          <div className="reveal-fade flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-[0.3em] text-background/40">
              {t('Explorer la maison')}
            </span>
            <nav aria-label={t('Explorer la maison')} className="mt-5 flex flex-col items-start gap-3">
              {EXPLORE_LINKS.map((item) => (
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link font-serif text-xl text-background/80 md:text-2xl"
                    data-testid={`link-footer-explore-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {t(item.label)}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={path(item.href)}
                    className="footer-link mr-auto font-serif text-xl text-background/80 md:text-2xl"
                    data-testid={`link-footer-explore-${item.href.replace('/', '')}`}
                  >
                    {t(item.label)}
                  </Link>
                )
              ))}
            </nav>

          </div>

          <div className="reveal-fade flex flex-col items-start md:pt-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-background/40">{t('Réserver votre table')}</span>
            <Link
              href={path('/reservation')}
              className="group footer-link mt-5 inline-flex w-full items-center justify-between gap-5 border-0 border-b border-brand/50 px-0 py-3 font-sans text-xs uppercase tracking-[0.24em] text-background transition-colors duration-300 hover:bg-transparent"
              data-testid="link-footer-reserve"
            >
              {t('Réserver')}
              <ArrowRight className="h-3.5 w-3.5 text-brand transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="mt-12 text-[10px] uppercase tracking-[0.3em] text-background/40">{t('Langues')}</span>
            <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.25em]">
              <span className={lang === 'fr' ? 'text-background' : 'text-background/35'}>FR</span>
              <span className="text-background/25">/</span>
              {lang === 'fr' ? (
                <Link href={otherLangHref} hrefLang={other} className="footer-link inline-flex items-center" data-testid="link-footer-lang-en">EN</Link>
              ) : (
                <span className="text-background">EN</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-background/10 pt-5 text-xs text-background/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 LAIT THYM SEL. {t("Tous droits réservés")}</p>
          <div className="flex items-center gap-6 whitespace-nowrap">
            <Link href={path("/mentions-legales")} className="footer-meta-link" data-testid="link-footer-legal">{t("Mentions légales")}</Link>
            <Link href={path("/rgpd")} className="footer-meta-link" data-testid="link-footer-privacy">{t("RGPD")}</Link>
            <Link href={path("/cgu")} className="footer-meta-link" data-testid="link-footer-terms">{t("CGU")}</Link>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
