import mangoPhoto from "@/assets/mango-photo.jpg.asset.json";
import lovableLogo from "@/assets/lovable-logomark.png.asset.json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Heart } from "lucide-react";

/** Welcome-only introduction; no game state or persistence. */
export function MeetMango() {
  const { t } = useLanguage();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-11 text-sm text-foreground underline underline-offset-4">
          {t("meetMango")}
        </Button>
      </DialogTrigger>
      <DialogContent className="viewport-dialog w-[calc(100%-2rem)] max-w-[var(--page-max)] overflow-y-auto overscroll-contain rounded-card border-0 bg-card p-5 text-card-foreground shadow-soft motion-reduce:animate-none">
        <div className="relative mt-5 flex justify-center">
          <img
            src={mangoPhoto.url}
            alt={t("mangoPhotoAlt")}
            loading="lazy"
            width={768}
            height={1023}
            className="h-auto max-h-[240px] w-auto max-w-full rounded-xl object-contain shadow-soft sm:max-h-[340px]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute right-1 top-1/2 h-28 w-12">
            <Heart className="mango-heart mango-heart-purple absolute bottom-0 left-0 h-7 w-7 fill-current" />
            <Heart className="mango-heart mango-heart-red absolute bottom-0 right-0 h-6 w-6 fill-current" />
            <Heart className="mango-heart mango-heart-pink absolute bottom-0 left-2 h-8 w-8 fill-current" />
          </div>
        </div>
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl leading-tight text-foreground">{t("meetMango")}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-foreground">{t("mangoStory")}</DialogDescription>
        </DialogHeader>
        <section className="space-y-2 text-left">
          <h2 className="font-display text-lg text-foreground">{t("howToPlay")}</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
            <li>{t("mangoStepOne")}</li>
            <li>{t("mangoStepTwo")}</li>
            <li>{t("mangoStepThree")}</li>
          </ol>
        </section>
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">{t("mangoPrivacy")}</p>
        <p className="flex flex-wrap items-center justify-center gap-x-1 text-center text-xs text-foreground">
          <span className="inline-flex items-center gap-1">
            {t("madeWith")}
            <img src={lovableLogo.url} alt="Lovable" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
            {t("byDaniela")} ·
          </span>
          <Button asChild variant="link" className="min-h-11 whitespace-normal px-1 py-2 text-xs text-foreground underline underline-offset-4">
            <a href="https://www.linkedin.com/in/ikonomovad/" target="_blank" rel="noopener noreferrer">
              {t("connectLinkedIn")}
            </a>
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
}