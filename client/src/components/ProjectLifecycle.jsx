import Image from "next/image";
import { Boxes, CheckCircle2, ClipboardList, Cog, Network, Wrench } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow, SectionHeading } from "@/components/SectionHeading";

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
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Project Lifecycle"
          title="From Concept to Delivery"
          intro="A streamlined workflow from concept development to final delivery."
          align="center"
        />

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LIFECYCLE_STEPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal
              as="li"
              key={title}
              delay={index * 90}
              className="flex flex-col rounded-2xl border border-neutral-200 p-5 transition-colors hover:border-brand-blue"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-brand-blue" />
                <span className="font-display text-xs text-neutral-400">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 font-display text-sm font-normal tracking-tight text-brand-black">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ManufacturingProcess() {
  return (
    <section className="bg-brand-paper px-4 py-20 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Eyebrow>Manufacturing</Eyebrow>
            <h2 className="mt-4 font-display text-[1.75rem] leading-[1.15] font-normal tracking-[-0.02em] text-brand-black sm:text-4xl">
              Manufacturing Process
            </h2>
            <ol className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
              {MANUFACTURING_STEPS.map(([number, title, description], i) => (
                <Reveal as="li" key={number} delay={i * 90} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <p className="font-display text-lg text-brand-blue">{number}</p>
                  <div>
                    <h3 className="font-display text-sm font-normal text-brand-black">{title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{description}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <div className="mt-8">
              <h3 className="font-display text-base font-normal text-brand-black">Global Quality Control</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {["Quality System", "Manufacturing Control"].map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-brand-black"
                  >
                    <CheckCircle2 className="size-3.5 text-brand-blue" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                Strict quality control applied across design, production, and final inspection to
                ensure consistent UAV performance and reliability.
              </p>
            </div>
          </div>

          <Reveal delay={150} className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="relative min-h-80 flex-1">
            <Image
              src="/images/about/manufacturing-facility.jpeg"
              alt="VTOL drones on the Nkem Aeronautics factory floor"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            </div>
            <div className="p-6">
              <h3 className="font-display text-lg font-normal text-brand-black">In-Factory Video Tour</h3>
              <p className="mt-1.5 text-sm leading-6 text-neutral-600">
                Explore manufacturing facilities, production processes, and quality control systems.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
