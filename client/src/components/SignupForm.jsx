"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/useSignup";
import { cn } from "@/lib/utils";

export function SignupForm({ onSuccess }) {
  const [mode, setMode] = useState("password"); // "password" | "otp"
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signup = useSignup();

  function handleSubmit(e) {
    e.preventDefault();
    const body = mode === "otp"
      ? { email, mode: "otp" }
      : { email, password, telephone: telephone || undefined };

    signup.mutate(body, {
      onSuccess: (data) =>
        onSuccess?.({ email, telephone: telephone || null, otpChannel: data.otpChannel, otpContact: data.otpContact }),
    });
  }

  return (
    <div className="space-y-6">
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
              <Label htmlFor="telephone">Phone Number <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input
                id="telephone"
                type="tel"
                autoComplete="tel"
                placeholder="+237 670 000 000"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                If provided, we&apos;ll send your verification code by SMS. Otherwise we&apos;ll use your email.
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
            We&apos;ll send a one-time code to your email to verify your account. You can set a password and fill in your profile details after signing in.
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
