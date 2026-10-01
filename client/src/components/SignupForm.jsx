"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useSignup } from "@/hooks/useSignup";
import { cn } from "@/lib/utils";

export function SignupForm({ onSuccess }) {
  const [step, setStep] = useState("contact"); // "contact" | "credentials"
  const [contactMethod, setContactMethod] = useState(null); // "email" | "phone"
  const [mode, setMode] = useState("password"); // "password" | "otp"
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signup = useSignup();

  function handleContactNext() {
    if (contactMethod) setStep("credentials");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const body =
      mode === "otp"
        ? {
            mode: "otp",
            ...(contactMethod === "email" ? { email } : { telephone }),
          }
        : {
            password,
            ...(contactMethod === "email" ? { email } : { telephone }),
          };

    signup.mutate(body, {
      onSuccess: (data) =>
        onSuccess?.({
          email: contactMethod === "email" ? email : null,
          telephone: contactMethod === "phone" ? telephone : null,
          otpChannel: data.otpChannel,
          otpContact: data.otpContact,
        }),
    });
  }

  // ── Step 1: Contact method ────────────────────────────────────────────────
  if (step === "contact") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          How would you like to receive your verification code?
        </p>

        <div className="space-y-3">
          {[
            { id: "email", label: "Email address", description: "OTP sent to your email inbox", Icon: Mail },
            { id: "phone", label: "Phone number", description: "OTP sent via SMS to your phone", Icon: Phone },
          ].map(({ id, label, description, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setContactMethod(id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-xl border-2 px-4 py-4 text-left transition-all",
                contactMethod === id
                  ? "border-brand-blue bg-brand-blue/5"
                  : "border-border hover:border-brand-blue/40 hover:bg-brand-input/40",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                  contactMethod === id ? "bg-brand-blue text-white" : "bg-brand-input text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className={cn("font-semibold", contactMethod === id ? "text-brand-navy-dark" : "text-foreground")}>
                  {label}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
              </div>
            </button>
          ))}
        </div>

        <Button
          type="button"
          onClick={handleContactNext}
          disabled={!contactMethod}
          className="w-full bg-brand-navy text-white hover:bg-brand-navy/90 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    );
  }

  // ── Step 2: Credentials ───────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStep("contact")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border bg-brand-input/60 p-1">
        {[
          { id: "password", label: "OTP + Password" },
          { id: "otp", label: "OTP only" },
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
        {/* Contact field */}
        {contactMethod === "email" ? (
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="telephone">Phone number</Label>
            <PhoneInput
              id="telephone"
              name="telephone"
              required
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>
        )}

        {/* Password field */}
        {mode === "password" && (
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
        )}

        {mode === "otp" && (
          <p className="rounded-lg bg-brand-input/60 px-3 py-2 text-sm text-muted-foreground">
            We&apos;ll send a one-time code to your {contactMethod === "email" ? "email" : "phone"}. You can set a password and complete your profile after signing in.
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
