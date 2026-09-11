import { Hero } from "@/components/Hero";
import { Challenges } from "@/components/Challenges";
import { ServicesOverview } from "@/components/ServicesOverview";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ManufacturingProcess, ProjectLifecycle } from "@/components/ProjectLifecycle";
import { NewsSection } from "@/components/NewsSection";
import { CatalogSection } from "./CatalogSection";

export const metadata = {
  title: "Nkem Aeronautics — Aerial UAV Solutions",
  description:
    "Precision agricultural drone spraying, wildlife & surveillance monitoring, and farmer logbook registration across Zambia and Africa.",
};

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <Challenges />
      <ServicesOverview />
      <CatalogSection />
      <ProjectLifecycle />
      <ManufacturingProcess />
      <HowItWorks />
      <WhyChooseUs />
      <NewsSection />
    </main>
  );
}
