"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("contact"); // "contact" | "otp" | "password"
  const [method, setMethod] = useState("email");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRequestCode(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: method === "email" ? { email: contact } : { telephone: contact },
      });
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: { contact, otp, newPassword },
      });
      router.push("/login?reset=1");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to login
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-brand-navy-dark">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === "contact" && "Enter your email or phone number and we'll send a verification code."}
          {step === "otp" && `Enter the code we sent to ${contact}.`}
        </p>
      </div>

      {step === "contact" && (
        <form onSubmit={handleRequestCode} className="space-y-5">
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

          <div className="space-y-2">
            <Label htmlFor="contact">
              {method === "email" ? "Email address" : "Phone number"}
            </Label>
            <div className="relative">
              {method === "email"
                ? <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                : <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              }
              <Input
                id="contact"
                type={method === "email" ? "email" : "tel"}
                placeholder={method === "email" ? "you@example.com" : "+237 670 000 000"}
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-brand-navy text-white hover:bg-brand-navy/90">
            {loading ? "Sending code…" : "Send reset code"}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={(e) => { e.preventDefault(); setStep("password"); }} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={otp.length < 6} className="w-full bg-brand-navy text-white hover:bg-brand-navy/90">
            Verify code
          </Button>

          <button
            type="button"
            onClick={() => setStep("contact")}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Use a different contact
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-brand-navy text-white hover:bg-brand-navy/90">
            {loading ? "Saving…" : "Set new password"}
          </Button>
        </form>
      )}
    </div>
  );
}
