import { ArrowRight, BarChart3, Droplets, FileWarning } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

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

export function Challenges() {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <SectionHeading
          eyebrow="The Challenge"
          title="Struggling with inaccurate survey, mapping, security, delivery, distribution, manual spraying limits, or disconnected farms with data?"
          intro="Estimates instead of real data lead to chemicals and equipment landing in the wrong places. Nkem Aeronautics replaces guesswork with a registered farmer base, aerial spraying, and a shared logbook firms and government bodies can actually rely on."
          className="lg:sticky lg:top-8 lg:self-start"
        />

        <ul className="divide-y divide-brand-line border-y border-brand-line">
          {CHALLENGES.map(({ icon: Icon, title, description, answer }, index) => (
            <Reveal as="li" key={title} delay={index * 100} className="grid gap-5 py-8 sm:grid-cols-[3rem_1fr] sm:gap-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand-gray-light text-brand-blue">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{description}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                  <ArrowRight className="size-4" />
                  {answer}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
