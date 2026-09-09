"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFirms } from "@/hooks/useFirms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRegionOptions, getDivisionOptions } from "@/lib/locations";
import { Sprout, Binoculars, Building2, Pickaxe } from "lucide-react";

const SECTOR_META = {
  agricultural: { label: "Agriculture", Icon: Sprout },
  wildlife: { label: "Wildlife & Surveillance", Icon: Binoculars },
  realestate: { label: "Real Estate & Survey", Icon: Building2 },
  mining: { label: "Mining", Icon: Pickaxe },
};

const CROP_OPTIONS = [
  "Maize", "Cassava", "Rice", "Sorghum", "Banana / Plantain", "Oil Palm",
  "Cocoa", "Coffee", "Rubber", "Groundnuts", "Tomatoes", "Vegetables (other)",
];

export function OnboardingForm() {
  const router = useRouter();
  const { data: profile } = useFarmerProfile({ enabled: true });
  const update = useUpdateProfile();
  const { data: firms } = useFirms();

  const sector = profile?.sector;
  const isAgricultural = sector === "agricultural";
  const isWildlife = sector === "wildlife";
  const isRealEstate = sector === "realestate";
  const meta = SECTOR_META[sector];
  const country = profile?.country || "CM";

  const [form, setForm] = useState({
    name: "",
    surname: "",
    sex: "",
    telephone: "",
    address: "",
    region: "",
    district: "",
    crop: "",
    otherCrop: "",
    firm: "",
    otherFirm: "",
    wildlifeOrg: "",
    wildlifeRole: "",
    realEstatePurpose: "",
    govAgencyName: "",
    govAuthorizingOfficer: "",
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setRegion(value) {
    setForm((prev) => ({ ...prev, region: value, district: "" }));
  }

  const regionOptions = getRegionOptions(country);
  const divisionOptions = getDivisionOptions(country, form.region);

  function handleChange(e) {
    set(e.target.name, e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    update.mutate(form, {
      onSuccess: () => router.push("/logbook"),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Show sector badge — already locked in */}
      {meta && (
        <div className="flex items-center gap-2 rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-4 py-3">
          <meta.Icon className="size-5 text-brand-blue" />
          <div>
            <p className="text-sm font-semibold text-brand-navy-dark">{meta.label}</p>
            <p className="text-xs text-muted-foreground">Selected at sign-up — contact support to change</p>
          </div>
        </div>
      )}

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
            <Input
              id="telephone"
              name="telephone"
              type="tel"
              placeholder={profile?.telephone ?? "+237 670 000 000"}
              value={form.telephone}
              onChange={handleChange}
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

      {isRealEstate && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-brand-navy-dark">Your purpose</h2>
          <div className="space-y-2">
            <Label htmlFor="realEstatePurpose">Purpose <span className="text-destructive">*</span></Label>
            <Select value={form.realEstatePurpose} onValueChange={(v) => set("realEstatePurpose", v)}>
              <SelectTrigger id="realEstatePurpose" className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Individual / Private</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.realEstatePurpose === "government" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="govAgencyName">Government Agency / Department <span className="text-destructive">*</span></Label>
                <Input id="govAgencyName" name="govAgencyName" required value={form.govAgencyName} onChange={handleChange} placeholder="e.g. Ministry of Lands" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="govAuthorizingOfficer">Authorizing Officer <span className="text-destructive">*</span></Label>
                <Input id="govAuthorizingOfficer" name="govAuthorizingOfficer" required value={form.govAuthorizingOfficer} onChange={handleChange} placeholder="Name of the officer authorizing this request" />
              </div>
            </>
          )}
        </section>
      )}

      {/* Location */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-brand-navy-dark">Where you are</h2>
        <div className="space-y-2">
          <Label htmlFor="address">
            {isAgricultural ? "Address / Farm Location" : "Address"}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Input id="address" name="address" required value={form.address} onChange={handleChange} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="region">Region <span className="font-normal text-muted-foreground">(optional)</span></Label>
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
            <Label htmlFor="district">District / Division <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Select value={form.district} onValueChange={(v) => set("district", v)} disabled={!form.region}>
              <SelectTrigger id="district" className="w-full">
                <SelectValue placeholder={form.region ? "Select district" : "Select a region first"} />
              </SelectTrigger>
              <SelectContent>
                {divisionOptions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {update.isError && (
        <p className="text-sm text-destructive">{update.error.message}</p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={update.isPending || !form.name || !form.surname}
          className="flex-1 bg-brand-navy text-white hover:bg-brand-navy/90"
        >
          {update.isPending ? "Saving…" : "Complete Profile & Go to Logbook →"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/logbook")}>
          Skip for now
        </Button>
      </div>
    </form>
  );
}
