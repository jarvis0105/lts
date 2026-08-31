import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BookingModal } from "./BookingModal";
import { EasterEgg } from "@/components/EasterEgg";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ArrowUp } from "lucide-react";
import { useLang } from "@/i18n";
import { scrollToElement, registerScrollContent, unregisterScrollContent } from "@/lib/smoothScroll";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t } = useLang();
  const [showBackToTop, setShowBackToTop] = useState(false);

  /* Enregistre `<main>` + `<Footer>` comme le conteneur à transformer
     par le moteur de défilement fluide (voir smoothScroll.ts). Chaque
     changement de page démonte et remonte `Layout` — l'enregistrement
     suit exactement ce cycle. */
  const scrollContent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollContent.current;
    if (!el) return;
    registerScrollContent(el);
    return () => unregisterScrollContent(el);
  }, [location]);

  /* Bouton « remonter en haut » : réservé au pied de page, seul
     élément flottant qui reste — le bouton de réservation qui suivait
     le défilement a été retiré, l'en-tête porte déjà en permanence un
     accès à la réservation, inutile de le doubler. */
  useEffect(() => {
    let rafId = 0;
    let queued = false;

    const measure = () => {
      rafId = 0;
      queued = false;

      if (!window.matchMedia("(min-width: 768px)").matches) {
        setShowBackToTop(false);
        return;
      }

      const footer = document.querySelector("footer");
      const footerClose = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - 40
        : false;

      setShowBackToTop(footerClose);
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [location]);

  /* Remontée en haut de page — 900 ms, sur la même courbe que les
     autres défilements déclenchés par un clic (voir `scrollToElement`
     dans smoothScroll.ts). Sans cible : la destination par défaut de
     `scrollToElement()` est le sommet du document. */
  const handleBackToTop = () => {
    scrollToElement();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-brand-strong selection:text-white font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:h-12 focus:px-6 focus:items-center focus:bg-background focus:text-foreground focus:border focus:border-border"
      >
        Aller au contenu
      </a>
      <EasterEgg />
      <Navbar />
      {/* `.smooth-viewport` : fixe, plein écran, qui rogne tout ce qui
          dépasse — c'est la fenêtre par laquelle on regarde le
          contenu. `.smooth-viewport__content`, à l'intérieur, porte la
          hauteur RÉELLE de la page et reçoit le `transform` qui donne
          l'impression de défilement. La barre de navigation, la
          modale et le bouton flottant restent des FRÈRES de ce
          conteneur, jamais des enfants — c'est ce qui les empêche de
          perdre leur ancrage à l'écran (voir le grand commentaire dans
          smoothScroll.ts). */}
      <div className="smooth-viewport">
        <div ref={scrollContent} className="smooth-viewport__content">
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
      <BookingModal />
      <button
        type="button"
        onClick={handleBackToTop}
        className={`back-to-top ${showBackToTop ? "back-to-top-visible" : ""}`}
        aria-label={t("Remonter en haut de page")}
        data-testid="button-back-to-top"
      >
        <ArrowUp className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
