import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Star } from "lucide-react";
import { useLang } from "@/i18n";
import { REVIEWS } from "@/lib/content";


/* ── Distinctions ────────────────────────────────────────────────── */
const AWARDS = [
  {
    label: "Étoile Michelin",
    detail: "Étoilé depuis 2019",
    accent: "text-brand",
    michelin: true,
  },
  {
    icon: "✦",
    label: "Étoile Verte",
    detail: "Gastronomie durable · Depuis 2021",
    accent: "text-brand",
  },
  {
    icon: "15,5",
    label: "/ 20",
    detail: "Gault & Millau",
    accent: "text-brand",
    scoreMode: true,
  },
];

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-brand text-brand" />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { t, path } = useLang();
  return (
    <Layout>
      <SEO
        title={t("Distinctions & Avis — LAIT THYM SEL")}
        description={t(
          "Découvrez les distinctions et avis authentiques du restaurant gastronomique Lait Thym Sel à Angers : Étoile Michelin, Étoile Verte, Gault & Millau.",
        )}
      />

      {/* ── Page Header ────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background text-center">
        <div className="container mx-auto px-4">
          <div className="reveal-fade">
            <span className="text-[11px] uppercase tracking-[0.4em] text-brand">{t("Fanny & Gaëtan Morvan")}</span>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mt-3 mb-4">
              {t("Distinctions & Avis")}
            </h1>
            <div className="w-12 h-px bg-brand/80 mx-auto" />
          </div>
        </div>
      </section>

      {/* ── Awards ─────────────────────────────────────────────────── */}
      <section data-nav-theme="dark" className="py-16 bg-foreground">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {AWARDS.map((a, i) => (
              <div
                key={i}
                className="reveal-fade flex min-h-[220px] flex-col items-center justify-center gap-5 border border-white/10 bg-white/[0.03] p-8 text-center transition-colors duration-500 hover:border-brand/50 hover:bg-white/[0.06]"
                style={{ ['--reveal-delay' as string]: `${i * 140}ms` }}
              >
                {a.michelin ? (
                  <div className="flex flex-col items-center leading-none text-brand">
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.34em]">MICHELIN</span>
                    <span className="mt-2 font-serif text-2xl tracking-[0.18em]">GUIDE</span>
                    <span className="mt-3 h-px w-8 bg-brand/70" />
                  </div>
                ) : a.scoreMode ? (
                  <div className="flex items-baseline gap-1">
                    <span className={`font-serif text-5xl font-medium ${a.accent}`}>{a.icon}</span>
                    <span className="font-serif text-2xl text-white/55">{t(a.label)}</span>
                  </div>
                ) : (
                  <span className={`font-serif text-4xl ${a.accent}`}>{a.icon}</span>
                )}
                <div>
                  <p className="font-serif text-lg font-medium text-white">{t(a.label)}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-brand/80">{t(a.detail)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Google rating summary ──────────────────────────────────── */}
      <section className="py-10 bg-card border-b border-border/50 reveal-section">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-4">
            <StarRow count={5} />
            <span className="font-serif text-2xl text-foreground">4,9 / 5</span>
            <span className="text-muted-foreground text-sm">{t("287 avis Google")}</span>
          </div>
        </div>
      </section>

      {/* ── Real Google Reviews ───────────────────────────────────── */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="reveal-fade text-center mb-12">
            <span className="text-[11px] uppercase tracking-[0.35em] text-brand">{t("Avis publics Google")}</span>
            <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-4">{t("Ce que vous en pensez")}</h2>
            <div className="w-8 h-px bg-brand/80 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="reveal-fade premium-card bg-background border border-border/40 p-7 flex flex-col gap-4"
                style={{ ['--reveal-delay' as string]: `${(i % 3) * 130}ms` }}
              >
                {/* Google icon + stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Google G icon (SVG inline) */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <StarRow count={r.stars} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{t(r.category)}</span>
                </div>

                {/* Review text */}
                <blockquote className="font-serif italic text-muted-foreground leading-relaxed flex-1 text-[15px]">
                  {t('« ')}{t(r.text)}{t(' »')}
                </blockquote>

                {/* Verified badge */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
                  <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[11px] text-muted-foreground">{t("Avis Google vérifié")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Link to Google */}
          <div className="text-center mt-12">
            <a
              href="https://g.co/kgs/laitthymsel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              {t("Voir tous les avis sur Google Maps")}
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA Réservation ────────────────────────────────────────── */}
      <section data-nav-theme="dark" className="py-24 bg-foreground text-background text-center reveal-section">
        <div className="scroll-fade container mx-auto px-4 max-w-xl space-y-6">
          <span
            className="reveal-fade block text-[11px] uppercase tracking-[0.4em] text-background/40"
            style={{ ['--reveal-delay' as string]: '0ms' }}
          >
            {t("17 Rue Boisnet, Angers")}
          </span>
          <h3
            className="reveal-fade font-serif text-4xl"
            style={{ ['--reveal-delay' as string]: '110ms' }}
          >
            {t("Vivez l'expérience")}
          </h3>
          <div
            className="title-line title-line--center w-8 h-px bg-brand/70 mx-auto"
            style={{ ['--reveal-delay' as string]: '220ms' }}
          />
          <p
            className="reveal-fade font-serif italic text-background/65 text-lg"
            style={{ ['--reveal-delay' as string]: '300ms' }}
          >
            {t("Rejoignez les convives qui font confiance à Lait Thym Sel depuis 2017.")}
          </p>
          <a
            href={path("/reservation")}
            className="reveal-fade inline-flex items-center justify-center h-14 px-10 text-sm tracking-[0.25em] uppercase font-medium bg-background text-foreground hover:bg-brand/10 transition-colors duration-300"
            style={{ ['--reveal-delay' as string]: '380ms' }}
          >
            {t("Réserver une table")}
          </a>
        </div>
      </section>
    </Layout>
  );
}
