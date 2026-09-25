"use client";

import { useState } from "react";
import { useAdminPartRequests, useUpdatePartRequest } from "@/hooks/usePartRequests";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const STATUS_OPTIONS = [
  ["submitted", "Submitted"],
  ["in_review", "In Review"],
  ["identified", "Part Identified"],
  ["unavailable", "Unavailable"],
  ["closed", "Closed"],
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function PartRequestRow({ request }) {
  const update = useUpdatePartRequest();
  const [notes, setNotes] = useState(request.adminNotes || "");

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-brand-navy-dark">
            {request.user?.name ? `${request.user.name} ${request.user.surname ?? ""}` : request.user?.email}
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
        </div>
        <select
          className={`${fieldClass} w-auto`}
          defaultValue={request.status}
          onChange={(e) => update.mutate({ id: request.id, status: e.target.value })}
        >
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-brand-navy-dark">{request.description}</p>

      {request.files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {request.files.map((file) => (
            <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="text-xs text-brand-blue underline">
              {file.originalName}
            </a>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label>Admin notes</Label>
          <textarea rows={2} className={fieldClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <Button
          disabled={update.isPending}
          onClick={() => update.mutate({ id: request.id, adminNotes: notes })}
        >
          Save
        </Button>
      </div>
      {update.isError && <p className="text-sm text-destructive">{update.error.message}</p>}
    </div>
  );
}

export function PartRequestsAdminView() {
  const { data: requests, isLoading, isError, error } = useAdminPartRequests();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading part requests…</p>;
  if (isError) return <p className="text-sm text-destructive">{error.message}</p>;
  if (!requests?.length) return <p className="text-sm text-muted-foreground">No part requests yet.</p>;

  return (
    <div className="space-y-3">
      {requests.map((request) => <PartRequestRow key={request.id} request={request} />)}
    </div>
  );
}
