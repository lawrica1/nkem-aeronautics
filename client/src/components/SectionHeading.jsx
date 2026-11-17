import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

// ">>> LABEL" eyebrow used above every section heading.
export function Eyebrow({ children, tone = "light", className }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase",
        tone === "dark" ? "text-white/70" : "text-brand-black/70",
        className,
      )}
    >
      <span aria-hidden="true" className="font-display tracking-[-0.1em] text-brand-blue">
        &rsaquo;&rsaquo;&rsaquo;
      </span>
      {children}
    </p>
  );
}

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
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "font-display text-[1.75rem] leading-[1.15] font-normal tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.6rem]",
          dark ? "text-white" : "text-brand-black",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("text-base leading-relaxed", dark ? "text-white/65" : "text-neutral-600")}>{intro}</p>
      )}
      {children}
    </Reveal>
  );
}
