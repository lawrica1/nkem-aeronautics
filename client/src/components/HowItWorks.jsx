import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    number: "01",
    title: "Sign Up",
    description: "Register your farm details and declare your firm affiliation.",
  },
  {
    number: "02",
    title: "Get Your Logbook ID",
    description: "Receive a unique identification and logbook entry instantly.",
  },
  {
    number: "03",
    title: "Request a Service",
    description: "Request chemical spraying or another aerial service when you need it.",
  },
  {
    number: "04",
    title: "Routed & Fulfilled",
    description: "Your affiliated firm receives the request and supplies the service.",
  },
];

export function HowItWorks() {
  return (
    <section className="flex min-h-screen flex-col justify-center border-t border-white/10 bg-brand-navy px-6 py-24 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold tracking-widest text-brand-gold uppercase">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From Sign Up to Service, in Four Steps
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.number} delay={index * 120}>
              <p className="text-4xl font-bold text-brand-gold/40">{step.number}</p>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-white/70">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
