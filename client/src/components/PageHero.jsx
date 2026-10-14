import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/SectionHeading";

// Photo-led page header: a full-width photograph with a white title card, shared by the
// services, products and detail pages. `crumbs` renders a breadcrumb trail above the title.
export function PageHero({ image, eyebrow, title, intro, crumbs, children, priority = true }) {
  return (
    <section className="relative isolate bg-brand-paper">
      <div className="relative h-[19rem] w-full sm:h-[26rem] lg:h-[30rem]">
        <Image src={image} alt="" fill priority={priority} sizes="100vw" className="object-cover" />
      </div>
      <div className="relative mx-auto -mt-24 max-w-6xl px-4 pb-10 sm:-mt-36 sm:px-6">
        <div className="rounded-2xl bg-white p-6 shadow-[0_24px_60px_-30px_rgba(11,13,18,0.45)] sm:p-10 lg:max-w-3xl">
          {crumbs && (
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-1 text-xs text-neutral-500">
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="size-3" />}
                    {c.href ? (
                      <Link href={c.href} className="hover:text-brand-blue">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-brand-black">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-4 font-display text-3xl leading-[1.12] font-light tracking-[-0.02em] text-balance text-brand-black sm:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600">{intro}</p>}
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}

// Button styles shared across the light design.
export const BTN_PRIMARY =
  "group inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";
export const BTN_SECONDARY =
  "inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-6 py-3 text-xs font-semibold tracking-[0.12em] text-brand-black uppercase transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";
