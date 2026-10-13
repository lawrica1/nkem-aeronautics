export const CATALOG_SECTORS = [
  { id: "agricultural", label: "Agricultural Operations" },
  { id: "wildlife", label: "Wildlife & Surveillance" },
  { id: "mining", label: "Mining" },
  { id: "evtol", label: "eVTOL" },
];

export const PLATFORM_SECTORS = CATALOG_SECTORS.filter((sector) => sector.id !== "evtol");

// Product specs are stored either as [[label, value]] pairs (order-preserving) or as a plain object.
export function specEntries(specs) {
  if (!specs) return [];
  return Array.isArray(specs) ? specs : Object.entries(specs);
}
