import Link from "next/link";
import {
  MapPin,
  MessageCircle,
  Mail,
  Globe,
  Clock,
  ArrowRight,
  Headphones,
} from "lucide-react";

export const metadata = {
  title: "Contact — Nkem Aeronautics",
  description: "Get in touch with Nkem Aeronautics. Find our address, WhatsApp, and email details.",
};

const WHATSAPP_NUMBER = "237670439117";

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: "Headquarters",
    value: "Junction of Cairo Road and Independence Avenue\nLusaka 10101, Zambia",
    multiline: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: "nkem@aeronautics.com",
    href: "mailto:nkem@aeronautics.com",
  },
  {
    icon: Globe,
    label: "Website",
    value: "nkemaeronautics.com",
    href: "https://nkemaeronautics.com",
    external: true,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Monday – Friday: 8:00 AM – 5:00 PM\nSaturday: 9:00 AM – 1:00 PM",
    multiline: true,
  },
];

const FAQS = [
  {
    q: "How do I request an aerial service?",
    a: "Create a free account on the Nkem platform, complete verification, then log in and use your portal to submit a service request. Our team will review it and respond promptly.",
  },
  {
    q: "Which areas do you currently serve?",
    a: "We operate across Zambia and the broader Africa region. Our current primary focus is the mining, agricultural, wildlife & surveillance, and military operations sectors. Contact us to confirm availability in your area.",
  },
  {
    q: "Can I purchase a drone directly?",
    a: "Yes. You can browse our drone catalogue and make enquiries directly. For purchases, contact us via WhatsApp or email and our team will guide you through the process.",
  },
  {
    q: "Do you work with government agencies?",
    a: "Yes. We support government-related surveying, pipeline inspection, and wildlife surveillance operations. Please contact us directly to discuss your requirements.",
  },
  {
    q: "Are you working/planning to become a manufacturer or retailer in drone technology?",
    a: "Yes, we do offer services and special mentorship.",
  },
  {
    q: "What does Nkem Aeronautics do?",
    a: "For pipeline operators, Nkem Aeronautics provides aerial drone inspection for oil, gas, water, and industrial pipelines — capturing high-resolution imagery and thermal data along the right-of-way to help identify surface corrosion, leaks, encroachments, and other visible integrity risks for maintenance planning and regulatory compliance.",
  },
  {
    q: "Which industries does Nkem Aeronautics serve?",
    a: "We support operators of oil and gas pipelines, water transmission networks, and industrial pipeline systems who need reliable aerial condition data for maintenance planning, risk reduction, and long-term asset monitoring.",
  },
  {
    q: "Where does Nkem Aeronautics operate?",
    a: "Nkem Aeronautics is based in Zambia and operates across the broader Africa region. We don't currently have offices outside Africa — contact us to confirm availability for a specific location.",
  },
];

function ContactCard({ detail }) {
  const Icon = detail.icon;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-background p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
        <Icon className="size-5 text-brand-blue" />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {detail.label}
        </p>
        {detail.href ? (
          <a
            href={detail.href}
            target={detail.external ? "_blank" : undefined}
            rel={detail.external ? "noreferrer" : undefined}
            className="mt-0.5 text-sm font-medium text-brand-blue hover:underline"
          >
            {detail.value}
          </a>
        ) : (
          <p className="mt-0.5 whitespace-pre-line text-sm text-brand-navy-dark">
            {detail.value}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="flex-1">
      {/* Page hero */}
      <section className="bg-brand-navy px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-widest text-white/60 uppercase">
            Get In Touch
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Contact <span className="text-white">Nkem Aeronautics</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Whether you have a service enquiry, need to purchase a drone, or want to discuss a
            partnership — we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact details + FAQ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            {/* Contact details */}
            <div>
              <h2 className="text-2xl font-bold text-brand-navy-dark">Our Details</h2>
              <p className="mt-2 text-muted-foreground">
                Reach us through any of the channels below.
              </p>

              <Link
                href="/customer-service"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-navy px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-navy/90"
              >
                <Headphones className="size-4" />
                Customer Service
              </Link>

              <div className="mt-8 space-y-4">
                {CONTACT_DETAILS.map((d) => (
                  <ContactCard key={d.label} detail={d} />
                ))}
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-blue-dark"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-2xl font-bold text-brand-navy-dark">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-muted-foreground">
                Quick answers to common questions about our services.
              </p>

              <div className="mt-8 space-y-5">
                {FAQS.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-border bg-background p-5"
                  >
                    <p className="font-semibold text-brand-navy-dark">{faq.q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-brand-gray-light p-6">
                <p className="font-semibold text-brand-navy-dark">Ready to get started?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a free account and start requesting services or browsing our drone
                  catalogue.
                </p>
                <Link
                  href="/signup"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
                >
                  Sign Up Now
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
