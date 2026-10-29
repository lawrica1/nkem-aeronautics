// Maps the built-in website catalogue (client/src/lib/productRange.js) to Product rows, so the
// admin-managed catalogue can start from the same 13 products the /products pages show.
import { PRODUCT_FAMILIES, PRODUCT_RANGE } from "../../client/src/lib/productRange.js";

const ALL_CROPS = ["grains", "plantation", "vegetables"];

// Which website section (service page carousels, portal shop filters) each family feeds.
const FAMILY_PLACEMENT = {
  "fixed-wing-vtol": { sector: "evtol" },
  multirotor: { sector: "evtol" },
  "spraying-equipment": { sector: "agricultural", service: "machines", crops: ALL_CROPS },
  "ground-robotics": { sector: "agricultural", service: "machines", crops: ALL_CROPS },
  "partner-drones": { sector: "agricultural", service: "spraying", crops: ALL_CROPS },
};

export function toProductRow(product, index) {
  const family = PRODUCT_FAMILIES.find((f) => f.id === product.family);
  const placement = FAMILY_PLACEMENT[product.family];
  const first = product.keyFigures?.[0];
  return {
    slug: product.slug,
    sector: placement.sector,
    name: product.name,
    type: family.name,
    model: product.model ?? null,
    price: null,
    availability: "",
    description: product.description ?? product.tagline,
    specs: product.specs,
    images: [product.image],
    featureBadges: [],
    applications: product.applications ?? [],
    highlight: first ? `${first.label}: ${first.value}` : "",
    tags: product.applications ?? [],
    crops: placement.crops ?? [],
    service: placement.service ?? null,
    family: product.family,
    sortOrder: (index + 1) * 10,
    tagline: product.tagline ?? "",
    keyFigures: product.keyFigures ?? [],
    compare: product.compare ?? {},
    thirdParty: Boolean(product.thirdParty),
    active: true,
  };
}

export const WEBSITE_PRODUCT_ROWS = PRODUCT_RANGE.map(toProductRow);
