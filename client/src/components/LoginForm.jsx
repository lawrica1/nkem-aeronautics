"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Sprout, Binoculars, Pickaxe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useLogin } from "@/hooks/useLogin";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SECTORS = [
  {
    id: "agricultural",
    label: "Agriculture",
    description: "Crop farming, plantation management, farm monitoring",
    Icon: Sprout,
    color: "text-brand-green",
  },
  {
    id: "wildlife",
    label: "Wildlife & Surveillance",
    description: "National parks, reserves, environmental monitoring",
    Icon: Binoculars,
    color: "text-brand-blue",
  },
  {
    id: "mining",
    label: "Mining",
    description: "Site monitoring and drone-related mining operations",
    Icon: Pickaxe,
    color: "text-brand-gold",
  },
];

export function LoginForm({ onSuccess }) {
  const [step, setStep] = useState("sector"); // "sector" | "credentials"
  const [sector, setSector] = useState(null);
  const [method, setMethod] = useState("email"); // "email" | "phone"
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const chosen = SECTORS.find((s) => s.id === sector);

  function handleSubmit(e) {
    e.preventDefault();
    const body =
      method === "email"
        ? { email: contact, password, sector }
        : { telephone: contact, password, sector };
    login.mutate(body, { onSuccess });
  }

  // ── Step 1: Sector selection ──────────────────────────────────────────────
  if (step === "sector") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Which service portal would you like to access today?
        </p>

        <div className="space-y-3">
          {SECTORS.map(({ id, label, description, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSector(id)}
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
          onClick={() => sector && setStep("credentials")}
          disabled={!sector}
          className="w-full bg-brand-navy text-white hover:bg-brand-navy/90 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    );
  }

  // ── Step 2: Credentials ───────────────────────────────────────────────────
  return (
    <div className="space-y-5">
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

      {/* Method toggle */}
      <div className="flex rounded-lg border border-border bg-brand-input/60 p-1">
        {[
          { id: "email", label: "Email" },
          { id: "phone", label: "Phone number" },
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => { setMethod(opt.id); setContact(""); }}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              method === opt.id
                ? "bg-white text-brand-navy-dark shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact field */}
        <div className="space-y-2">
          <Label htmlFor="login-contact">
            {method === "email" ? "Email" : "Phone number"}
          </Label>
          {method === "email" ? (
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-contact"
                type="email"
                placeholder="you@example.com"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="pl-9"
                autoComplete="email"
              />
            </div>
          ) : (
            <PhoneInput
              id="login-contact"
              name="login-contact"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-9 pl-9"
              autoComplete="current-password"
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

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-brand-navy-dark">
            Forgot password?
          </Link>
        </div>

        {login.isError && <p className="text-sm text-destructive">{login.error.message}</p>}

        <Button
          type="submit"
          className="w-full bg-brand-navy text-white transition-transform hover:scale-[1.02] hover:bg-brand-navy/90"
          disabled={login.isPending}
        >
          {login.isPending ? "Logging in…" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
