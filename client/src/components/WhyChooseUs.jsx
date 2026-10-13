import { MapPin, BarChart3, Layers, UserCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const REASONS = [
  {
    icon: MapPin,
    title: "Regional Coverage",
    description: "Operating across Zambia and Africa.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Allocation",
    description: "Every challenge counts, replaces loss and insecurity across regions and countries.",
  },
  {
    icon: Layers,
    title: "Dual-Sector Expertise",
    description: "Agricultural and wildlife & surveillance drone operations under one roof.",
  },
  {
    icon: UserCheck,
    title: "First Design",
    description: "A simple sign-up flow built to work for every individual/personnel, not just the tech.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Why Nkem Aeronautics"
          title="Built for Agriculture, Wildlife Conservation and Surveillance Challenges Across Every Region and Country"
          className="max-w-3xl"
        />

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 100} className="border-t-2 border-brand-ink pt-6">
              <Icon className="size-6 text-brand-blue" />
              <h3 className="mt-5 text-lg font-semibold text-brand-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
