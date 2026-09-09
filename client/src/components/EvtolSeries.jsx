"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { APPLICATIONS } from "@/lib/applications";
import { formatXAF } from "@/lib/currency";
import { Reveal } from "@/components/Reveal";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";

function ApplicationCard({ application, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="block w-full text-center">
      <div
        className={`relative mx-auto max-w-sm overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-lg ${active ? "ring-2 ring-brand-green ring-offset-2" : ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={application.image} alt="" className="aspect-[4/3] w-full object-cover" />
        {active && (
          <span className="absolute top-3 right-3 rounded-full bg-brand-green px-2.5 py-1 text-xs font-medium text-white">
            Selected
          </span>
        )}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-brand-navy-dark">{application.label}</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{application.blurb}</p>
    </button>
  );
}

function DroneCard({ product }) {
  return (
    <Link href={`/drones/${product.slug}`} className="group block overflow-hidden rounded-lg border border-border">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-gray-light">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} className="size-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">Image coming soon</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-green">{product.type}</p>
        <h3 className="mt-1 font-semibold text-brand-navy-dark">{product.name}</h3>
        {product.description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
        )}
        <p className="mt-2 text-sm font-medium text-brand-navy-dark">{formatXAF(product.price)}</p>
      </div>
    </Link>
  );
}

export function EvtolSeries() {
  const [activeApplication, setActiveApplication] = useState(null);
  const { data: products, isLoading } = useProducts("evtol", undefined, activeApplication);

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="relative h-28 sm:h-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero/evtol-large-uav.jpeg" alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-brand-navy-dark/40 to-transparent" />
        </div>
        <div className="bg-brand-navy-dark px-6 py-8 text-white sm:px-10">
          <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">EVTOL &amp; Large UAV Series</h2>
          <p className="mt-1 max-w-xl text-white/70">Advanced Low-Altitude UAV Solutions</p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/85">
            Nkem eVTOL UAV platforms combine vertical takeoff flexibility with fixed-wing efficiency, enabling
            long-endurance, high-payload, and mission-ready performance across complex operational environments.
            Designed for inspection, logistics, emergency response, and special mission applications, they deliver
            reliable and efficient aerial solutions for diverse industry needs.
          </p>
        </div>
      </div>

      {/* Applications */}
      <Reveal className="mt-14">
        <h3 className="text-center text-2xl font-bold text-brand-navy-dark sm:text-3xl">Application Scenarios</h3>
        <div className="mx-auto mt-10 grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {APPLICATIONS.map((application, index) => (
            <Reveal key={application.id} delay={index * 80}>
              <ApplicationCard
                application={application}
                active={activeApplication === application.id}
                onClick={() => setActiveApplication(activeApplication === application.id ? null : application.id)}
              />
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Drones */}
      <div className="mt-10">
        {isLoading && <p className="text-sm text-muted-foreground">Loading platforms…</p>}
        {!isLoading && products?.length === 0 && (
          <p className="text-sm text-muted-foreground">No platforms match this application yet.</p>
        )}
        {!isLoading && products?.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 100}>
                <DroneCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <QuoteRequestForm sector="evtol" />
      </div>
    </div>
  );
}
