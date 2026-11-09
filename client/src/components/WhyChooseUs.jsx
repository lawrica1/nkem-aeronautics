import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

// "Choose your path" cards: one entry point per kind of visitor, each linking to a real flow.
const PATHS = [
  {
    label: "Farmers",
    title: "Register & Request",
    points: ["Unique logbook ID", "Declare your firm affiliation", "Request spraying when you need it"],
    href: "/signup",
    action: "Sign Up",
    featured: true,
  },
  {
    label: "Buyers",
    title: "Drones & Parts",
    points: ["Agricultural drone catalogue", "Request a quote", "Cash or bank transfer"],
    href: "/services/agricultural",
    action: "Browse Drones",
  },
  {
    label: "Operators",
    title: "Mining, Pipeline & Survey",
    points: ["Site surveys & inspection", "Thermal & night-time operations", "GIS-ready deliverables"],
    href: "/services/mining",
    action: "View Services",
  },
  {
    label: "Firms & Government",
    title: "Data & Partnership",
    points: ["Registered farmer data", "Firm routing & distribution", "Regional coverage"],
    href: "/contact",
    action: "Contact Us",
  },
];

const REASONS = [
  ["Regional Coverage", "Operating across Zambia and Africa."],
  ["Data-Driven Allocation", "Every challenge counts, replaces loss and insecurity across regions and countries."],
  ["Dual-Sector Expertise", "Agricultural and wildlife & surveillance drone operations under one roof."],
  ["First Design", "A simple sign-up flow built to work for every individual/personnel, not just the tech."],
];

export function WhyChooseUs() {
  return (
    <section className="bg-brand-paper px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Why Nkem Aeronautics"
          title="Choose Your Path"
          intro="Built for Agriculture, Wildlife Conservation and Surveillance Challenges Across Every Region and Country."
          align="center"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PATHS.map(({ label, title, points, href, action, featured }, i) => (
            <Reveal
              key={label}
              delay={i * 90}
              className={cn(
                "flex flex-col rounded-2xl border bg-white p-6",
                featured ? "border-brand-blue shadow-[0_20px_50px_-24px_rgba(45,53,245,0.55)]" : "border-neutral-200",
              )}
            >
              <p className={cn("text-[11px] font-semibold tracking-[0.14em] uppercase", featured ? "text-brand-blue" : "text-neutral-500")}>
                {label}
              </p>
              <h3 className="mt-3 font-display text-lg font-normal tracking-tight text-brand-black">{title}</h3>
              <ul className="mt-5 flex-1 space-y-2.5 border-t border-neutral-200 pt-5">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-neutral-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-blue" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className={cn(
                  "group mt-7 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-xs font-semibold tracking-[0.12em] uppercase transition-colors",
                  featured
                    ? "bg-brand-blue text-white hover:bg-brand-blue-dark"
                    : "border border-neutral-300 text-brand-black hover:border-brand-blue hover:text-brand-blue",
                )}
              >
                {action}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>

        <dl className="mt-16 grid gap-8 border-t border-neutral-200 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(([title, description], i) => (
            <Reveal key={title} delay={i * 80}>
              <dt className="font-display text-sm text-brand-black">{title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
