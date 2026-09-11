"use client";

import { useEffect, useState } from "react";
import { SectorTabs } from "@/components/SectorTabs";
import { AgriDroneFilter } from "@/components/AgriDroneFilter";
import { ProductCarousel } from "@/components/ProductCarousel";
import { EvtolSeries } from "@/components/EvtolSeries";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { BrandMark } from "@/components/BrandMark";

const CATALOG_COPY = {
  agricultural: {
    heading: "Agricultural Drone & Operation Matcher",
    subtitle:
      "Select your crop configuration and operation needs to display matching high-precision UAV platforms.",
  },
  wildlife: {
    heading: "Wildlife & Surveillance Drone & Machinery Catalog",
    subtitle: "Aerial monitoring equipment for conservation and security operations.",
  },
  realestate: {
    heading: "Real Estate & Surveillance Drone Catalog",
    subtitle: "Aerial imaging equipment for property and site documentation.",
  },
  mining: {
    heading: "Mining Drone & Site Monitoring Catalog",
    subtitle: "Aerial equipment for stockpile surveys, mapping, and mine site monitoring.",
  },
};

export function CatalogSection() {
  const [activeSector, setActiveSector] = useState("agricultural");
  const [crop, setCrop] = useState("all");
  const [service, setService] = useState("spraying");
  const isEvtol = activeSector === "evtol";
  const copy = CATALOG_COPY[activeSector];

  // Lets links like "/?sector=evtol#catalog" (e.g. the drone detail page's back link)
  // land directly on the right tab instead of always resetting to Agriculture.
  useEffect(() => {
    const sector = new URLSearchParams(window.location.search).get("sector");
    if (sector) setActiveSector(sector);
  }, []);

  return (
    <section id="catalog" className="relative border-t border-border">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
        <SectorTabs active={activeSector} onChange={setActiveSector} />

        <div className="mt-10">
          {isEvtol ? (
            <EvtolSeries />
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-brand-green">{copy.heading}</h2>
              <p className="mt-2 border-b border-border pb-6 text-muted-foreground">{copy.subtitle}</p>

              {activeSector === "agricultural" && (
                <div className="mt-6">
                  <AgriDroneFilter
                    crop={crop}
                    service={service}
                    onCropChange={setCrop}
                    onServiceChange={setService}
                  />
                </div>
              )}

              <div className="mt-8">
                <ProductCarousel sector={activeSector} cropFilter={crop} serviceFilter={service} />
              </div>

              <div className="mt-12">
                <QuoteRequestForm sector={activeSector} />
              </div>
            </>
          )}
        </div>

        <BrandMark className="absolute right-6 bottom-6 hidden sm:flex" />
      </div>
    </section>
  );
}
