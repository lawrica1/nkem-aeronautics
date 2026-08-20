"use client";

import { cn } from "@/lib/utils";

export const SECTORS = [
  { id: "agricultural", label: "Agricultural Operations" },
  { id: "wildlife", label: "Wildlife & Surveillance" },
  { id: "realestate", label: "Real Estate & Surveillance" },
];

export function SectorTabs({ active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {SECTORS.map((sector) => {
        const isActive = active === sector.id;
        return (
          <button
            key={sector.id}
            type="button"
            onClick={() => onChange(sector.id)}
            className={cn(
              "rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95",
              isActive
                ? "bg-brand-green text-white shadow-md"
                : "bg-brand-gray-light text-neutral-600 hover:bg-neutral-200",
            )}
          >
            {sector.label}
          </button>
        );
      })}
    </div>
  );
}
