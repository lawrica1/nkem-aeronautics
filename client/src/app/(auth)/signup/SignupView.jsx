"use client";

import { useState } from "react";
import Link from "next/link";
import { ListChecks, Building2, NotebookPen, MessageCircle } from "lucide-react";
import { SignupForm } from "@/components/SignupForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useResendOtp } from "@/hooks/useResendOtp";

function maskTelephone(telephone) {
  if (!telephone) return null;
  const digits = telephone.replace(/\D/g, "");
  const lastFour = digits.slice(-4);
  return `••••••${lastFour}`;
}

function maskEmail(email) {
  if (!email) return null;
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(user.length - visible.length, 1))}@${domain}`;
}

export function SignupView() {
  const [step, setStep] = useState("form"); // "form" | "otp" | "done"
  const [signupData, setSignupData] = useState(null);
  const [channel, setChannel] = useState("sms"); // "sms" | "email"
  const [otp, setOtp] = useState("");
  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  const contact = channel === "sms" ? signupData?.telephone : signupData?.email;
  const maskedContact =
    channel === "sms" ? maskTelephone(signupData?.telephone) : maskEmail(signupData?.email);

  function handleSignupSuccess(data) {
    setSignupData(data);
    setStep("otp");
  }

  function handleVerify(e) {
    e.preventDefault();
    verifyOtp.mutate(
      { channel, contact, otp },
      {
        onSuccess: (data) => {
          setSignupData((prev) => ({ ...prev, ...data }));
          setStep("done");
        },
      },
    );
  }

  function handleResend() {
    resendOtp.mutate({ channel, contact });
  }

  function handleSwitchChannel() {
    const nextChannel = channel === "sms" ? "email" : "sms";
    const nextContact = nextChannel === "sms" ? signupData?.telephone : signupData?.email;
    setChannel(nextChannel);
    resendOtp.mutate({ channel: nextChannel, contact: nextContact });
  }

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Illustrative product preview — not real live data, just showing what the workspace looks like. */}
      <div className="relative hidden overflow-hidden bg-brand-navy px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{ backgroundImage: "url('/images/services/real-estate.jpg')" }}
        />
        <div className="absolute inset-0 bg-brand-navy/40" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(242,183,5,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(63,125,79,0.2), transparent 50%)",
          }}
        />

        <div className="relative flex-1">
          <div
            className="animate-float absolute top-8 left-4 w-56 rounded-xl bg-white p-4 shadow-xl"
            style={{ animationDuration: "6s" }}
          >
            <p className="text-xs text-muted-foreground">Sign-Up Progress</p>
            <ul className="mt-2 space-y-2 text-sm text-brand-navy-dark">
              {["Farm details", "Firm affiliation", "Logbook ID issued"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ListChecks className="size-4 text-brand-green" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="animate-float absolute top-48 left-40 w-52 rounded-xl bg-white p-4 shadow-xl"
            style={{ animationDuration: "7s", animationDelay: "0.8s" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Firm Affiliation</p>
              <Building2 className="size-4 text-brand-gold" />
            </div>
            <p className="mt-1 text-sm font-semibold text-brand-navy-dark">CDC &middot; Jitu SAP</p>
          </div>

          <div
            className="animate-float absolute top-80 left-6 w-60 rounded-xl bg-white p-4 shadow-xl"
            style={{ animationDuration: "5.5s", animationDelay: "1.6s" }}
          >
            <div className="flex items-center gap-2">
              <NotebookPen className="size-4 text-brand-green" />
              <p className="text-xs font-medium text-muted-foreground">Your Logbook</p>
            </div>
            <p className="mt-1 font-mono text-sm font-semibold text-brand-navy-dark">NKEM-XXXX-YYYY</p>
          </div>
        </div>

        <div className="relative mt-auto">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Join the network, <span className="text-brand-gold">get started today.</span>
          </h1>
          <p className="mt-3 max-w-sm text-white/70">
            Register your farm and receive a logbook ID and identification in minutes.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center overflow-y-auto px-6 py-16 sm:px-16">
        {step === "done" && (
          <div className="mx-auto w-full max-w-md text-center">
            <Link href="/" className="text-lg font-bold tracking-tight text-brand-navy-dark">
              NKEM AERONAUTICS LTD
            </Link>
            <h2 className="mt-8 text-2xl font-bold text-brand-navy-dark">You&apos;re signed up</h2>
            <p className="mt-2 text-muted-foreground">
              Your logbook ID:{" "}
              <span className="font-medium text-foreground">
                {signupData?.identificationNumber ?? "Pending"}
              </span>
            </p>
            <Link
              href="/logbook"
              className="mt-6 inline-block font-medium text-brand-green hover:underline"
            >
              Go to Logbook Portal
            </Link>
          </div>
        )}

        {step === "otp" && (
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="text-lg font-bold tracking-tight text-brand-navy-dark">
              NKEM AERONAUTICS LTD
            </Link>

            <h2 className="mt-8 text-2xl font-bold text-brand-navy-dark">Verify your account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent a verification code via {channel === "sms" ? "text message" : "email"} to{" "}
              {maskedContact ?? (channel === "sms" ? "your phone number" : "your email")}. Enter it
              below to activate your account.
            </p>
            {(channel === "sms" ? signupData?.email : signupData?.telephone) && (
              <button
                type="button"
                onClick={handleSwitchChannel}
                disabled={resendOtp.isPending}
                className="mt-1 text-xs font-medium text-brand-green hover:underline disabled:opacity-60"
              >
                Send it to my {channel === "sms" ? "email" : "phone"} instead
              </button>
            )}

            <form onSubmit={handleVerify} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              {verifyOtp.isError && (
                <p className="text-sm text-destructive">{verifyOtp.error.message}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-brand-navy text-white transition-transform hover:scale-[1.02] hover:bg-brand-navy/90"
                disabled={verifyOtp.isPending}
              >
                {verifyOtp.isPending ? "Verifying…" : "Verify & Continue"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Didn&apos;t get a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendOtp.isPending}
                className="font-medium text-brand-green hover:underline disabled:opacity-60"
              >
                {resendOtp.isPending ? "Sending…" : "Resend code"}
              </button>
            </p>
            {resendOtp.isSuccess && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-brand-green">
                <MessageCircle className="size-3.5" /> Code resent.
              </p>
            )}
          </div>
        )}

        {step === "form" && (
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="text-lg font-bold tracking-tight text-brand-navy-dark">
              NKEM AERONAUTICS LTD
            </Link>

            <h2 className="mt-8 text-2xl font-bold text-brand-navy-dark">Create your account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Register your farm details to get a logbook ID and request services.
            </p>

            <div className="mt-8">
              <SignupForm onSuccess={handleSignupSuccess} />
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-green hover:underline">
                Log In
              </Link>
            </p>

            <p className="mt-10 text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Nkem Aeronautics Ltd. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
