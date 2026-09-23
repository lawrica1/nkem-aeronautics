"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, Truck, Zap, Siren, Flame, Cog, Layers, ChevronDown, BarChart3, Users2, Wrench, Droplets, GitCompare, ScanSearch } from "lucide-react";
import { SectorTabs } from "@/components/SectorTabs";
import { AgriDroneFilter } from "@/components/AgriDroneFilter";
import { ProductCarousel } from "@/components/ProductCarousel";
import { EvtolSeries } from "@/components/EvtolSeries";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { BrandMark } from "@/components/BrandMark";
import { GetInTouchModal } from "@/components/GetInTouchModal";
import { hasAccount } from "@/lib/api";

const CATALOG_COPY = {
  agricultural: {
    heading: "Agricultural Drone & Operation Matcher",
    subtitle:
      "Select your crop configuration and operation needs to display matching high-precision UAV platforms.",
  },
  wildlife: {
    heading: "Forest and Wildlife UAVs: Monitoring and Wildlife Protection",
    subtitle:
      "Nkem has developed a wide range of products for diverse applications such as wildfire and surveillance management.",
    image: "/images/hero/wildlife-homepage.jpg",
    vision: {
      image: "/images/hero/wildlife-vision.jpg",
      tagline:
        "The need to effectively monitor and manage our natural habitats and wildlife has never been more critical.",
      heading: "Our Vision",
      paragraphs: [
        "At Nkem Aeronautics, we are driving innovative solutions that enable individuals and organisations to monitor wildlife more accurately and less invasively, all while using fewer resources.",
        "We provide powerful tools for wildlife rangers, conservationists, landowners, and researchers to make informed decisions and take proactive measures.",
        "Our mission extends beyond simply observing; it is about creating actionable insights that contribute to sustainable environmental management.",
      ],
    },
    machineLearning: {
      image: "/images/hero/wildlife-ml.jpg",
      caption:
        "Nkem Aeronautics AI identifies animal species and in some cases sex and age from images and video, enabling faster, more accurate analysis while reducing manual review and human error. Available in two forms: an online web app and directly by inputting the code directly on the drone for ID live in the field.",
      label: "Machine Learning",
      heading: "AI-Powered Wildlife Insights",
      paragraphs: [
        "Nkem Aeronautics' proprietary AI model has been trained on hundreds of thousands of field images and videos to accurately identify a wide range of animal species within your photo and video data. In some cases, it will distinguish between sex and estimate age-class for more accurate data gathering.",
        "This allows for faster, more consistent post-flight analysis, saving hours of manual review while reducing human error. Whether you’re running surveys, tracking population dynamics, or collecting long-term ecological data, our machine learning tools accelerate your workflow and boost accuracy at every step.",
      ],
    },
    cta: {
      image: "/images/hero/wildlife-homepage.jpg",
      heading: "Ready to See Wildlife Differently?",
      description:
        "Discover how Nkem Aeronautics' drone technology, software, and AI help professionals monitor wildlife more accurately, efficiently, and ethically — from field operations to data-driven decisions, built for real-world conservation and land management.",
    },
    whyUs: {
      heading: "Why Nkem Aeronautics Drones?",
      paragraph:
        "Our capabilities like our indigenous design and technological ability to invent, design and deliver customer centric offerings allow us to design, develop, engineer, and manufacture our UAVs in-house with a control on performance, reliability, and autonomy.",
    },
    challenges: {
      heading: "Industry Challenges",
      items: [
        {
          icon: BarChart3,
          title: "Capturing the right data",
          text: "One of the major problems that conservationists face is the lack of reliable wildlife data including population count. Existing methods of population monitoring are not always accurate especially in hard to reach areas such as high cliffs, dense rain forests or underwater.",
        },
        {
          icon: Users2,
          title: "Workforce and skills",
          text: "The monitoring and observance of forests and woodlands can pose to be a tiresome and exhaustive process that requires workforce and skills.",
        },
      ],
    },
    solution: {
      heading: "Here's the solution - Drones",
      paragraph:
        "Nowadays sophisticated sensors, aerial photogrammetry and remote sensing techniques provide the most advanced tool for monitoring, inventorying and mapping forests and wildlife. Other than airborne and spaceborne platforms, in recent years, drones or Unmanned Aerial Vehicles (UAVs) are widely used in the management of forests due to their low operational costs, lightweight, high-intensity data collection in a short time, variety of sensors, and usability in inaccessible and high-risk areas.",
    },
    closing: {
      heading: "Know more from us",
      paragraph: "Leverage our drones to boost your forest and wildfire management operations.",
    },
  },
  mining: {
    heading: "Mining Drone & Site Monitoring Catalog",
    subtitle: "Aerial equipment for stockpile surveys, mapping, and mine site monitoring.",
    intro: {
      image: "/images/hero/mining-homepage.jpg",
      heading: "Autonomous drone platform for mining safety and operational excellence",
      description:
        "Deploy automated drone inspections of equipment, conveyors, haul roads, and blast zones, reducing costly downtime through preventive maintenance while enabling continuous operational oversight.",
    },
    transformations: {
      heading: "Transform mine safety from reactive response to continuous oversight",
      items: [
        {
          title: "Emergency repairs to planned maintenance",
          image: "/images/hero/mining-maintenance.jpg",
          text: "Continuous equipment monitoring enables condition-based maintenance scheduling, reducing spare parts inventory while preventing production-stopping failures.",
        },
        {
          title: "Ground surveys to aerial intelligence",
          image: "/images/hero/mining-survey.jpg",
          text: "Automated missions capture comprehensive site data without mobilizing survey crews, eliminating production disruptions and accelerating decision-making.",
        },
        {
          title: "After-hours vulnerability to continuous protection",
          image: "/images/hero/mining-night.jpg",
          text: "Nightly perimeter patrols with thermal detection identify intrusions and equipment tampering, keeping the site monitored around the clock.",
        },
        {
          title: "Slow clearances to rapid verification",
          image: "/images/hero/mining-clearance.jpg",
          text: "Systematic aerial surveys identify hazards from safe distances before personnel re-entry, accelerating clearance while maintaining safety standards.",
        },
      ],
    },
    capabilities: {
      heading: "What our drones do on site",
      items: [
        {
          icon: Wrench,
          title: "Equipment and asset inspections",
          text: "Automated inspection missions capture high-resolution imagery of conveyors, crushers, haul trucks, and excavators, detecting wear and failures.",
          image: "/images/hero/mining-equipment.jpg",
        },
        {
          icon: ShieldAlert,
          title: "Pre-blast and post-blast operations",
          text: "Systematic aerial surveys identify hazards from safe distances before personnel re-entry, accelerating clearance while maintaining safety standards.",
          image: "/images/hero/mining-blast.jpg",
        },
        {
          icon: Truck,
          title: "Active pit and haul road monitoring",
          image: "/images/hero/mining-active-pit.jpg",
          text: "Continuous aerial oversight of work zones identifies equipment proximity issues and developing hazards before incidents occur.",
        },
        {
          icon: Zap,
          title: "Infrastructure condition inspection",
          image: "/images/hero/mining-infrastructure.jpg",
          text: "Regular aerial missions inspect power lines, pipelines, roads, and remote facilities, documenting maintenance needs with comprehensive visual records.",
        },
        {
          icon: Siren,
          title: "Emergency response coordination",
          text: "On-demand aerial dispatch provides incident commanders with immediate situational awareness to assess hazards before committing responders.",
          image: "/images/hero/mining-emergency-response.jpg",
        },
        {
          icon: Flame,
          title: "Thermal anomaly identification",
          text: "Detect overheating motors, bearing failures, electrical hotspots, and equipment malfunctions before catastrophic failure and production loss.",
        },
        {
          icon: Droplets,
          title: "Tailings facility monitoring",
          text: "Scheduled flights with thermal imaging detect seepage patterns and structural anomalies, enabling proactive maintenance before escalation.",
          image: "/images/hero/mining-tailings.jpg",
        },
        {
          icon: Cog,
          title: "Conveyor condition analysis",
          text: "Analyze belt alignment, roller condition, material spillage, and structure integrity, automating routine inspection documentation and prioritizing repairs.",
        },
        {
          icon: Layers,
          title: "Stockpile boundary mapping",
          text: "Generate precise stockpile boundaries from aerial imagery, enabling accurate volume calculations and inventory tracking without manual surveying.",
        },
        {
          icon: GitCompare,
          title: "Structural change detection",
          text: "Compare aerial imagery over time, identifying slope movement, settlement, erosion patterns, and infrastructure degradation critical for monitoring.",
          image: "/images/hero/mining-change-detection.jpg",
        },
        {
          icon: ScanSearch,
          title: "Equipment wear detection",
          text: "Identify structural cracks, component damage, belt wear, and mechanical failures on conveyors, crushers, and trucks, enabling preventive maintenance.",
          image: "/images/hero/mining-wear-detection.jpg",
        },
      ],
    },
  },
};

export function CatalogSection() {
  const [activeSector, setActiveSector] = useState("agricultural");
  const [crop, setCrop] = useState("all");
  const [service, setService] = useState("spraying");
  const [showGetInTouch, setShowGetInTouch] = useState(false);
  const [openTransformation, setOpenTransformation] = useState(0);
  const isEvtol = activeSector === "evtol";
  const copy = CATALOG_COPY[activeSector];

  // Starts false to match the server render, then syncs after mount — see Hero.jsx.
  const [returning, setReturning] = useState(false);

  // Lets links like "/?sector=evtol#catalog" (e.g. the drone detail page's back link)
  // land directly on the right tab instead of always resetting to Agriculture.
  useEffect(() => {
    const sector = new URLSearchParams(window.location.search).get("sector");
    if (sector) setActiveSector(sector);
    setReturning(hasAccount());
  }, []);

  return (
    <section id="catalog" className="relative border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <SectorTabs active={activeSector} onChange={setActiveSector} />

        <div className="mt-10">
          {isEvtol ? (
            <EvtolSeries />
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-brand-green">{copy.heading}</h2>
              <p className="mt-2 border-b border-border pb-6 text-muted-foreground">{copy.subtitle}</p>

              {(copy.vision || copy.machineLearning || copy.cta || copy.intro) && (
                <div className={`mt-8 grid gap-8 sm:grid-cols-2 ${copy.vision ? "lg:grid-cols-3" : ""}`}>
                  {copy.intro && (
                    <div>
                      <div className="relative h-80 overflow-hidden rounded-xl">
                        <img src={copy.intro.image} alt="" className="absolute inset-0 size-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10" />
                        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                          <h3 className="text-lg font-semibold leading-snug drop-shadow-md">{copy.intro.heading}</h3>
                          <p className="mt-2 text-sm leading-6 text-white/85 drop-shadow-md">{copy.intro.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowGetInTouch(true)}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-blue-dark"
                      >
                        Contact Us
                      </button>
                    </div>
                  )}

                  {copy.transformations && (
                    <div className="flex flex-col justify-center">
                      <p className="text-xs font-semibold tracking-widest text-brand-green uppercase">
                        Why it matters
                      </p>
                      <h3 className="mt-2 text-2xl font-bold tracking-tight text-brand-navy-dark">
                        {copy.transformations.heading}
                      </h3>
                      <div className="mt-6 divide-y divide-border border-y border-border">
                        {copy.transformations.items.map((item, i) => {
                          const isOpen = openTransformation === i;
                          return (
                            <div
                              key={item.title}
                              className={`border-l-2 pl-4 transition-colors ${
                                isOpen ? "border-brand-green" : "border-transparent"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => setOpenTransformation(isOpen ? null : i)}
                                aria-expanded={isOpen}
                                className={`flex w-full items-center justify-between gap-4 py-4 text-left font-medium transition-colors ${
                                  isOpen ? "text-brand-navy-dark" : "text-muted-foreground hover:text-brand-navy-dark"
                                }`}
                              >
                                {item.title}
                                <ChevronDown
                                  className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                />
                              </button>
                              {isOpen && (
                                <div className="pb-4">
                                  <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="mt-4 w-full rounded-lg border border-border"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {copy.vision && (
                    <div>
                      <div className="relative h-80 overflow-hidden rounded-xl">
                        <img src={copy.vision.image} alt="" className="absolute inset-0 size-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
                        <p className="absolute inset-x-0 bottom-0 p-6 text-sm font-semibold text-white drop-shadow-md">
                          {copy.vision.tagline}
                        </p>
                      </div>
                      <h3 className="mt-4 font-semibold text-brand-navy-dark">{copy.vision.heading}</h3>
                      <div className="mt-2 space-y-3 text-sm text-muted-foreground">
                        {copy.vision.paragraphs.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                      <Link
                        href={returning ? "/login" : `/signup?sector=${activeSector}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
                      >
                        Find out more
                      </Link>
                    </div>
                  )}

                  {copy.machineLearning && (
                    <div>
                      <div className="relative h-80 overflow-hidden rounded-xl">
                        <img
                          src={copy.machineLearning.image}
                          alt=""
                          className="absolute inset-0 size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
                        <p className="absolute inset-x-0 bottom-0 p-6 text-sm font-semibold text-white drop-shadow-md">
                          {copy.machineLearning.caption}
                        </p>
                      </div>
                      <p className="mt-4 text-xs font-semibold tracking-widest text-brand-green uppercase">
                        {copy.machineLearning.label}
                      </p>
                      <h3 className="mt-1 font-semibold text-brand-navy-dark">{copy.machineLearning.heading}</h3>
                      <div className="mt-2 space-y-3 text-sm text-muted-foreground">
                        {copy.machineLearning.paragraphs.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {copy.cta && (
                    <div>
                      <div className="relative h-80 overflow-hidden rounded-xl">
                        <img src={copy.cta.image} alt="" className="absolute inset-0 size-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
                        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                          <h3 className="font-semibold drop-shadow-md">{copy.cta.heading}</h3>
                          <p className="mt-1 text-sm text-white/85 drop-shadow-md">{copy.cta.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowGetInTouch(true)}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-blue-dark"
                      >
                        Contact Us
                      </button>
                    </div>
                  )}
                </div>
              )}

              {copy.whyUs && (
                <div className="mt-16 rounded-xl bg-brand-gray-light p-8 sm:p-10">
                  <h3 className="max-w-2xl text-2xl font-bold tracking-tight text-brand-navy-dark sm:text-3xl">
                    {copy.whyUs.heading}
                  </h3>
                  <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{copy.whyUs.paragraph}</p>
                </div>
              )}

              {copy.challenges && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold tracking-tight text-brand-navy-dark sm:text-3xl">
                    {copy.challenges.heading}
                  </h3>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {copy.challenges.items.map(({ icon: Icon, title, text }) => (
                      <div
                        key={title}
                        className="h-full rounded-lg border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex size-10 items-center justify-center rounded-md bg-brand-green/10">
                          <Icon className="size-5 text-brand-green" />
                        </div>
                        <h4 className="mt-4 font-semibold text-brand-navy-dark">{title}</h4>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {copy.solution && (
                <div className="mt-16 rounded-xl bg-brand-navy-dark p-8 text-white sm:p-10">
                  <h3 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">{copy.solution.heading}</h3>
                  <p className="mt-4 max-w-3xl leading-7 text-white/80">{copy.solution.paragraph}</p>
                </div>
              )}

              {copy.closing && (
                <div className="mt-16 rounded-xl bg-brand-gray-light px-6 py-12 text-center">
                  <h3 className="text-2xl font-bold tracking-tight text-brand-navy-dark sm:text-3xl">{copy.closing.heading}</h3>
                  <p className="mt-2 text-muted-foreground">{copy.closing.paragraph}</p>
                  <button
                    type="button"
                    onClick={() => setShowGetInTouch(true)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-brand-blue-dark"
                  >
                    Contact Us
                  </button>
                </div>
              )}

              {copy.capabilities && (
                <div className="mt-16">
                  <p className="text-xs font-semibold tracking-widest text-brand-green uppercase">Capabilities</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-brand-navy-dark sm:text-3xl">
                    {copy.capabilities.heading}
                  </h3>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {copy.capabilities.items.map(({ icon: Icon, title, text, image }) => (
                      <div
                        key={title}
                        className="h-full overflow-hidden rounded-lg border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {image && <img src={image} alt={title} className="h-44 w-full object-cover" />}
                        <div className="p-6">
                          <div className="flex size-10 items-center justify-center rounded-md bg-brand-green/10">
                            <Icon className="size-5 text-brand-green" />
                          </div>
                          <h4 className="mt-4 font-semibold text-brand-navy-dark">{title}</h4>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {activeSector !== "wildlife" && (
                <div className="mt-8">
                  <ProductCarousel sector={activeSector} cropFilter={crop} serviceFilter={service} />
                </div>
              )}

              <div className="mt-12">
                <QuoteRequestForm sector={activeSector} />
              </div>
            </>
          )}
        </div>

        <BrandMark className="absolute right-6 bottom-6 hidden sm:flex" />
      </div>

      <GetInTouchModal open={showGetInTouch} onOpenChange={setShowGetInTouch} />
    </section>
  );
}
