import Link from "next/link";
import { ArrowRight, BarChart3, Droplets, FileWarning } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/SectionHeading";
import { FIRM_OPTIONS } from "@/lib/firms";

const CHALLENGES = [
  {
    icon: BarChart3,
    title: "Inaccurate Distribution",
    description:
      "Resource allocation for chemicals and equipment is based on estimates, not real farmer counts per region.",
    answer: "Registered farmer base",
  },
  {
    icon: Droplets,
    title: "Manual Spraying Limits",
    description:
      "Ground-based spraying is slow, uneven, and struggles to cover large or hard-to-reach farmland.",
    answer: "Precision aerial spraying",
  },
  {
    icon: FileWarning,
    title: "Disconnected Records",
    description:
      "Without a shared logbook, firms and the ministry can't verify who's farming what, or where.",
    answer: "One shared logbook",
  },
];

// Affiliations a farmer can declare at sign-up, shown as a name row along the band's foot.
const AFFILIATIONS = FIRM_OPTIONS.filter((f) => !["none", "other"].includes(f.value)).map((f) =>
  f.label.replace(" / Plantations Haut Penja (PHP)", " / PHP"),
);

export function Challenges() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6">
      <div className="relative mx-auto max-w-6xl">
        <div className="rounded-3xl border border-neutral-200 bg-brand-paper px-6 pt-12 pb-10 sm:px-12 sm:pt-16">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Eyebrow>The Challenge</Eyebrow>
            <h2 className="mt-5 font-display text-xl leading-snug font-light tracking-[-0.01em] text-balance text-brand-black sm:text-3xl">
              Struggling with inaccurate survey, mapping, security, delivery, distribution, manual
              spraying limits, or disconnected farms with data?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
              Estimates instead of real data lead to chemicals and equipment landing in the wrong
              places. Nkem Aeronautics replaces guesswork with a registered farmer base, aerial
              spraying, and a shared logbook firms and government bodies can actually rely on.
            </p>
            <Link
              href="/signup"
              className="group mt-8 inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-blue-dark"
            >
              Join Us Now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>

          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {CHALLENGES.map(({ icon: Icon, title, description, answer }, index) => (
              <Reveal
                as="li"
                key={title}
                delay={index * 100}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <Icon className="size-5 text-brand-blue" />
                <h3 className="mt-4 font-display text-sm font-normal tracking-tight text-brand-black">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{description}</p>
                <p className="mt-5 inline-flex items-center gap-2 border-t border-neutral-200 pt-4 text-xs font-semibold tracking-[0.12em] text-brand-blue uppercase">
                  <ArrowRight className="size-3.5" />
                  {answer}
                </p>
              </Reveal>
            ))}
          </ul>

          <div className="mt-14 border-t border-neutral-200 pt-8">
            <p className="text-center text-[11px] tracking-[0.18em] text-neutral-500 uppercase">
              Farmer affiliations supported at sign-up
            </p>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {AFFILIATIONS.map((name) => (
                <li key={name} className="font-display text-sm font-medium tracking-tight text-brand-black/80 sm:text-base">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
