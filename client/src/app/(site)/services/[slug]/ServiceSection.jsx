import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const H2 = "text-3xl font-bold tracking-tight text-brand-navy-dark sm:text-4xl";
const LABEL = "text-xs font-semibold tracking-widest text-brand-blue uppercase";
const BODY = "text-lg leading-relaxed text-muted-foreground";

function Wrap({ section, alt, children }) {
  return (
    <section
      id={section.id}
      className={`scroll-mt-16 px-6 py-20 sm:py-24 ${alt ? "bg-brand-gray-light" : "bg-white"}`}
    >
      {children}
    </section>
  );
}

function Photo({ src, alt, className = "h-72 sm:h-96", sizes = "(max-width: 1024px) 100vw, 50vw" }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl shadow-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes={sizes}
      />
    </div>
  );
}

function Points({ items }) {
  if (!items) return null;
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-base text-muted-foreground">
          <CheckCircle2 className="mt-1 size-4 shrink-0 text-brand-blue" />
          {item}
        </li>
      ))}
    </ul>
  );
}

// One block of a service detail page; shapes are documented on SERVICES[].sections in lib/services.js.
export function ServiceSection({ section: s, alt }) {
  if (s.type === "banner") {
    return (
      <section id={s.id} className="relative scroll-mt-16 overflow-hidden bg-brand-navy-dark px-6 py-28 text-white">
        <Image src={s.image} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-dark/95 via-brand-navy-dark/70 to-brand-navy-dark/10" />
        <div className="relative mx-auto max-w-6xl">
          {s.label && <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">{s.label}</p>}
          <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">{s.title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{s.text}</p>
        </div>
      </section>
    );
  }

  if (s.type === "feature") {
    return (
      <Wrap section={s} alt={alt}>
        <div className="mx-auto max-w-6xl">
          {s.topic && <h2 className={`mb-14 text-center ${H2}`}>{s.topic}</h2>}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className={s.reverse ? "lg:order-last" : ""}>
              <Photo src={s.image} alt={s.title} />
            </div>
            <div>
              {s.label && <p className={LABEL}>{s.label}</p>}
              <h3 className={`${s.label ? "mt-2" : ""} ${H2}`}>{s.title}</h3>
              <div className="mt-5 h-1 w-14 rounded-full bg-brand-blue" />
              {s.text && <p className={`mt-5 ${BODY}`}>{s.text}</p>}
              <Points items={s.points} />
            </div>
          </div>
        </div>
      </Wrap>
    );
  }

  if (s.type === "text") {
    if (s.image) {
      return (
        <Wrap section={s} alt={alt}>
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className={LABEL}>{s.label}</p>
              {s.heading && <h2 className={`mt-2 ${H2}`}>{s.heading}</h2>}
              <div className={`mt-6 space-y-4 ${BODY}`}>
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Points items={s.points} />
            </div>
            <Photo src={s.image} alt={s.label} />
          </div>
        </Wrap>
      );
    }
    return (
      <Wrap section={s} alt={alt}>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className={LABEL}>{s.label}</p>
            {s.heading && <h2 className={`mt-2 ${H2}`}>{s.heading}</h2>}
          </div>
          <div className={`space-y-5 border-l-4 border-brand-blue pl-6 lg:col-span-3 ${BODY}`}>
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Wrap>
    );
  }

  if (s.type === "showcase") {
    return (
      <Wrap section={s} alt={alt}>
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={H2}>{s.heading}</h2>
            <p className={`mt-4 ${BODY}`}>{s.subtitle}</p>
          </div>
          {/* scale hides the dark rounded corners baked into the source photo */}
          <div className="relative mt-12 aspect-[3/2] overflow-hidden rounded-3xl shadow-xl">
            <Image src={s.image} alt={s.caption.title} fill className="scale-[1.04] object-cover" sizes="(max-width: 1024px) 100vw, 64rem" />
          </div>
          <div className="relative mx-4 -mt-16 rounded-2xl border border-border bg-white p-6 shadow-lg sm:mx-12 sm:p-8">
            <p className={LABEL}>In-house</p>
            <h3 className="mt-1 text-xl font-semibold text-brand-navy-dark">{s.caption.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{s.caption.text}</p>
          </div>
        </div>
      </Wrap>
    );
  }

  if (s.type === "benefits") {
    return (
      <Wrap section={s} alt={alt}>
        <div className="mx-auto max-w-6xl">
          {s.heading && (
            <div className="mb-12 max-w-3xl">
              {s.label && <p className={LABEL}>{s.label}</p>}
              <h2 className={`${s.label ? "mt-2" : ""} ${H2}`}>{s.heading}</h2>
            </div>
          )}
          <div className={s.image ? "grid items-center gap-12 lg:grid-cols-2" : ""}>
            <div className={`grid gap-10 ${s.image ? "" : "sm:grid-cols-2"}`}>
              {s.items.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue">
                    <Icon className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-navy-dark">{title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            {s.image && <Photo src={s.image} alt={s.heading ?? ""} />}
          </div>
        </div>
      </Wrap>
    );
  }

  if (s.type === "threats") {
    return (
      <Wrap section={s} alt={alt}>
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className={LABEL}>{s.label}</p>
            <h2 className={`mt-2 ${H2}`}>{s.heading}</h2>
            <p className={`mt-4 ${BODY}`}>{s.text}</p>
          </div>
          {s.image && (
            <Photo src={s.image} alt={s.heading} className="mx-auto mt-12 h-64 max-w-5xl sm:h-80" sizes="(max-width: 1024px) 100vw, 64rem" />
          )}
          {/* flex-wrap + centre so an odd last row sits in the middle instead of leaving a hole */}
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {s.items.map((item, i) => (
              <div
                key={item.title}
                className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="flex-1 p-6">
                  <span className="text-sm font-bold text-brand-blue">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-1 text-xl font-semibold text-brand-navy-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Wrap>
    );
  }

  return null;
}
