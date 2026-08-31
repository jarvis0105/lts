import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLang } from "@/i18n";

export default function Services() {
  const { t, path } = useLang();
  return (
    <Layout>
      <SEO
        title={t("Services — LAIT THYM SEL | Restaurant Angers")}
        description={t(
          "Découvrez nos services : dîner gastronomique, menu du midi, accord mets & vins et privatisation de notre salle à Angers.",
        )}
      />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <span
            className="reveal-fade block text-[11px] uppercase tracking-[0.4em] text-brand"
            style={{ ['--reveal-delay' as string]: '0ms' }}
          >
            {t("Sur mesure")}
          </span>
          <div className="lift">
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mt-4 mb-6">{t("Nos Services")}</h1>
          </div>
          <div
            className="title-line title-line--center w-12 h-0.5 bg-primary mx-auto mb-6"
            style={{ ['--reveal-delay' as string]: '140ms' }}
          ></div>
          <p
            className="reveal-fade text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ ['--reveal-delay' as string]: '240ms' }}
          >
            {t("De votre déjeuner d'affaires à vos événements privés, nous adaptons notre savoir-faire à vos envies.")}
          </p>
        </div>
      </section>

      <section className="pb-24">
        {/* Service 1 */}
        <div className="flex flex-col md:flex-row w-full bg-background border-b border-border">
          <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center order-2 md:order-1">
            <h2
              className="reveal-fade font-serif text-3xl lg:text-4xl text-foreground mb-6"
              style={{ ['--reveal-delay' as string]: '0ms' }}
            >
              {t("Expérience Gastronomique")}
            </h2>
            <p
              className="reveal-fade text-muted-foreground text-lg leading-relaxed mb-6"
              style={{ ['--reveal-delay' as string]: '120ms' }}
            >
              {t("Notre format phare. Le soir, laissez-vous guider par notre menu Dégustation en 5 ou 7 temps. Une balade sensorielle à l'aveugle, construite autour des inspirations du moment.")}
            </p>
            <ul
              className="reveal-fade space-y-3 mb-8 text-muted-foreground"
              style={{ ['--reveal-delay' as string]: '220ms' }}
            >
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                {t("Menu 5 temps ou 7 temps")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                {t("Option végétarienne disponible")}
              </li>
            </ul>
            <div
              className="reveal-fade"
              style={{ ['--reveal-delay' as string]: '320ms' }}
            >
              <Button variant="outline" className="h-12 px-8 uppercase tracking-widest rounded-none border-foreground/20" asChild data-testid="link-services-reserve-diner">
                <Link href={path("/reservation")}>{t("Réserver un dîner")}</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden w-full md:w-1/2 order-1 md:order-2">
            <img src="/photos/plat-dessert.webp" alt={t("Dîner gastronomique")} width={1500} height={1500} loading="lazy" className="w-full h-full object-cover min-h-[400px]" />
          </div>
        </div>

        {/* Service 2 */}
        <div className="flex flex-col md:flex-row w-full bg-card border-b border-border">
          <div className="overflow-hidden w-full md:w-1/2">
            <img src="/photos/mangue.webp" alt={t("Accord mets et vins")} width={1400} height={932} loading="lazy" className="w-full h-full object-cover min-h-[400px]" />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
            <h2
              className="reveal-fade font-serif text-3xl lg:text-4xl text-foreground mb-6"
              style={{ ['--reveal-delay' as string]: '0ms' }}
            >
              {t("Accords Mets & Vins")}
            </h2>
            <p
              className="reveal-fade text-muted-foreground text-lg leading-relaxed mb-6"
              style={{ ['--reveal-delay' as string]: '120ms' }}
            >
              {t("Pour accompagner votre menu, notre sommelier sélectionne des flacons vivants. Des vins de vignerons passionnés, cultivés en biodynamie ou nature, qui subliment l'assiette sans la dominer.")}
            </p>
            <ul
              className="reveal-fade space-y-3 mb-8 text-muted-foreground"
              style={{ ['--reveal-delay' as string]: '220ms' }}
            >
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                {t("Plus de 200 références en cave")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                {t("Accords sur mesure (3, 5 ou 7 verres)")}
              </li>
            </ul>
          </div>
        </div>

        {/* Service 3 */}
        <div className="flex flex-col md:flex-row w-full bg-background border-b border-border">
          <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center order-2 md:order-1">
            <h2
              className="reveal-fade font-serif text-3xl lg:text-4xl text-foreground mb-6"
              style={{ ['--reveal-delay' as string]: '0ms' }}
            >
              {t("Privatisation & Événements")}
            </h2>
            <p
              className="reveal-fade text-muted-foreground text-lg leading-relaxed mb-6"
              style={{ ['--reveal-delay' as string]: '120ms' }}
            >
              {t("Célébrez vos moments importants dans notre salle à manger. Pour un mariage intime, un anniversaire ou un repas d'affaires, nous privatisons le restaurant et créons un menu sur mesure pour vos convives.")}
            </p>
            <ul
              className="reveal-fade space-y-3 mb-8 text-muted-foreground"
              style={{ ['--reveal-delay' as string]: '220ms' }}
            >
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                {t("Jusqu'à 30 convives")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                {t("Menu et ambiance personnalisés")}
              </li>
            </ul>
            <div
              className="reveal-fade"
              style={{ ['--reveal-delay' as string]: '320ms' }}
            >
              <Button className="h-12 px-8 uppercase tracking-widest rounded-none bg-primary text-primary-foreground hover:bg-primary/90" asChild data-testid="link-services-privatize">
                <Link href={path("/contact")}>{t("Demander un devis")}</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden w-full md:w-1/2 order-1 md:order-2">
            <img src="/photos/bar.webp" alt={t("Le bar en marbre")} width={1200} height={799} loading="lazy" className="w-full h-full object-cover min-h-[400px]" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
