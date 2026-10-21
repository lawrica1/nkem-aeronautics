import { Phone, Mail } from "lucide-react";
import { ContactMessageForm } from "@/components/ContactMessageForm";
import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Customer Service — Nkem Aeronautics",
  description: "Get help from Nkem Aeronautics customer service — call or email us.",
};

const QUICK_CONTACTS = [
  { icon: Mail, label: "Email", value: "nkem@nkemaeronautics.com", href: "mailto:nkem@nkemaeronautics.com" },
  { icon: Phone, label: "Telephone", value: "+237 670 439 117", href: "tel:+237670439117" },
];

export default function CustomerServicePage() {
  return (
    <main className="flex-1">
      <PageHero
        image="/images/about/manufacturing-facility.jpeg"
        eyebrow="We're Here To Help"
        title="Customer Service"
        intro="Reach our team directly, or drop a message below and we'll get back to you."
        crumbs={[{ label: "Home", href: "/" }, { label: "Customer Service" }]}
      />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy-dark">Quick Contact</h2>
              <div className="mt-6 space-y-4">
                {QUICK_CONTACTS.map((c) => (
                  <div key={c.label} className="flex items-start gap-4 rounded-xl border border-border bg-background p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
                      <c.icon className="size-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{c.label}</p>
                      <a
                        href={c.href}
                        target={c.external ? "_blank" : undefined}
                        rel={c.external ? "noreferrer" : undefined}
                        className="mt-0.5 text-sm font-medium text-brand-blue hover:underline"
                      >
                        {c.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-brand-navy-dark">Send Us a Message</h2>
              <p className="mt-2 text-muted-foreground">
                Drop a message or comment for our customer service team below.
              </p>
              <div className="mt-6">
                <ContactMessageForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
