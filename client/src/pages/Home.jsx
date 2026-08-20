import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Challenges } from "@/components/Challenges";
import { Partners } from "@/components/Partners";
import { ServicesOverview } from "@/components/ServicesOverview";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { SectorTabs } from "@/components/SectorTabs";
import { AgriDroneFilter } from "@/components/AgriDroneFilter";
import { ProductCarousel } from "@/components/ProductCarousel";
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
};

export function Home() {
  const [activeSector, setActiveSector] = useState("agricultural");
  const [crop, setCrop] = useState("all");
  const [service, setService] = useState("spraying");
  const { heading, subtitle } = CATALOG_COPY[activeSector];

  return (
    <main className="flex-1">
      <Hero />
      <Challenges />
      <Partners />
      <ServicesOverview />

      <section className="relative border-t border-border">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
          <SectorTabs active={activeSector} onChange={setActiveSector} />

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-brand-green">{heading}</h2>
            <p className="mt-2 border-b border-border pb-6 text-muted-foreground">{subtitle}</p>

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
          </div>

          <BrandMark className="absolute right-6 bottom-6 hidden sm:flex" />
        </div>
      </section>

      <HowItWorks />
      <WhyChooseUs />
    </main>
  );
}
