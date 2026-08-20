import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CROP_OPTIONS = [
  { value: "all", label: "All Crops" },
  { value: "grains", label: "Grains (Maize, Rice, Sorghum)" },
  { value: "plantation", label: "Plantation/Trees (Banana, Oil Palm, Cocoa)" },
  { value: "vegetables", label: "Vegetables & Roots (Tomatoes, Cassava)" },
];

const SERVICE_OPTIONS = [
  { value: "spraying", label: "Spraying Only" },
  { value: "both", label: "Spraying & Multispectral Monitoring" },
];

export function AgriDroneFilter({ crop, service, onCropChange, onServiceChange }) {
  return (
    <div className="mb-8 grid gap-4 rounded-lg border border-border bg-brand-input/60 p-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="filter-crop">Crop Type Cultivated</Label>
        <Select value={crop} onValueChange={onCropChange}>
          <SelectTrigger id="filter-crop" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CROP_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="filter-service">Required Aerial Service</Label>
        <Select value={service} onValueChange={onServiceChange}>
          <SelectTrigger id="filter-service" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
