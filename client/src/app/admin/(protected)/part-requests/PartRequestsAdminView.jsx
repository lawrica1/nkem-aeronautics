"use client";

import { useState } from "react";
import { useAdminPartRequests, useUpdatePartRequest } from "@/hooks/usePartRequests";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ListToolbar, matchRows, SaveStatus, EmptyList } from "@/components/admin/AdminTable";

const TABS = [
  { label: "New", statuses: ["submitted"] },
  { label: "In review", statuses: ["in_review"] },
  { label: "Done", statuses: ["identified", "unavailable", "closed"] },
  { label: "All" },
];

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
        <div className="flex items-center gap-3">
          <SaveStatus mutation={update} />
          <select
            aria-label="Status"
            className={`${fieldClass} w-auto`}
            defaultValue={request.status}
            onChange={(e) => update.mutate({ id: request.id, status: e.target.value })}
          >
            {STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
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
    </div>
  );
}

export function PartRequestsAdminView() {
  const { data: requests, isLoading, isError, error } = useAdminPartRequests();
  const [tab, setTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading part requests…</p>;
  if (isError) return <p className="text-sm text-destructive">{error.message}</p>;

  const shown = matchRows(requests, tab, search, (r) => [r.user?.name, r.user?.surname, r.user?.email, r.description]);

  return (
    <div className="space-y-4">
      <ListToolbar
        tabs={TABS}
        tab={tab}
        onTab={setTab}
        rows={requests}
        search={search}
        onSearch={setSearch}
        placeholder="Search customer or part description…"
      />
      {shown.length ? (
        <div className="space-y-3">
          {shown.map((request) => <PartRequestRow key={request.id} request={request} />)}
        </div>
      ) : (
        <EmptyList>{search ? "No part requests match your search." : `No part requests in “${tab.label}”.`}</EmptyList>
      )}
    </div>
  );
}
