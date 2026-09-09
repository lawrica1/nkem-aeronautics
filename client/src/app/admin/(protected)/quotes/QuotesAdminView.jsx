"use client";

import { useState } from "react";
import { useAdminQuotes, useUpdateQuote } from "@/hooks/useQuotes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  realestate: "Real Estate & Surveillance",
  evtol: "eVTOL",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function QuoteRow({ quote }) {
  const update = useUpdateQuote();
  const [notes, setNotes] = useState(quote.adminNotes || "");

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-medium text-brand-navy-dark">{quote.name || quote.email}</p>
          <p className="text-xs text-muted-foreground">
            {SECTOR_LABELS[quote.sector] ?? quote.sector} &middot; {formatDate(quote.createdAt)}
          </p>
        </div>
        <select
          className={`${fieldClass} w-auto`}
          defaultValue={quote.status}
          onChange={(e) => update.mutate({ id: quote.id, status: e.target.value })}
        >
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
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
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Target Country/Region:</dt>
          <dd className="text-brand-navy-dark">{quote.targetCountry}</dd>
        </div>
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

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading quote requests…</p>;
  if (isError) return <p className="text-sm text-destructive">{error.message}</p>;
  if (!quotes?.length) return <p className="text-sm text-muted-foreground">No quote requests yet.</p>;

  return (
    <div className="space-y-3">
      {quotes.map((quote) => <QuoteRow key={quote.id} quote={quote} />)}
    </div>
  );
}
