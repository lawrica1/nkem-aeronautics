import { BarChart3, Droplets, FileWarning } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const CHALLENGES = [
  {
    icon: BarChart3,
    title: "Inaccurate Distribution",
    description:
      "Resource allocation for chemicals and equipment is based on estimates, not real farmer counts per region.",
  },
  {
    icon: Droplets,
    title: "Manual Spraying Limits",
    description:
      "Ground-based spraying is slow, uneven, and struggles to cover large or hard-to-reach farmland.",
  },
  {
    icon: FileWarning,
    title: "Disconnected Records",
    description:
      "Without a shared logbook, firms and the ministry can't verify who's farming what, or where.",
  },
];

export function Challenges() {
  return (
    <section className="flex min-h-screen flex-col justify-center border-t border-white/10 bg-brand-navy px-6 py-24 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-4 text-xs font-semibold tracking-widest text-brand-gold uppercase">
              The Challenge
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Struggling with <span className="text-brand-gold">inaccurate distribution</span>,
              manual spraying limits, or disconnected farm records?
            </h2>
          </Reveal>
          <Reveal delay={100} className="flex items-center">
            <p className="text-lg text-white/70">
              Estimates instead of real data lead to chemicals and equipment landing in the wrong
              places. Nkem Aeronautics replaces guesswork with a registered farmer base, aerial
              spraying, and a shared logbook firms and government bodies can actually rely on.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {CHALLENGES.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 120}>
              <div className="h-full rounded-lg border border-white/10 bg-white/5 p-6">
                <div className="flex size-10 items-center justify-center rounded-md border border-brand-gold/30 bg-brand-gold/10">
                  <Icon className="size-5 text-brand-gold" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-white/60">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
