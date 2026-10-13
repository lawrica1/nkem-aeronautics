import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

// Shared eyebrow + heading + intro block so every home/services section opens the same way.
export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", className, children }) {
  const dark = tone === "dark";
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase",
            dark ? "text-brand-blue-light" : "text-brand-blue",
          )}
        >
          <span className={cn("h-px w-8", dark ? "bg-brand-blue-light" : "bg-brand-blue")} />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          dark ? "text-white" : "text-brand-ink",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("text-base leading-relaxed sm:text-lg", dark ? "text-white/65" : "text-neutral-600")}>
          {intro}
        </p>
      )}
      {children}
    </Reveal>
  );
}
