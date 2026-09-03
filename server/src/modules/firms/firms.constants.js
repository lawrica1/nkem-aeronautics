export const FIRM_OPTIONS = [
  { value: "cdc", label: "CDC" },
  { value: "cdc-tole", label: "CDC Tole" },
  { value: "cdc-jitu-sap", label: "CDC Jitu SAP" },
  { value: "soweda", label: "SOWEDA" },
  { value: "php", label: "Del Monte / Plantations Haut Penja (PHP)" },
  { value: "agro-hub-southwest", label: "Agro-Hub Southwest" },
  { value: "otafarms-southwest", label: "OTAFARMS Southwest" },
  { value: "none", label: "Not affiliated" },
  { value: "other", label: "Other" },
];

export const FIRM_VALUES = FIRM_OPTIONS.map((firm) => firm.value);
export const FIRM_LABELS = Object.fromEntries(FIRM_OPTIONS.map((firm) => [firm.value, firm.label]));

export function firmLabel(value, otherFirm) {
  if (value === "other") return otherFirm || "Other";
  return FIRM_LABELS[value] || value || "";
}
