import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

// Callouts drawn from the capabilities listed on the service pages (src/lib/services.js).
const CALLOUTS = [
  {
    title: "Precision Spraying",
    points: ["Crop spraying & pesticide application", "Crop health & yield assessment", "Farm mapping & boundary survey"],
    position: "lg:left-0 lg:top-[12%]",
    line: "lg:after:left-full lg:after:top-1/2 lg:after:w-24",
  },
  {
    title: "High-Resolution Capture",
    points: ["Photo & video capture", "Topographic & cadastral surveys", "Digital elevation models"],
    position: "lg:right-0 lg:top-[4%]",
    line: "lg:after:right-full lg:after:top-1/2 lg:after:w-20",
  },
  {
    title: "GPS & Geo-Fencing",
    points: ["Wildlife monitoring & tracking", "Anti-poaching patrol operations", "Remote site inspection"],
    position: "lg:left-[4%] lg:bottom-[4%]",
    line: "lg:after:left-full lg:after:top-1/2 lg:after:w-28",
  },
  {
    title: "Long-Range Missions",
    points: ["Heavy-lift payload delivery", "Emergency supply drops", "Thermal & night-time operations"],
    position: "lg:right-[2%] lg:bottom-[14%]",
    line: "lg:after:right-full lg:after:top-1/2 lg:after:w-24",
  },
];

export function FleetCapabilities() {
  return (
    <section id="fleet" className="scroll-mt-6 bg-white px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading eyebrow="Nkem Fleet Capabilities" title="Engineered Beyond Boundaries" />

        <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:mt-4 lg:block lg:h-[30rem]">
          <Reveal className="order-first flex justify-center sm:col-span-2 lg:absolute lg:inset-x-[22%] lg:top-[16%] lg:bottom-[10%]">
            <Image
              src="/images/drones/zam-26a-2.png"
              alt="Nkem VTOL fixed-wing drone"
              width={800}
              height={490}
              sizes="(max-width: 1024px) 90vw, 640px"
              className="h-auto w-full max-w-xl object-contain mix-blend-multiply lg:h-full lg:max-w-none"
            />
          </Reveal>

          {CALLOUTS.map(({ title, points, position, line }, i) => (
            <Reveal
              key={title}
              delay={i * 100}
              className={cn(
                "relative rounded-xl border border-neutral-200 bg-white p-4 lg:absolute lg:w-60 lg:after:absolute lg:after:h-px lg:after:bg-brand-blue/50 lg:after:content-['']",
                position,
                line,
              )}
            >
              <p className="inline-flex rounded bg-brand-blue px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
                {title}
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-neutral-600">
                {points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-blue" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
