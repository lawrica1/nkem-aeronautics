import { Phone, Mail, MessageCircle } from "lucide-react";
import { ContactMessageForm } from "@/components/ContactMessageForm";

export const metadata = {
  title: "Customer Service — Nkem Aeronautics",
  description: "Get help from Nkem Aeronautics customer service — call, WhatsApp, email, or send us a message.",
};

const WHATSAPP_NUMBER = "237670439117";

const QUICK_CONTACTS = [
  { icon: Phone, label: "Telephone", value: "+237 670 439 117", href: "tel:+237670439117" },
  { icon: MessageCircle, label: "WhatsApp", value: "+237 670 439 117", href: `https://wa.me/${WHATSAPP_NUMBER}`, external: true },
  { icon: Mail, label: "Email", value: "nkem@aeronautics.com", href: "mailto:nkem@aeronautics.com" },
];

export default function CustomerServicePage() {
  return (
    <main className="flex-1">
      <section className="bg-brand-navy px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-widest text-white/60 uppercase">
            We&apos;re Here To Help
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Customer Service</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Reach our team directly, or drop a message below and we&apos;ll get back to you.
          </p>
        </div>
      </section>

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
