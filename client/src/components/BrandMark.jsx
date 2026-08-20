import { cn } from "@/lib/utils";

// Minimalist quadcopter glyph in a circular badge — placeholder brand mark
// until the client supplies a real logo/icon asset.
export function BrandMark({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-float flex size-14 items-center justify-center rounded-full bg-brand-gold/90 shadow-lg",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-7 text-brand-navy-dark">
        <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.5 6.5L10 10M17.5 6.5L14 10M6.5 17.5L10 14M17.5 17.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1.2" fill="currentColor" />
      </svg>
    </div>
  );
}
