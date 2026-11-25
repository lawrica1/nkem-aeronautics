"use client";

import { useState } from "react";
import { useAdminQuotes, useUpdateQuote } from "@/hooks/useQuotes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ListToolbar, matchRows, SaveStatus, EmptyList } from "@/components/admin/AdminTable";

const TABS = [
  { label: "New", statuses: ["new"] },
  { label: "Contacted", statuses: ["contacted"] },
  { label: "Closed", statuses: ["closed"] },
  { label: "All" },
];

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const STATUS_OPTIONS = [
  ["new", "New"],
  ["contacted", "Contacted"],
  ["closed", "Closed"],
];

const SECTOR_LABELS = {
  agricultural: "Agricultural",
  wildlife: "Wildlife & Surveillance",
  mining: "Mining",
  pipeline: "Pipeline & Infrastructure",
  "survey-mapping": "Survey & Mapping",
  evtol: "eVTOL",
  general: "General / Customer Service",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function QuoteRow({ quote }) {
  const update = useUpdateQuote();
  const [notes, setNotes] = useState(quote.adminNotes || "");

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-medium text-brand-navy-dark">{quote.name || quote.email}</p>
          <p className="text-xs text-muted-foreground">
            {SECTOR_LABELS[quote.sector] ?? quote.sector} &middot; {formatDate(quote.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus mutation={update} />
          <select
            aria-label="Status"
            className={`${fieldClass} w-auto`}
            defaultValue={quote.status}
            onChange={(e) => update.mutate({ id: quote.id, status: e.target.value })}
          >
            {STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Email:</dt>
          <dd className="text-brand-navy-dark">{quote.email}</dd>
        </div>
        {quote.whatsapp && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">WhatsApp:</dt>
            <dd className="text-brand-navy-dark">{quote.whatsapp}</dd>
          </div>
        )}
        {quote.company && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Company:</dt>
            <dd className="text-brand-navy-dark">{quote.company}</dd>
          </div>
        )}
        {quote.targetCountry && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Target Country/Region:</dt>
            <dd className="text-brand-navy-dark">{quote.targetCountry}</dd>
          </div>
        )}
        {quote.interestedProduct && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Interested Product:</dt>
            <dd className="text-brand-navy-dark">{quote.interestedProduct}</dd>
          </div>
        )}
        {quote.interestedIn && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Interested In:</dt>
            <dd className="text-brand-navy-dark capitalize">{quote.interestedIn}</dd>
          </div>
        )}
      </dl>

      <p className="text-sm text-brand-navy-dark">{quote.message}</p>

      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label>Admin notes</Label>
          <textarea rows={2} className={fieldClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <Button
          disabled={update.isPending}
          onClick={() => update.mutate({ id: quote.id, adminNotes: notes })}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export function QuotesAdminView() {
  const { data: quotes, isLoading, isError, error } = useAdminQuotes();
  const [tab, setTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading quote requests…</p>;
  if (isError) return <p className="text-sm text-destructive">{error.message}</p>;

  const shown = matchRows(quotes, tab, search, (q) => [q.name, q.email, q.company, q.whatsapp, q.interestedProduct]);

  return (
    <div className="space-y-4">
      <ListToolbar
        tabs={TABS}
        tab={tab}
        onTab={setTab}
        rows={quotes}
        search={search}
        onSearch={setSearch}
        placeholder="Search name, email, company…"
      />
      {shown.length ? (
        <div className="space-y-3">
          {shown.map((quote) => <QuoteRow key={quote.id} quote={quote} />)}
        </div>
      ) : (
        <EmptyList>{search ? "No quote requests match your search." : `No quote requests in “${tab.label}”.`}</EmptyList>
      )}
    </div>
  );
}
