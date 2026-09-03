"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Binoculars, Building2 } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useFirms } from "@/hooks/useFirms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SECTORS = [
  { id: "agricultural", label: "Agriculture", Icon: Sprout },
  { id: "wildlife", label: "Wildlife & Surveillance", Icon: Binoculars },
  { id: "realestate", label: "Real Estate & Survey", Icon: Building2 },
];

export function OnboardingForm() {
  const router = useRouter();
  const update = useUpdateProfile();
  const { data: firms } = useFirms();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    sex: "",
    sector: "",
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
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleChange(e) {
    set(e.target.name, e.target.value);
  }

  const isAgricultural = form.sector === "agricultural";
  const isWildlife = form.sector === "wildlife";
  const isRealEstate = form.sector === "realestate";

  function handleSubmit(e) {
    e.preventDefault();
    update.mutate(form, {
      onSuccess: () => router.push("/logbook"),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
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
            <Label htmlFor="telephone">Phone <span className="font-normal text-muted-foreground">(optional if provided at signup)</span></Label>
            <Input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} />
          </div>
        </div>
      </section>

      {/* Sector */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-brand-navy-dark">
          What you do <span className="text-destructive">*</span>
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {SECTORS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => set("sector", id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all",
                form.sector === id
                  ? "border-brand-blue bg-brand-blue/5 text-brand-navy-dark"
                  : "border-border text-muted-foreground hover:border-brand-blue/40",
              )}
            >
              <Icon className={cn("size-6", form.sector === id ? "text-brand-blue" : "text-muted-foreground")} />
              {label}
            </button>
          ))}
        </div>

        {isAgricultural && (
          <div className="space-y-4 rounded-xl border border-border bg-brand-input/40 p-4">
            <div className="space-y-2">
              <Label htmlFor="crop">Crop Cultivation <span className="text-destructive">*</span></Label>
              <Input id="crop" name="crop" required={isAgricultural} value={form.crop} onChange={handleChange} />
            </div>
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
          </div>
        )}

        {isWildlife && (
          <div className="space-y-4 rounded-xl border border-border bg-brand-input/40 p-4">
            <div className="space-y-2">
              <Label htmlFor="wildlifeOrg">Organisation / Site <span className="text-destructive">*</span></Label>
              <Input id="wildlifeOrg" name="wildlifeOrg" required={isWildlife} placeholder="e.g. Kafue National Park" value={form.wildlifeOrg} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wildlifeRole">Position / Role <span className="text-destructive">*</span></Label>
              <Input id="wildlifeRole" name="wildlifeRole" required={isWildlife} placeholder="e.g. Forest Warden" value={form.wildlifeRole} onChange={handleChange} />
            </div>
          </div>
        )}

        {isRealEstate && (
          <div className="rounded-xl border border-border bg-brand-input/40 p-4">
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
          </div>
        )}
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-brand-navy-dark">Where you are</h2>
        <div className="space-y-2">
          <Label htmlFor="address">{isAgricultural ? "Address / Farm Location" : "Address"} <span className="text-destructive">*</span></Label>
          <Input id="address" name="address" required value={form.address} onChange={handleChange} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="region">Region <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Input id="region" name="region" value={form.region} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District / Division <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Input id="district" name="district" value={form.district} onChange={handleChange} />
          </div>
        </div>
      </section>

      {update.isError && (
        <p className="text-sm text-destructive">{update.error.message}</p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={update.isPending || !form.name || !form.surname || !form.sector}
          className="flex-1 bg-brand-navy text-white hover:bg-brand-navy/90"
        >
          {update.isPending ? "Saving…" : "Complete Profile & Go to Logbook →"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/logbook")}
        >
          Skip for now
        </Button>
      </div>
    </form>
  );
}
