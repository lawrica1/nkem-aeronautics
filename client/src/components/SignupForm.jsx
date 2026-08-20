"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSignup } from "@/hooks/useSignup";
import { useFirms } from "@/hooks/useFirms";
import { SECTORS } from "@/components/SectorTabs";
import { cn } from "@/lib/utils";

const EMPTY_FORM = {
  sector: "agricultural",
  surname: "",
  name: "",
  sex: "",
  telephone: "",
  email: "",
  address: "",
  crop: "",
  password: "",
  firm: "",
  otherFirm: "",
  wildlifeOrg: "",
  wildlifeRole: "",
};

export function SignupForm({ onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  // Kept separate from `form` (which is sent as JSON) since a File can't be
  // serialized that way — wire this into the mutation body once the backend
  // has a multipart/upload endpoint to receive it.
  const [_photo, setPhoto] = useState(null);
  const signup = useSignup();
  const { data: firms } = useFirms();
  const isAgricultural = form.sector === "agricultural";
  const isWildlife = form.sector === "wildlife";

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSelect(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    signup.mutate(form, {
      onSuccess: (data) => onSuccess?.({ ...data, telephone: form.telephone, email: form.email }),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Signing up for</Label>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((sector) => {
            const isActive = form.sector === sector.id;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => handleSelect("sector", sector.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand-green text-white shadow-sm"
                    : "bg-brand-gray-light text-neutral-600 hover:bg-neutral-200",
                )}
              >
                {sector.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input id="surname" name="surname" required value={form.surname} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required value={form.name} onChange={handleChange} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sex">Sex</Label>
          <Select value={form.sex} onValueChange={(v) => handleSelect("sex", v)}>
            <SelectTrigger id="sex" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="telephone">Telephone</Label>
          <Input id="telephone" name="telephone" type="tel" required value={form.telephone} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Profile Photo</Label>
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{isAgricultural ? "Address / Farm Location" : "Address"}</Label>
        <Input id="address" name="address" required value={form.address} onChange={handleChange} />
      </div>

      {isAgricultural && (
        <>
          <div className="space-y-2">
            <Label htmlFor="crop">Crop Cultivation</Label>
            <Input id="crop" name="crop" required value={form.crop} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firm">Firm Affiliation</Label>
            <Select value={form.firm} onValueChange={(v) => handleSelect("firm", v)}>
              <SelectTrigger id="firm" className="w-full">
                <SelectValue placeholder="Select firm affiliation" />
              </SelectTrigger>
              <SelectContent>
                {firms?.map((firm) => (
                  <SelectItem key={firm.value} value={firm.value}>
                    {firm.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.firm === "other" && (
            <div className="space-y-2">
              <Label htmlFor="otherFirm">Firm Name</Label>
              <Input
                id="otherFirm"
                name="otherFirm"
                placeholder="Enter the firm you're affiliated with"
                required
                value={form.otherFirm}
                onChange={handleChange}
              />
            </div>
          )}
        </>
      )}

      {isWildlife && (
        <>
          <div className="space-y-2">
            <Label htmlFor="wildlifeOrg">Wildlife Organization / Site</Label>
            <Input
              id="wildlifeOrg"
              name="wildlifeOrg"
              placeholder="e.g. Lusaka Zoo, Kafue National Park"
              required
              value={form.wildlifeOrg}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wildlifeRole">Position / Role</Label>
            <Input
              id="wildlifeRole"
              name="wildlifeRole"
              placeholder="e.g. Zoo Warden, Forest Warden"
              required
              value={form.wildlifeRole}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={form.password}
            onChange={handleChange}
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {signup.isError && <p className="text-sm text-destructive">{signup.error.message}</p>}
      <Button
        type="submit"
        className="w-full bg-brand-navy text-white transition-transform hover:scale-[1.02] hover:bg-brand-navy/90"
        disabled={signup.isPending}
      >
        {signup.isPending ? "Signing up…" : "Sign Up"}
      </Button>
    </form>
  );
}
