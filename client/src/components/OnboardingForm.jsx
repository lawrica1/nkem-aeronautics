"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFirms } from "@/hooks/useFirms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRegionOptions, getDivisionOptions, getSubdivisionOptions } from "@/lib/locations";
import { COUNTRIES } from "@/lib/countries";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Sprout, Binoculars, Pickaxe } from "lucide-react";

const SECTOR_META = {
  agricultural: { label: "Agriculture", Icon: Sprout },
  wildlife: { label: "Wildlife & Surveillance", Icon: Binoculars },
  mining: { label: "Mining", Icon: Pickaxe },
};

const CROP_OPTIONS = [
  "Maize", "Cassava", "Rice", "Sorghum", "Banana / Plantain", "Oil Palm",
  "Cocoa", "Coffee", "Rubber", "Groundnuts", "Tomatoes", "Vegetables (other)",
];

export function OnboardingForm() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading, isError: profileError } = useFarmerProfile({ enabled: true });
  const update = useUpdateProfile();
  const { data: firms } = useFirms();

  const sector = profile?.sector;

  const [form, setForm] = useState({
    sector: "",
    name: "",
    surname: "",
    sex: "",
    telephone: "",
    country: "",
    address: "",
    region: "",
    district: "",
    subdivision: "",
    otherSubdivision: "",
    crop: "",
    otherCrop: "",
    firm: "",
    otherFirm: "",
    wildlifeOrg: "",
    wildlifeRole: "",
    miningOrg: "",
    miningRole: "",
  });

  // Pre-populate form from saved profile so the user can continue where they left off.
  useEffect(() => {
    if (!profile) return;
    setForm((prev) => ({
      sector: profile.sector || prev.sector,
      name: profile.name || prev.name,
      surname: profile.surname || prev.surname,
      sex: profile.sex || prev.sex,
      telephone: profile.telephone || prev.telephone,
      country: profile.country || prev.country,
      address: profile.address || prev.address,
      region: profile.region || prev.region,
      district: profile.district || prev.district,
      crop: profile.crop || prev.crop,
      otherCrop: profile.otherCrop || prev.otherCrop,
      firm: profile.firm || prev.firm,
      otherFirm: profile.otherFirm || prev.otherFirm,
      wildlifeOrg: profile.wildlifeOrg || prev.wildlifeOrg,
      wildlifeRole: profile.wildlifeRole || prev.wildlifeRole,
      miningOrg: profile.miningOrg || prev.miningOrg,
      miningRole: profile.miningRole || prev.miningRole,
    }));
  }, [profile]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setRegion(value) {
    setForm((prev) => ({ ...prev, region: value, district: "", subdivision: "", otherSubdivision: "" }));
  }

  function setDivision(value) {
    setForm((prev) => ({ ...prev, district: value, subdivision: "", otherSubdivision: "" }));
  }

  function setCountry(value) {
    setForm((prev) => ({ ...prev, country: value, region: "", district: "", subdivision: "", otherSubdivision: "" }));
  }

  const activeSector = form.sector || sector;
  const isAgricultural = activeSector === "agricultural";
  const isWildlife = activeSector === "wildlife";
  const isMining = activeSector === "mining";

  const regionOptions = getRegionOptions(form.country);
  const divisionOptions = getDivisionOptions(form.country, form.region);
  const subdivisionOptions = getSubdivisionOptions(form.country, form.district);
  // No list for this division (e.g. all of Zambia) → type it; otherwise "Other" also opens a text box.
  const typeSubdivision = form.district && (subdivisionOptions.length === 0 || form.subdivision === "other");
  const divisionLabel = form.country === "ZM" ? "District" : "Division";
  const subdivisionLabel = form.country === "ZM" ? "Area / Ward" : "Subdivision";

  function handleChange(e) {
    set(e.target.name, e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { otherSubdivision, ...payload } = form;
    if (typeSubdivision) payload.subdivision = otherSubdivision.trim();
    update.mutate(payload, {
      onSuccess: () => router.push("/logbook"),
    });
  }

  if (profileLoading) {
    return <p className="text-sm text-muted-foreground">Loading your profile…</p>;
  }

  if (profileError) {
    return (
      <p className="text-sm text-destructive">
        Could not load your profile. Please refresh the page and try again.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Sector selector — chosen at login, can be updated here */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-brand-navy-dark">Your sector</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(SECTOR_META).map(([id, { label, Icon }]) => (
            <button
              key={id}
              type="button"
              onClick={() => setForm((f) => ({ ...f, sector: id }))}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                (form.sector || sector) === id
                  ? "border-brand-blue bg-brand-blue/5"
                  : "border-border hover:border-brand-blue/40"
              }`}
            >
              <Icon className={`size-5 shrink-0 ${(form.sector || sector) === id ? "text-brand-blue" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${(form.sector || sector) === id ? "text-brand-navy-dark" : "text-foreground"}`}>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Identity */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-brand-navy-dark">Who you are</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">First Name <span className="text-destructive">*</span></Label>
            <Input id="name" name="name" required value={form.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Last Name <span className="text-destructive">*</span></Label>
            <Input id="surname" name="surname" required value={form.surname} onChange={handleChange} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sex">Sex <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Select value={form.sex} onValueChange={(v) => set("sex", v)}>
              <SelectTrigger id="sex" className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">
              Phone{" "}
              <span className="font-normal text-muted-foreground">
                {profile?.telephone ? "(already set)" : "(optional)"}
              </span>
            </Label>
            <PhoneInput
              id="telephone"
              name="telephone"
              key={profile?.id ?? "new"}
              value={form.telephone}
              onChange={handleChange}
              countryCode={form.country || undefined}
            />
          </div>
        </div>
      </section>

      {/* Sector-specific fields */}
      {isAgricultural && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-brand-navy-dark">Your farm</h2>
          <div className="space-y-2">
            <Label htmlFor="crop">Crop Cultivation <span className="text-destructive">*</span></Label>
            <Select value={form.crop} onValueChange={(v) => set("crop", v)}>
              <SelectTrigger id="crop" className="w-full"><SelectValue placeholder="Select crop" /></SelectTrigger>
              <SelectContent>
                {CROP_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.crop === "other" && (
            <div className="space-y-2">
              <Label htmlFor="otherCrop">Specify Crop <span className="text-destructive">*</span></Label>
              <Input id="otherCrop" name="otherCrop" required value={form.otherCrop} onChange={handleChange} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="firm">Firm Affiliation <span className="text-destructive">*</span></Label>
            <Select value={form.firm} onValueChange={(v) => set("firm", v)}>
              <SelectTrigger id="firm" className="w-full"><SelectValue placeholder="Select firm" /></SelectTrigger>
              <SelectContent>
                {firms?.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.firm === "other" && (
            <div className="space-y-2">
              <Label htmlFor="otherFirm">Firm Name <span className="text-destructive">*</span></Label>
              <Input id="otherFirm" name="otherFirm" required value={form.otherFirm} onChange={handleChange} />
            </div>
          )}
        </section>
      )}

      {isWildlife && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-brand-navy-dark">Your organisation</h2>
          <div className="space-y-2">
            <Label htmlFor="wildlifeOrg">Organisation / Site <span className="text-destructive">*</span></Label>
            <Input id="wildlifeOrg" name="wildlifeOrg" required value={form.wildlifeOrg} onChange={handleChange} placeholder="e.g. Kafue National Park" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wildlifeRole">Position / Role <span className="text-destructive">*</span></Label>
            <Input id="wildlifeRole" name="wildlifeRole" required value={form.wildlifeRole} onChange={handleChange} placeholder="e.g. Forest Warden" />
          </div>
        </section>
      )}

      {isMining && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-brand-navy-dark">Your operation</h2>
          <div className="space-y-2">
            <Label htmlFor="miningOrg">Mining Company / Site <span className="text-destructive">*</span></Label>
            <Input id="miningOrg" name="miningOrg" required value={form.miningOrg} onChange={handleChange} placeholder="e.g. Kansanshi Mine" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="miningRole">Position / Role <span className="text-destructive">*</span></Label>
            <Input id="miningRole" name="miningRole" required value={form.miningRole} onChange={handleChange} placeholder="e.g. Site Surveyor" />
          </div>
        </section>
      )}

      {/* Location */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-brand-navy-dark">Where you are</h2>

        <div className="space-y-2">
          <Label htmlFor="country">Country <span className="text-destructive">*</span></Label>
          <Select value={form.country} onValueChange={setCountry} required>
            <SelectTrigger id="country" className="w-full"><SelectValue placeholder="Select your country" /></SelectTrigger>
            <SelectContent>
              {COUNTRIES.map(({ code, name }) => (
                <SelectItem key={code} value={code}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-navy-dark">
            {isAgricultural ? "Farm location" : "Site location"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Select the region, then the {divisionLabel.toLowerCase()}, then the {subdivisionLabel.toLowerCase()} where your{" "}
            {isAgricultural ? "farm" : "site"} is located <span className="text-muted-foreground/70">(optional)</span>.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={form.region} onValueChange={setRegion}>
              <SelectTrigger id="region" className="w-full"><SelectValue placeholder="Select region" /></SelectTrigger>
              <SelectContent>
                {regionOptions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">{divisionLabel}</Label>
            <Select value={form.district} onValueChange={setDivision} disabled={!form.region}>
              <SelectTrigger id="district" className="w-full">
                <SelectValue placeholder={form.region ? `Select ${divisionLabel.toLowerCase()}` : "Select a region first"} />
              </SelectTrigger>
              <SelectContent>
                {divisionOptions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdivision">{subdivisionLabel}</Label>
            {subdivisionOptions.length > 0 ? (
              <Select value={form.subdivision} onValueChange={(v) => set("subdivision", v)} disabled={!form.district}>
                <SelectTrigger id="subdivision" className="w-full">
                  <SelectValue placeholder={`Select ${subdivisionLabel.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {subdivisionOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                  <SelectItem value="other">Other (not listed)</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="subdivision"
                name="otherSubdivision"
                disabled={!form.district}
                placeholder={form.district ? `Type your ${subdivisionLabel.toLowerCase()}` : `Select a ${divisionLabel.toLowerCase()} first`}
                value={form.otherSubdivision}
                onChange={handleChange}
              />
            )}
          </div>
        </div>

        {typeSubdivision && subdivisionOptions.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="otherSubdivision">{subdivisionLabel} name</Label>
            <Input
              id="otherSubdivision"
              name="otherSubdivision"
              required
              value={form.otherSubdivision}
              onChange={handleChange}
              placeholder={`Type your ${subdivisionLabel.toLowerCase()}`}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="address">
            {isAgricultural ? "Village / Address" : "Address"} <span className="text-destructive">*</span>
          </Label>
          <Input id="address" name="address" required value={form.address} onChange={handleChange} />
        </div>
      </section>

      {update.isError && (
        <p className="text-sm text-destructive">{update.error.message}</p>
      )}

      <Button
        type="submit"
        disabled={update.isPending || !form.name || !form.surname || !form.country}
        className="w-full bg-brand-navy text-white hover:bg-brand-navy/90"
      >
        {update.isPending ? "Saving…" : "Complete Profile & Go to Logbook →"}
      </Button>
    </form>
  );
}
