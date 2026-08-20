import { useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Building2, NotebookPen } from "lucide-react";
import { SignupForm } from "@/components/SignupForm";

export function Signup() {
  const [confirmation, setConfirmation] = useState(null);

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
              {["Farm details", "Firm affiliation", "Logbook ID issued"].map((step) => (
                <li key={step} className="flex items-center gap-2">
                  <ListChecks className="size-4 text-brand-green" />
                  {step}
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
        {confirmation ? (
          <div className="mx-auto w-full max-w-md text-center">
            <Link to="/" className="text-lg font-bold tracking-tight text-brand-navy-dark">
              NKEM AERONAUTICS LTD
            </Link>
            <h2 className="mt-8 text-2xl font-bold text-brand-navy-dark">You&apos;re signed up</h2>
            <p className="mt-2 text-muted-foreground">
              Your logbook ID: <span className="font-medium text-foreground">{confirmation}</span>
            </p>
            <Link
              to="/logbook"
              className="mt-6 inline-block font-medium text-brand-green hover:underline"
            >
              Go to Logbook Portal
            </Link>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="text-lg font-bold tracking-tight text-brand-navy-dark">
              NKEM AERONAUTICS LTD
            </Link>

            <h2 className="mt-8 text-2xl font-bold text-brand-navy-dark">Create your account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Register your farm details to get a logbook ID and request services.
            </p>

            <div className="mt-8">
              <SignupForm onSuccess={(data) => setConfirmation(data?.identificationNumber ?? "Pending")} />
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-brand-green hover:underline">
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
