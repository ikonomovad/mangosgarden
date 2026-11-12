import mangoPhoto from "@/assets/mango-photo.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageProvider";

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
        <img
          src={mangoPhoto.url}
          alt={t("mangoPhotoAlt")}
          loading="lazy"
          width={768}
          height={1023}
          className="mt-5 aspect-[4/3] w-full rounded-xl object-cover object-[center_40%] shadow-soft"
        />
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
        <DialogClose asChild>
          <Button className="h-11 rounded-full font-display">{t("close")}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}