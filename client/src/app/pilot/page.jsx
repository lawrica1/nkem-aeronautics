"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getToken, signOut } from "@/lib/api";
import { useMyPilotOperations, useUpdatePilotOperation, useAttachPilotOperationMedia } from "@/hooks/usePilotOperations";
import { FileUpload } from "@/components/portal/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

function formatDate(iso) {
  if (!iso) return "Not scheduled";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function OperationCard({ operation }) {
  const update = useUpdatePilotOperation();
  const attachMedia = useAttachPilotOperationMedia();
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState(operation.results || "");
  const [comments, setComments] = useState(operation.comments || "");
  const [pendingFiles, setPendingFiles] = useState([]);

  return (
    <div className="rounded-xl border border-border">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left">
        <div>
          <p className="font-medium text-brand-navy-dark">
            {operation.customer?.name ? `${operation.customer.name} ${operation.customer.surname ?? ""}` : "Customer"} — {operation.service}
          </p>
          <p className="text-xs text-muted-foreground">
            {operation.drone?.name ?? "No drone assigned"} · {operation.region || "No region"} · {formatDate(operation.scheduledAt)}
          </p>
        </div>
        <span className="rounded-full bg-brand-input px-2.5 py-0.5 text-xs font-medium text-brand-navy-dark">{operation.statusLabel}</span>
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-border px-4 py-4">
          <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-muted-foreground">Customer contact</dt><dd className="text-brand-navy-dark">{operation.customer?.telephone || "—"}</dd></div>
            {operation.chemical ? <div><dt className="text-xs text-muted-foreground">Chemical</dt><dd className="text-brand-navy-dark">{operation.chemical}</dd></div> : null}
          </dl>

          <div className="space-y-1.5">
            <Label>Footage &amp; photos</Label>
            {operation.files.length > 0 && (
              <p className="text-xs text-muted-foreground">{operation.files.length} file(s) attached.</p>
            )}
            <FileUpload value={pendingFiles} onChange={setPendingFiles} purpose="operation-media" />
            {pendingFiles.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={attachMedia.isPending}
                onClick={() =>
                  attachMedia.mutate(
                    { id: operation.id, fileAssetIds: pendingFiles.map((f) => f.id) },
                    { onSuccess: () => setPendingFiles([]) },
                  )
                }
              >
                {attachMedia.isPending ? "Attaching…" : `Attach ${pendingFiles.length} file(s)`}
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Comments</Label>
            <textarea rows={2} className={fieldClass} value={comments} onChange={(e) => setComments(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Results</Label>
            <textarea rows={3} className={fieldClass} value={results} onChange={(e) => setResults(e.target.value)} />
          </div>

          {update.isError && <p className="text-sm text-destructive">{update.error.message}</p>}
          <Button
            disabled={update.isPending}
            className="bg-brand-navy text-white hover:bg-brand-navy/90"
            onClick={() => update.mutate({ id: operation.id, results, comments })}
          >
            {update.isPending ? "Saving…" : "Save"}
          </Button>

          {operation.review && (
            <div className="rounded-lg border border-border bg-brand-input/40 p-3 text-sm">
              <p className="font-medium text-brand-navy-dark">Customer review — {operation.review.rating}/5</p>
              {operation.review.comment && <p className="mt-1 text-muted-foreground">{operation.review.comment}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PilotPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  const { data: operations, isLoading, isError, error } = useMyPilotOperations({ enabled: isLoggedIn });

  if (!isLoggedIn) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-brand-navy-dark">Pilot Portal</h1>
        <p className="mt-2 text-muted-foreground">Log in with your pilot account to see your assigned operations.</p>
        <Link href="/login" className="mt-6 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white">Log In</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/pilot" className="flex items-center gap-2 font-semibold text-brand-navy-dark">
            <Image src="/images/logo.png" alt="Nkem Aeronautics" width={28} height={28} className="size-7 rounded-full" />
            Pilot Portal
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
        <h1 className="text-2xl font-semibold text-brand-navy-dark">My Operations</h1>
        <p className="mt-1 text-sm text-muted-foreground">Operations assigned to you. Submit results and attach footage as you complete them.</p>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading operations…</p>}
          {isError && <p className="text-sm text-destructive">{error.message}</p>}
          {!isLoading && !isError && operations?.length === 0 && (
            <p className="text-sm text-muted-foreground">No operations assigned to you yet.</p>
          )}
          {!isLoading && !isError && operations?.map((operation) => <OperationCard key={operation.id} operation={operation} />)}
        </div>
      </main>
    </div>
  );
}
