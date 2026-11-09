export const CATALOG_SECTORS = [
  { id: "agricultural", label: "Agricultural Operations" },
  { id: "wildlife", label: "Wildlife & Surveillance" },
  { id: "mining", label: "Mining" },
  { id: "evtol", label: "eVTOL" },
];

export const PLATFORM_SECTORS = CATALOG_SECTORS.filter((sector) => sector.id !== "evtol");

const isGrouped = (specs) => Array.isArray(specs) && specs.length > 0 && specs[0] && !Array.isArray(specs[0]) && "rows" in specs[0];

// Product specs are stored as [[label, value]] pairs (order-preserving), as grouped
// [{ group, rows: [[label, value]] }], or as a plain object. Returns flat [label, value] pairs.
export function specEntries(specs) {
  if (!specs) return [];
  if (isGrouped(specs)) return specs.flatMap((g) => g.rows ?? []);
  return Array.isArray(specs) ? specs : Object.entries(specs);
}

// Editable rows for the admin form: { group, label, value }.
export function specRows(specs) {
  if (isGrouped(specs)) {
    return specs.flatMap((g) => (g.rows ?? []).map(([label, value]) => ({ group: g.group ?? "", label, value: String(value) })));
  }
  return specEntries(specs).map(([label, value]) => ({ group: "", label, value: String(value) }));
}
