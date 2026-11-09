// Server-side source for the /products pages. Products are managed in the admin (Drones →
// Website & shop catalogue); every active product with a `family` is listed on /products.
// If the API can't be reached (e.g. the free host is waking up during a build), the pages fall
// back to the built-in PRODUCT_RANGE so they never render empty.
import { PRODUCT_FAMILIES, PRODUCT_RANGE } from "./productRange.js";
import { getApiBaseUrl } from "./api.js";

export const PRODUCTS_REVALIDATE_SECONDS = 300;

const FAMILY_IDS = new Set(PRODUCT_FAMILIES.map((f) => f.id));

// Specs are stored either as [{ group, rows: [[label, value]] }] or as flat [[label, value]] pairs.
function specGroups(specs) {
  if (!Array.isArray(specs) || specs.length === 0) return [];
  if (specs[0] && typeof specs[0] === "object" && !Array.isArray(specs[0]) && "rows" in specs[0]) return specs;
  return [{ group: "Specifications", rows: specs.map(([label, value]) => [String(label), String(value)]) }];
}

// Fills the family's "At a glance" columns from saved values, then from same-named specs or
// headline figures, so new products need no extra comparison data.
function compareValues(family, product, groups) {
  const saved = product.compare && typeof product.compare === "object" ? product.compare : {};
  const lookup = new Map();
  for (const g of groups) for (const [label, value] of g.rows) lookup.set(label.toLowerCase(), value);
  for (const k of product.keyFigures ?? []) lookup.set(String(k.label).toLowerCase(), k.value);
  return Object.fromEntries(
    family.compare.map((col) => [col, saved[col] ?? lookup.get(col.toLowerCase()) ?? "—"]),
  );
}

export function fromApiProduct(product) {
  const family = PRODUCT_FAMILIES.find((f) => f.id === product.family);
  const groups = specGroups(product.specs);
  return {
    slug: product.slug,
    family: product.family,
    model: product.model || null,
    name: product.name,
    image: product.images?.[0] || family.photo,
    tagline: product.tagline || product.highlight || "",
    description: product.description && product.description !== product.tagline ? product.description : undefined,
    keyFigures: Array.isArray(product.keyFigures) ? product.keyFigures.filter((k) => k?.value && k?.label) : [],
    specs: groups,
    applications: product.applications ?? [],
    compare: compareValues(family, product, groups),
    thirdParty: product.thirdParty || undefined,
  };
}

export async function getCatalogProducts() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products`, {
      next: { revalidate: PRODUCTS_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    const listed = rows.filter((p) => p.slug && FAMILY_IDS.has(p.family)).map(fromApiProduct);
    if (listed.length > 0) return listed;
  } catch (err) {
    console.warn(`[products] using built-in catalogue: ${err.message}`);
  }
  return PRODUCT_RANGE;
}

export const inFamily = (products, familyId) => products.filter((p) => p.family === familyId);
