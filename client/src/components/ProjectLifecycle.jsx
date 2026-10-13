import { Boxes, CheckCircle2, ClipboardList, Cog, Factory, Network, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

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
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Project Lifecycle"
          title="From concept to delivery"
          intro="A streamlined workflow from concept development to final delivery."
        />

        <div className="relative mt-14">
          {/* Connector line behind the step markers on wide screens */}
          <span aria-hidden="true" className="absolute top-6 right-[10%] left-6 hidden h-px bg-brand-line lg:block" />
          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {LIFECYCLE_STEPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal as="li" key={title} delay={index * 90} className="relative flex flex-col gap-4">
              <div className="relative flex size-12 items-center justify-center rounded-full border border-brand-line bg-white text-brand-blue shadow-sm">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="font-mono text-xs tracking-widest text-neutral-400">
                  STEP {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
              </div>
            </Reveal>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function ManufacturingProcess() {
  return (
    <section className="relative overflow-hidden bg-brand-navy-dark px-6 py-20 text-white sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Manufacturing" title="Manufacturing Process" tone="dark" />
          <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {MANUFACTURING_STEPS.map(([number, title, description], i) => (
              <Reveal as="li" key={number} delay={i * 90} className="grid grid-cols-[3.5rem_1fr] gap-4 py-6">
                <p className="font-mono text-2xl font-medium text-brand-blue-light">{number}</p>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-white/60">{description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={150} className="flex flex-col justify-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand-blue">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">Global Quality Control</h3>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Quality System", "Manufacturing Control"].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium"
                >
                  <CheckCircle2 className="size-4 text-brand-blue-light" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-white/70">
              Strict quality control applied across design, production, and final inspection to
              ensure consistent UAV performance and reliability.
            </p>
          </div>

          <div className="flex items-start gap-4 rounded-2xl bg-brand-blue p-7">
            <Factory className="mt-1 size-6 shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">In-Factory Video Tour</h3>
              <p className="mt-2 text-sm leading-6 text-white/85">
                Explore manufacturing facilities, production processes, and quality control systems.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
