import { useState } from "react";
import { Award } from "lucide-react";
import { BIRDS } from "@/data/birds";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** Small laurel badge showing the current book number (completed + 1). */
export function BookBadge({ completed }: { completed: number }) {
  const { t } = useLanguage();
  return (
    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-rare/25 px-2 py-0.5 font-display text-[11px] text-card-foreground">
      <Award aria-hidden="true" className="size-3.5" />{t("bookNumber", { n: completed + 1 })}
    </span>
  );
}

/** "Book complete" panel; renders only when every bird is collected. */
export function BookComplete({ collected, completed, onConfirm }: { collected: number; completed: number; onConfirm: () => void }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  if (collected < BIRDS.length) return null;
  return (
    <section className="rounded-card bg-card p-4 text-center text-card-foreground shadow-soft">
      <h2 className="font-display text-xl text-foreground">{t("bookComplete", { n: completed + 1 })}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("bookCompleteText", { count: BIRDS.length })}</p>
      <Button className="mt-3 min-h-11" onClick={() => setOpen(true)}>{t("startNewBook")}</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-card border-0 bg-card text-card-foreground shadow-soft">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-foreground">{t("newBookTitle")}</DialogTitle>
            <DialogDescription>{t("newBookText")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="min-h-11" onClick={() => setOpen(false)}>{t("cancel")}</Button>
            <Button className="min-h-11" onClick={() => { onConfirm(); setOpen(false); }}>{t("confirmNewBook")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/** "Books completed: n" — hidden until the first book is finished. */
export function BooksCompleted({ completed }: { completed: number }) {
  const { t } = useLanguage();
  if (completed < 1) return null;
  return <p className="-mt-2 text-center font-display text-sm text-foreground">{t("booksCompleted", { n: completed })}</p>;
}
