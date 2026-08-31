import { RESTAURANT, ADDRESS_ONE_LINE } from '@/lib/restaurant';
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/i18n";

function makeFormSchema(t: (fr: string) => string) {
  return z.object({
    nom: z.string().min(2, t("Le nom est requis")),
    email: z.string().email(t("Email invalide")),
    telephone: z.string().min(10, t("Numéro de téléphone invalide")),
    message: z.string().min(10, t("Le message est trop court")),
  });
}

export default function Contact() {
  const { t } = useLang();
  const { toast } = useToast();

  const formSchema = makeFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: t("Demande envoyée"),
      description: t("Nous vous répondrons dans les plus brefs délais."),
    });
    form.reset();
  }

  return (
    <Layout>
      <SEO
        title={t("Contact & Réservation — LAIT THYM SEL")}
        description={t(
          "Contactez-nous pour réserver votre table ou obtenir plus d'informations. Service du soir du mardi au samedi, déjeuner le mercredi et le vendredi.",
        )}
      />
      
      {/* ── Écran scindé : image à gauche, formulaire à droite ──
          Le principe est repris d'Ochre, l'exécution est la nôtre :
          l'image est collée au bord (pas de marge, pas de conteneur),
          le formulaire respire dans la moitié droite, et les champs
          sont réduits à un simple filet inférieur plutôt qu'à des
          boîtes bordées — cohérent avec les filets déjà employés
          ailleurs sur le site.

          `lg:sticky` sur la colonne image : elle reste en place tant
          qu'on remplit le formulaire, au lieu de défiler hors champ. */}
      <section className="relative grid grid-cols-1 lg:grid-cols-2">
        {/* Voile sombre en haut de l'écran scindé : le bandeau du haut
            porte le nom de la maison, les liens et le bouton de
            réservation, toujours écrits en BLANC tant que cet écran
            scindé est visible (voir `isContactSplitHero` dans
            Navbar.tsx). Sur la photo, à gauche, ce blanc se détache
            déjà tout seul ; sur le formulaire ivoire, à droite, il ne
            se détacherait pas sans aide. Ce dégradé, posé sur les DEUX
            moitiés à la fois plutôt que sur la seule photo, uniformise
            le fond sous l'en-tête et rend ce blanc lisible partout —
            le même principe que le voile posé sur les photos du hero
            d'accueil, simplement étendu ici à la largeur du formulaire
            aussi. Il s'efface avant que le titre « Contactez-nous »
            n'arrive, invisible dès qu'on commence à lire. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/50 via-black/15 to-transparent md:h-36"
        />

        {/* Retour à l'huître au bol bleu : le contraste froid de la
            céramique tranche avec l'ivoire du formulaire à droite, et
            donne à la page une entrée en matière plus incarnée qu'un
            aplat. */}
        <div
          className="relative h-[42vh] min-h-[280px] overflow-hidden lg:sticky lg:top-0 lg:h-screen lg:min-h-0"
        >
          <img
            src="/photos/plat-huitre.webp"
            srcSet="/photos/plat-huitre-480.webp 480w, /photos/plat-huitre.webp 900w"
            sizes="(max-width: 1023px) 100vw, 50vw"
            alt={t("Assiette signature de Lait Thym Sel")}
            width={900}
            height={1123}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center px-6 py-16 md:px-12 lg:py-28">
          <div className="w-full max-w-md">
            <span
              className="reveal-fade block text-[11px] uppercase tracking-[0.4em] text-brand"
              style={{ ["--reveal-delay" as string]: "0ms" }}
            >
              {t("Une question ?")}
            </span>
            <h1
              className="reveal-fade mt-3 font-serif text-3xl text-foreground md:text-4xl"
              style={{ ["--reveal-delay" as string]: "110ms" }}
            >
              {t("Contactez-nous")}
            </h1>
            <div
              className="title-line mt-5 h-px w-10 bg-brand/70"
              style={{ ["--reveal-delay" as string]: "220ms" }}
            />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="reveal-fade mt-10 space-y-7"
                style={{ ["--reveal-delay" as string]: "300ms" }}
              >
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        {t("Nom complet")}
                      </Label>
                      <FormControl>
                        <Input
                          className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-brand focus-visible:ring-0"
                          {...field}
                          data-testid="input-contact-nom"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {t("Email")}
                        </Label>
                        <FormControl>
                          <Input
                            type="email"
                            className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-brand focus-visible:ring-0"
                            {...field}
                            data-testid="input-contact-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {t("Téléphone")}
                        </Label>
                        <FormControl>
                          <Input
                            type="tel"
                            className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-brand focus-visible:ring-0"
                            {...field}
                            data-testid="input-contact-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        {t("Message")}
                      </Label>
                      <FormControl>
                        <Textarea
                          className="min-h-[110px] resize-none rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-brand focus-visible:ring-0"
                          {...field}
                          data-testid="input-contact-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={RESTAURANT.phoneHref}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    data-testid="link-contact-call"
                  >
                    <Phone className="h-4 w-4" />
                    {RESTAURANT.phone}
                  </a>
                  <Button
                    type="submit"
                    className="h-12 rounded-none px-10 text-xs uppercase tracking-[0.2em]"
                    data-testid="button-contact-submit"
                  >
                    {t("Envoyer")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>

    </Layout>
  );
}