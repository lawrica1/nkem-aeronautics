import { Hero } from "@/components/Hero";
import { Challenges } from "@/components/Challenges";
import { ServicesOverview } from "@/components/ServicesOverview";
import { FleetCapabilities } from "@/components/FleetCapabilities";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ManufacturingProcess, ProjectLifecycle } from "@/components/ProjectLifecycle";
import { NewsSection } from "@/components/NewsSection";
import { CallToAction } from "@/components/CallToAction";
import { FeaturedProducts } from "@/components/FeaturedProducts";

export const metadata = {
  title: "Nkem Aeronautics — Aerial UAV Solutions",
  description:
    "Precision agricultural drone spraying, wildlife & surveillance monitoring, and farmer logbook registration across Zambia and Africa.",
};

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <ServicesOverview />
      <FeaturedProducts />
      <Challenges />
      <FleetCapabilities />
      <HowItWorks />
      <WhyChooseUs />
      <ProjectLifecycle />
      <ManufacturingProcess />
      <NewsSection />
      <CallToAction />
    </main>
  );
}
