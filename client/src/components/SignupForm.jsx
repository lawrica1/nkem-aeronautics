import { useState } from "react";
import { Eye, EyeOff, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSignup } from "@/hooks/useSignup";
import { useFirms } from "@/hooks/useFirms";

const EMPTY_FORM = {
  surname: "",
  name: "",
  sex: "",
  telephone: "",
  email: "",
  address: "",
  crop: "",
  password: "",
  firm: "",
  photo: null,
};

export function SignupForm({ onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const signup = useSignup();
  const { data: firms } = useFirms();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSelect(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, photo: file }));
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();
    signup.mutate(form, { onSuccess });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-input">
          {photoPreview ? (
            <img src={photoPreview} alt="" className="size-full object-cover" />
          ) : (
            <UserRound className="size-7 text-muted-foreground" />
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="photo">Profile Photo (optional)</Label>
          <Input id="photo" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="h-auto py-1.5" />
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
        <Label htmlFor="address">Address / Farm Location</Label>
        <Input id="address" name="address" required value={form.address} onChange={handleChange} />
      </div>

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
