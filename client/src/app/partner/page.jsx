"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getToken, signOut } from "@/lib/api";
import { useMyPartnerRequests } from "@/hooks/usePartners";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function RequestCard({ request }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-brand-navy-dark">{request.service}</p>
          <p className="text-xs text-muted-foreground">
            {request.region || request.location || "No location"} · Shared {formatDate(request.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-brand-input px-2.5 py-0.5 text-xs font-medium text-brand-navy-dark">
          {request.statusLabel}
        </span>
      </div>

      {request.description && <p className="mt-3 text-sm text-muted-foreground">{request.description}</p>}

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Customer</dt>
          <dd className="text-brand-navy-dark">
            {request.customer?.name ? `${request.customer.name} ${request.customer.surname ?? ""}` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Contact</dt>
          <dd className="text-brand-navy-dark">{request.customer?.telephone || "—"}</dd>
        </div>
        {request.operation?.scheduledAt && (
          <div>
            <dt className="text-xs text-muted-foreground">Scheduled</dt>
            <dd className="text-brand-navy-dark">{formatDate(request.operation.scheduledAt)}</dd>
          </div>
        )}
      </dl>

      {request.operation?.results && (
        <div className="mt-3 rounded-lg bg-brand-input/40 p-3 text-sm">
          <p className="text-xs text-muted-foreground">Results</p>
          <p className="mt-0.5 text-brand-navy-dark">{request.operation.results}</p>
        </div>
      )}
    </div>
  );
}

export default function PartnerPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  const { data: requests, isLoading, isError, error } = useMyPartnerRequests({ enabled: isLoggedIn });

  if (!isLoggedIn) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-brand-navy-dark">Partner Portal</h1>
        <p className="mt-2 text-muted-foreground">Log in with your partner account to see requests shared with you.</p>
        <Link href="/login" className="mt-6 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white">Log In</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/partner" className="flex items-center gap-2 font-semibold text-brand-navy-dark">
            <Image src="/images/logo.png" alt="Nkem Aeronautics" width={28} height={28} className="size-7 rounded-full" />
            Partner Portal
          </Link>
          <button
            type="button"
            onClick={async () => { await signOut(); window.location.href = "/"; }}
            className="text-sm text-muted-foreground hover:text-brand-navy-dark"
          >
            Log out
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-brand-navy-dark">Shared Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Requests Nkem Aeronautics has shared with you. This view is read-only — Nkem coordinates the work.
        </p>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading requests…</p>}
          {isError && <p className="text-sm text-destructive">{error.message}</p>}
          {!isLoading && !isError && requests?.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing has been shared with you yet.</p>
          )}
          {!isLoading && !isError && requests?.map((request) => <RequestCard key={request.id} request={request} />)}
        </div>
      </main>
    </div>
  );
}
