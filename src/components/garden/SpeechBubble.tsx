export function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="speech-bubble relative max-w-[16rem] rounded-card bg-card px-4 py-3 font-body text-sm leading-snug text-card-foreground shadow-soft">
      {children}
    </div>
  );
}
