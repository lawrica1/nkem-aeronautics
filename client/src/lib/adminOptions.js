// Mirrors server/src/modules/platform/platform.constants.js — kept in sync by hand,
// same pattern as lib/firms.js and lib/serviceOptions.js.
export const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "farmer", label: "Farmer" },
  { value: "organization", label: "Organization" },
  { value: "government", label: "Government" },
  { value: "pilot", label: "Pilot" },
  { value: "admin", label: "Admin" },
  { value: "partner", label: "Partner" },
];

export const SECTOR_OPTIONS = [
  { value: "agricultural", label: "Agriculture" },
  { value: "wildlife", label: "Wildlife & Surveillance" },
  { value: "mining", label: "Mining" },
];

// Product.sector is a free string (not the Sector enum) so the sellable catalogue can
// also carry categories like "evtol" that aren't a registration sector.
export const PRODUCT_SECTOR_OPTIONS = [...SECTOR_OPTIONS, { value: "evtol", label: "eVTOL" }];

export const COUNTRY_OPTIONS = [
  { value: "CM", label: "Cameroon" },
  { value: "ZM", label: "Zambia" },
];
