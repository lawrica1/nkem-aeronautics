import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

// Rent-vs-purchase status intentionally omitted from cards until the client
// resolves whether it affects pricing display (docs/PROJECT-UNDERSTANDING.md §6, Q7).
export const PRODUCTS = [
  {
    id: "aw50g",
    sector: "agricultural",
    name: "Nkem AW50G High-Payload Agri Sprayer",
    description:
      "16L capacity electric spraying UAV built for large-scale crop protection, liquid fertilizer deployment, and automated flight paths.",
    spec: "Payload: 16 Liters",
    crops: ["grains", "plantation"],
    service: "spraying",
  },
  {
    id: "awv2548",
    sector: "agricultural",
    name: "Nkem AWV2548 Ultralight Agri Drone",
    description:
      "10L folding multi-rotor sprayer frame under 10kg, optimized for rapid field deployment and localized vegetable farm spraying.",
    spec: "Frame: Cross-Foldable",
    crops: ["vegetables"],
    service: "spraying",
  },
  {
    id: "awv2847",
    sector: "agricultural",
    name: "Nkem AWV2847 Efficient Crop Monitor",
    description:
      "Multispectral drone system built for early plant disease detection, soil moisture mapping, and yield estimation across grains.",
    spec: "Type: Multispectral UAV",
    crops: ["grains", "plantation", "vegetables"],
    service: "both",
  },
  {
    id: "aw1749",
    sector: "wildlife",
    name: "Nkem AW1749 Gasoline VTOL Fixed-Wing",
    description:
      "3.25m wingspan long-range vertical takeoff drone for extended national park surveillance and mapping.",
    spec: "Range: High Range VTOL",
  },
  {
    id: "awv2555",
    sector: "wildlife",
    name: "Nkem AWV2555 Tethered Security Unit",
    description:
      "Continuous-power tethered UAV providing emergency lighting and uninterrupted camera overwatch.",
    spec: "Power: Tethered Cable",
  },
  {
    id: "aw1338",
    sector: "wildlife",
    name: "Nkem AW1338 HD Mapping Remote UAV",
    description: "4K camera GPS platform designed for thermal wildlife tracking and border surveillance.",
    spec: "Optics: 4K HD Gimbal",
  },
];

const COMING_SOON_IMAGES = {
  realestate: "/images/services/real-estate.jpg",
};

export function ProductCarousel({ sector, cropFilter = "all", serviceFilter }) {
  let products = PRODUCTS.filter((product) => product.sector === sector);

  if (sector === "agricultural") {
    products = products.filter((product) => {
      const cropMatch = cropFilter === "all" || product.crops?.includes(cropFilter);
      const serviceMatch = !serviceFilter || product.service === serviceFilter || product.service === "both";
      return cropMatch && serviceMatch;
    });
  }

  if (products.length === 0) {
    const image = COMING_SOON_IMAGES[sector];

    return (
      <div className="relative h-72 overflow-hidden rounded-lg">
        {image && (
          <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
        )}
        <div className="absolute inset-0 bg-brand-navy-dark/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white">
          <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold text-brand-navy-dark uppercase">
            {sector === "agricultural" ? "No Match" : "Coming Soon"}
          </span>
          <p className="max-w-xs text-sm text-white/80">
            {sector === "agricultural"
              ? "No drones match this exact crop/service combination. Contact us for a custom configuration."
              : "Catalog content for this sector is coming soon."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {products.map((product, index) => (
          <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3">
            <Reveal delay={index * 120} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
