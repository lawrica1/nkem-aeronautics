"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Sprout, Binoculars, Pickaxe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/useSignup";
import { cn } from "@/lib/utils";

const SECTORS = [
  {
    id: "agricultural",
    label: "Agriculture",
    description: "Crop farming, plantation management, farm monitoring",
    Icon: Sprout,
  },
  {
    id: "wildlife",
    label: "Wildlife & Surveillance",
    description: "National parks, wildlife reserves, environmental monitoring",
    Icon: Binoculars,
  },
  {
    id: "mining",
    label: "Mining",
    description: "Site monitoring and drone-related mining operations",
    Icon: Pickaxe,
  },
];

const SECTOR_IDS = SECTORS.map((s) => s.id);

export function SignupForm({ onSuccess, onSectorChange, initialSector }) {
  const validInitialSector = SECTOR_IDS.includes(initialSector) ? initialSector : null;
  const [step, setStep] = useState(validInitialSector ? "credentials" : "sector"); // "sector" | "credentials"
  const [sector, setSector] = useState(validInitialSector);
  const [mode, setMode] = useState("password"); // "password" | "otp"
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signup = useSignup();

  // initialSector can arrive after mount (parent reads it from the URL in an
  // effect), so react to it changing instead of only using it as the useState
  // seed above — otherwise a later update never advances past the picker.
  useEffect(() => {
    if (SECTOR_IDS.includes(initialSector)) {
      setSector(initialSector);
      setStep("credentials");
    }
  }, [initialSector]);

  function handleSectorNext() {
    if (sector) setStep("credentials");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const body =
      mode === "otp"
        ? { email, sector, mode: "otp" }
        : { email, sector, password, telephone: telephone || undefined };

    signup.mutate(body, {
      onSuccess: (data) =>
        onSuccess?.({
          email,
          telephone: telephone || null,
          sector,
          otpChannel: data.otpChannel,
          otpContact: data.otpContact,
        }),
    });
  }

  if (step === "sector") {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            This helps us show you the right services and set up your account correctly.
          </p>
        </div>

        <div className="space-y-3">
          {SECTORS.map(({ id, label, description, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSector(id);
                onSectorChange?.(id);
              }}
              className={cn(
                "flex w-full items-start gap-4 rounded-xl border-2 px-4 py-4 text-left transition-all",
                sector === id
                  ? "border-brand-blue bg-brand-blue/5"
                  : "border-border hover:border-brand-blue/40 hover:bg-brand-input/40",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                  sector === id ? "bg-brand-blue text-white" : "bg-brand-input text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className={cn("font-semibold", sector === id ? "text-brand-navy-dark" : "text-foreground")}>
                  {label}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
              </div>
            </button>
          ))}
        </div>

        <Button
          type="button"
          onClick={handleSectorNext}
          disabled={!sector}
          className="w-full bg-brand-navy text-white hover:bg-brand-navy/90 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    );
  }

  // step === "credentials"
  const chosen = SECTORS.find((s) => s.id === sector);

  return (
    <div className="space-y-6">
      {/* Sector badge + back */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStep("sector")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        {chosen && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue">
            <chosen.Icon className="size-3.5" />
            {chosen.label}
          </span>
        )}
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border bg-brand-input/60 p-1">
        {[
          { id: "password", label: "Email & Password" },
          { id: "otp", label: "Email OTP only" },
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMode(opt.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              mode === opt.id
                ? "bg-white text-brand-navy-dark shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {mode === "password" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="telephone">
                Phone Number{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="telephone"
                type="tel"
                autoComplete="tel"
                placeholder="+237 670 000 000"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                If provided, your verification code will be sent by SMS. Otherwise we use email.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </>
        )}

        {mode === "otp" && (
          <p className="rounded-lg bg-brand-input/60 px-3 py-2 text-sm text-muted-foreground">
            We&apos;ll send a one-time code to your email. You can set a password and complete your
            profile details after signing in.
          </p>
        )}

        {signup.isError && (
          <p className="text-sm text-destructive">{signup.error.message}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-brand-navy text-white transition-transform hover:scale-[1.02] hover:bg-brand-navy/90"
          disabled={signup.isPending}
        >
          {signup.isPending ? "Sending code…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}
