// Service options presented to farmers during service request submission.
// Keyed by sector value (matches Farmer.sector in the DB).
export const SERVICE_OPTIONS = {
  agricultural: [
    "Crop Spraying",
    "Farm Monitoring & Surveillance",
    "Farm Mapping & Survey",
    "Crop Health Assessment",
    "Other",
  ],
  wildlife: [
    "Wildlife Surveillance",
    "Area Monitoring",
    "GPS Tracking Operation",
    "Anti-Poaching Patrol",
    "Other",
  ],
  realestate: [
    "Property Survey",
    "Pipeline Inspection",
    "Area Mapping & Survey",
    "Construction Progress Monitoring",
    "Other",
  ],
  mining: [
    "Site Monitoring & Surveillance",
    "Stockpile Volume Survey",
    "Mine Mapping & Topographic Survey",
    "Blast Site Inspection",
    "Other",
  ],
};

export function getServiceOptions(sector) {
  return SERVICE_OPTIONS[sector] ?? ["Drone Service", "Other"];
}
