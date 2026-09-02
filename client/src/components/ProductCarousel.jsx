import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { PRODUCTS } from "@/lib/catalog";

const COMING_SOON_IMAGES = {
  realestate: "/images/services/real-estate.jpg",
};

export function ProductCarousel({ sector, cropFilter = "all", serviceFilter }) {
  let products = PRODUCTS.filter((product) => product.sector === sector);

  if (sector === "agricultural") {
    products = products.filter((product) => {
      const cropMatch = cropFilter === "all" || product.crops?.includes(cropFilter);
      const serviceMatch =
        !serviceFilter || product.service === serviceFilter || product.service === "both";
      return cropMatch && serviceMatch;
    });
  }

  if (products.length === 0) {
    const image = COMING_SOON_IMAGES[sector];

    return (
      <div className="relative h-72 overflow-hidden rounded-lg">
        {image && <img src={image} alt="" className="absolute inset-0 size-full object-cover" />}
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
