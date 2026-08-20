import { Hero } from "@/components/Hero";
import { Challenges } from "@/components/Challenges";
import { Partners } from "@/components/Partners";
import { ServicesOverview } from "@/components/ServicesOverview";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CatalogSection } from "./CatalogSection";

export const metadata = {
  title: "Nkem Aeronautics Ltd — Aerial UAV Solutions",
  description:
    "Precision agricultural drone spraying, wildlife & surveillance monitoring, and farmer logbook registration across Zambia and Sub-Saharan Africa.",
};

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <Challenges />
      <Partners />
      <ServicesOverview />
      <CatalogSection />
      <HowItWorks />
      <WhyChooseUs />
    </main>
  );
}
