"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getToken } from "@/lib/api";
import { OnboardingForm } from "@/components/OnboardingForm";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) router.replace("/signup");
  }, [router]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-brand-navy-dark"
        >
          <Image src="/images/logo.png" alt="Nkem Aeronautics" width={28} height={28} className="size-7 rounded-full" />
          NKEM AERONAUTICS
        </Link>

        <div className="mt-8">
          <h1 className="text-2xl font-bold text-brand-navy-dark">Complete your profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us a bit about yourself so we can connect you with the right services. You can always update this later from your logbook.
          </p>
        </div>

        <div className="mt-8">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
