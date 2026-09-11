import { Boxes, ClipboardList, Cog, Network, Wrench } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const LIFECYCLE_STEPS = [
  {
    icon: ClipboardList,
    title: "Consultation",
    description: "Define application requirements and project objectives.",
  },
  {
    icon: Network,
    title: "Design R & D",
    description: "Develop system architecture and engineering solutions.",
  },
  {
    icon: Cog,
    title: "Prototyping",
    description: "Validate design performance through prototype testing.",
  },
  {
    icon: Boxes,
    title: "Mass Production",
    description: "Ensure consistent manufacturing and quality control.",
  },
  {
    icon: Wrench,
    title: "Delivery & Support",
    description: "Ensure reliable product delivery and after-sales support.",
  },
];

const MANUFACTURING_STEPS = [
  ["01", "Briefing", "Define technical requirements and project scope."],
  ["02", "Blueprint", "Complete structural and system design planning."],
  ["03", "Validation", "Conduct functional and reliability testing."],
  ["04", "Scaling", "Support mass production and delivery."],
];

export function ProjectLifecycle() {
  return (
    <section className="border-t border-border bg-background px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy-dark sm:text-4xl">
            Project Lifecycle
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A streamlined workflow from concept development to final delivery.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {LIFECYCLE_STEPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 100} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-border bg-brand-input text-brand-green">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 font-semibold text-brand-navy-dark">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ManufacturingProcess() {
  return (
    <section className="border-t border-white/10 bg-brand-navy px-6 py-24 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Manufacturing Process</h2>
          <div className="mt-10 space-y-6">
            {MANUFACTURING_STEPS.map(([number, title, description]) => (
              <div key={number} className="grid grid-cols-[3rem_1fr] gap-4">
                <p className="text-2xl font-bold text-white/25">{number}</p>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-white/65">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150} className="flex flex-col justify-center gap-5">
          <div className="rounded-lg border border-white/10 bg-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-brand-green">
                <ClipboardList className="size-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Global Quality Control</h3>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <p className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium">
                Quality System
              </p>
              <p className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium">
                Manufacturing Control
              </p>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/75">
              Strict quality control applied across design, production, and final inspection to
              ensure consistent UAV performance and reliability.
            </p>
          </div>

          <div className="rounded-lg bg-brand-green p-6">
            <h3 className="text-2xl font-bold">In-Factory Video Tour</h3>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Explore manufacturing facilities, production processes, and quality control systems.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
