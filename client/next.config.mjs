/** @type {import('next').NextConfig} */

// Product pages moved to the standardized NKM model codes (Oct 2026). Old links keep working.
const RENAMED_PRODUCTS = {
  "aw1338-levitate": "nkm-agr-100",
  zam237: "nkm-agr-200",
  "zam201-vtol": "nkm-agr-300-vtol",
  zam13e: "nkm-agr-500",
  zam2001: "nkm-lgs-50",
  "fog-cannon-sprayer-1000l": "nkm-ugv-1000",
  "compact-fog-sprayer-120l": "nkm-ugv-120",
  "advanced-fog-sprayer-140l": "nkm-ugv-140",
  dumpcart: "nkm-ugv-1",
  "crawler-transport-vehicle": "nkm-ugv-2",
};

const nextConfig = {
  async redirects() {
    return Object.entries(RENAMED_PRODUCTS).map(([from, to]) => ({
      source: `/products/${from}`,
      destination: `/products/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
