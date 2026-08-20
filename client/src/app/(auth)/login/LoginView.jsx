"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users2, ClipboardCheck, MapPin } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

export function LoginView() {
  const router = useRouter();

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Illustrative product preview — not real live data, just showing what the workspace looks like. */}
      <div className="relative hidden overflow-hidden bg-brand-navy px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url('/images/services/agricultural-spraying.jpg')" }}
        />
        <div className="absolute inset-0 bg-brand-navy/45" />
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
            className="animate-float absolute top-10 left-4 w-56 rounded-xl bg-white p-4 shadow-xl"
            style={{ animationDuration: "6s" }}
          >
            <p className="text-xs text-muted-foreground">Logbook Snapshot</p>
            <p className="mt-1 text-sm font-semibold text-brand-navy-dark">This Week&apos;s Requests</p>
            <div className="mt-3 flex h-16 items-end gap-1.5">
              {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-brand-green/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div
            className="animate-float absolute top-44 left-40 w-48 rounded-xl bg-white p-4 shadow-xl"
            style={{ animationDuration: "7s", animationDelay: "0.8s" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Coverage</p>
              <MapPin className="size-4 text-brand-gold" />
            </div>
            <p className="mt-1 text-sm font-semibold text-brand-navy-dark">South West Province</p>
          </div>

          <div
            className="animate-float absolute top-80 left-6 w-64 rounded-xl bg-white p-4 shadow-xl"
            style={{ animationDuration: "5.5s", animationDelay: "1.6s" }}
          >
            <p className="text-xs font-medium text-muted-foreground">Today&apos;s Tasks</p>
            <ul className="mt-2 space-y-2 text-sm text-brand-navy-dark">
              {["Review spraying request", "Confirm firm routing", "Update farmer logbook"].map(
                (task) => (
                  <li key={task} className="flex items-center gap-2">
                    <ClipboardCheck className="size-4 text-brand-green" />
                    {task}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div
            className="animate-float absolute top-[27rem] left-52 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-xl"
            style={{ animationDuration: "6.5s", animationDelay: "0.4s" }}
          >
            <Users2 className="size-4 text-brand-green" />
            <span className="text-xs font-medium text-brand-navy-dark">Farmer network</span>
          </div>

          <div
            className="animate-float absolute top-4 right-2 w-40 overflow-hidden rounded-xl bg-white p-2 shadow-xl"
            style={{ animationDuration: "6s", animationDelay: "1.2s" }}
          >
            <img
              src="/images/services/wildlife-surveillance.jpg"
              alt=""
              className="h-20 w-full rounded-md object-cover"
            />
            <p className="mt-2 px-1 text-xs font-medium text-brand-navy-dark">Recent Flight Report</p>
          </div>
        </div>

        <div className="relative mt-auto">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Manage your farm operations, <span className="text-brand-gold">in one place.</span>
          </h1>
          <p className="mt-3 max-w-sm text-white/70">
            Registration, logbooks, and service requests unified in a single, secure workspace.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-16 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="text-lg font-bold tracking-tight text-brand-navy-dark">
            NKEM AERONAUTICS LTD
          </Link>

          <h2 className="mt-8 text-2xl font-bold text-brand-navy-dark">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your Nkem Aeronautics workspace.
          </p>

          <div className="mt-8">
            <LoginForm onSuccess={() => router.push("/logbook")} />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-brand-green hover:underline">
              Sign Up
            </Link>
          </p>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Nkem Aeronautics Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
