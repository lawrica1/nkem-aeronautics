"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, NotebookPen, UserRoundCheck, MessageCircle } from "lucide-react";
import { SignupForm } from "@/components/SignupForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useResendOtp } from "@/hooks/useResendOtp";

function BrandHeader() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-brand-navy-dark"
    >
      <Image
        src="/images/logo.png"
        alt="Nkem Aeronautics"
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-full"
      />
      NKEM AERONAUTICS
    </Link>
  );
}

const SECTOR_BACKGROUNDS = {
  agricultural: "/images/services/agricultural-spraying.jpg",
  wildlife: "/images/services/wildlife-surveillance.jpg",
  realestate: "/images/services/real-estate.jpg",
  // ponytail: placeholder (aerial site survey, not an actual mine) until a real mining-site photo is supplied
  mining: "/images/services/survey-mapping.jpg",
};
const DEFAULT_BACKGROUND = "/images/services/real-estate.jpg";

function maskContact(value) {
  if (!value) return null;
  if (value.includes("@")) {
    const [user, domain] = value.split("@");
    return `${user.slice(0, 2)}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
  }
  const digits = value.replace(/\D/g, "");
  return `••••••${digits.slice(-4)}`;
}

export function SignupView() {
  const router = useRouter();
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [sector, setSector] = useState(null);
  const [signupData, setSignupData] = useState(null);
  const [channel, setChannel] = useState("sms");
  const [contact, setContact] = useState(null);
  const [otp, setOtp] = useState("");
  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  function handleSignupSuccess(data) {
    setSignupData(data);
    setChannel(data.otpChannel ?? (data.telephone ? "sms" : "email"));
    setContact(data.otpContact ?? (data.telephone || data.email));
    setStep("otp");
  }

  function handleVerify(e) {
    e.preventDefault();
    verifyOtp.mutate(
      { channel, contact, otp },
      {
        onSuccess: () => router.push("/onboarding"),
      },
    );
  }

  function handleResend() {
    resendOtp.mutate({ channel, contact });
  }

  function handleSwitchChannel() {
    const next = channel === "sms" ? "email" : "sms";
    const nextContact = next === "sms" ? signupData?.telephone : signupData?.email;
    if (!nextContact) return;
    setChannel(next);
    setContact(nextContact);
    resendOtp.mutate({ channel: next, contact: nextContact });
  }

  const canSwitchChannel = channel === "sms" ? !!signupData?.email : !!signupData?.telephone;

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden overflow-hidden bg-brand-navy px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 transition-[background-image] duration-500"
          style={{ backgroundImage: `url('${SECTOR_BACKGROUNDS[sector] ?? DEFAULT_BACKGROUND}')` }}
        />
        <div className="absolute inset-0 bg-brand-navy/40" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex-1 pt-8">
          <div
            className="animate-float absolute top-6 left-4 w-56 rounded-xl bg-white p-4 shadow-xl"
            style={{ animationDuration: "6s" }}
          >
            <p className="text-xs text-muted-foreground">Getting started</p>
            <ul className="mt-2 space-y-2 text-sm text-brand-navy-dark">
              {[
                { icon: UserRoundCheck, text: "Choose your sector" },
                { icon: ShieldCheck, text: "Verify your account" },
                { icon: NotebookPen, text: "Logbook ID issued" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon className="size-4 text-brand-blue" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="animate-float absolute top-52 left-36 w-52 rounded-xl bg-white p-4 shadow-xl"
            style={{ animationDuration: "7s", animationDelay: "0.8s" }}
          >
            <p className="text-xs text-muted-foreground">Your Logbook ID</p>
            <p className="mt-1 font-mono text-sm font-bold text-brand-navy-dark">NKEM-XXXX-YYYY</p>
          </div>
        </div>

        <div className="relative mt-auto">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Join the network, <span className="text-white">get started today.</span>
          </h1>
          <p className="mt-3 max-w-sm text-white/70">
            Sign up in seconds. Fill in your profile details at your own pace.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center overflow-y-auto px-6 py-16 sm:px-16">
        {step === "otp" && (
          <div className="mx-auto w-full max-w-md">
            <BrandHeader />

            <h2 className="mt-8 text-2xl font-bold text-brand-navy-dark">Verify your account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent a verification code via {channel === "sms" ? "text message" : "email"} to{" "}
              <span className="font-medium text-foreground">{maskContact(contact) ?? "your contact"}</span>.
            </p>

            {canSwitchChannel && (
              <button
                type="button"
                onClick={handleSwitchChannel}
                disabled={resendOtp.isPending}
                className="mt-1 text-xs font-medium text-brand-blue hover:underline disabled:opacity-60"
              >
                Send it to my {channel === "sms" ? "email" : "phone"} instead
              </button>
            )}

            <form onSubmit={handleVerify} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
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
                className="font-medium text-brand-blue hover:underline disabled:opacity-60"
              >
                {resendOtp.isPending ? "Sending…" : "Resend code"}
              </button>
            </p>
            {resendOtp.isSuccess && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-brand-blue">
                <MessageCircle className="size-3.5" /> Code resent.
              </p>
            )}
          </div>
        )}

        {step === "form" && (
          <div className="mx-auto w-full max-w-md">
            <BrandHeader />

            <h2 className="mt-8 text-2xl font-bold text-brand-navy-dark">Create your account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick signup — fill in your full profile details after verifying.
            </p>

            <div className="mt-8">
              <SignupForm onSuccess={handleSignupSuccess} onSectorChange={setSector} />
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-blue hover:underline">
                Log In
              </Link>
            </p>

            <p className="mt-10 text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Nkem Aeronautics. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
