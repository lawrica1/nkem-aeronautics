"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIdCards, useUpdateIdCard, useDeleteIdCard } from "@/hooks/useIdCards";
import { TableCard, RowMenu, filterRows, pageRows, thClass, tdClass } from "@/components/admin/AdminTable";
import { FileUpload } from "@/components/portal/FileUpload";
import { IdCardPreview } from "./IdCardPreview";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

export const STATUS_OPTIONS = [
  ["active", "Active"],
  ["lost", "Lost"],
  ["returned", "Returned"],
];

const STATUS_STYLES = {
  active: "bg-green-50 text-green-700",
  lost: "bg-red-50 text-red-700",
  returned: "bg-gray-100 text-gray-500",
};

export const CARD_TYPE_LABELS = { director: "Director", employee: "Employee" };

export const formatDate = (value) => (value ? value.slice(0, 10) : "—");

export function IdStatusPill({ status }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium uppercase ${STATUS_STYLES[status]}`}>{status}</span>
  );
}

function toForm(card) {
  return {
    fullName: card?.fullName ?? "",
    jobTitle: card?.jobTitle ?? "",
    department: card?.department ?? "",
    country: card?.country ?? "",
    cardType: card?.cardType ?? "employee",
    issueDate: card?.issueDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    expiryDate: card?.expiryDate?.slice(0, 10) ?? "",
    notes: card?.notes ?? "",
    // FileUpload works with asset objects; the card only stores the URL.
    photo: card?.photoUrl ? [{ id: card.photoUrl, url: card.photoUrl, mimeType: "image/", originalName: "Photo" }] : [],
  };
}

const toPayload = ({ photo, ...form }) => ({ ...form, photoUrl: photo[0]?.url ?? null });

// Employee ID and card type are printed on the card, so they're only chosen when the card is added.
export function IdCardForm({ card, mutation, submitLabel, onDone, onCancel }) {
  const [form, setForm] = useState(() => toForm(card));
  const text = (key, label, props) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <input className={fieldClass} required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...props} />
    </div>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const payload = toPayload(form);
        mutation.mutate(card ? { id: card.id, ...payload, cardType: undefined } : payload, { onSuccess: () => onDone?.() });
      }}
      className="grid gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <IdCardPreview card={{ ...toPayload(form), employeeId: card?.employeeId, status: card?.status }} />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Photo</Label>
        <FileUpload
          value={form.photo}
          onChange={(photo) => setForm({ ...form, photo })}
          accept="image/jpeg,image/png,image/webp"
          maxFiles={1}
          purpose="id-card-photos"
          admin
        />
        <p className="text-xs text-muted-foreground">A clear passport-style photo, face centred.</p>
      </div>
      {text("fullName", "Full name")}
      {text("jobTitle", "Job title")}
      {text("department", "Department")}
      {text("country", "Country", { placeholder: "e.g. Zambia" })}
      {!card && (
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Card type</Label>
          <select className={fieldClass} value={form.cardType} onChange={(e) => setForm({ ...form, cardType: e.target.value })}>
            <option value="employee">Employee</option>
            <option value="director">Director</option>
          </select>
          <p className="text-xs text-muted-foreground">
            The employee ID is created automatically, e.g. NKEM-EMP-0001 or NKEM-DIR-0002.
          </p>
        </div>
      )}
      {text("issueDate", "Issue date", { type: "date" })}
      {text("expiryDate", "Expiry date", { type: "date", min: form.issueDate })}
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Notes</Label>
        <textarea rows={3} className={fieldClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>

      {mutation.isError && <p className="text-sm text-destructive sm:col-span-2">{mutation.error.message}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={mutation.isPending} className="bg-brand-navy text-white hover:bg-brand-navy/90">
          {mutation.isPending ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export function IdRegistryView() {
  const { data: cards, isLoading, isError, error } = useIdCards();
  const updateCard = useUpdateIdCard();
  const deleteCard = useDeleteIdCard();
  const router = useRouter();
  const [filters, setFilters] = useState({ status: "all", search: "", page: 1 });
  const rows = filterRows(cards, filters, ["fullName", "employeeId"]);

  return (
    <TableCard
      title="Staff ID cards"
      filters={filters}
      onFiltersChange={setFilters}
      addHref="/admin/id-registry/new"
      addLabel="Add ID"
      count={rows.length}
      statusOptions={STATUS_OPTIONS}
    >
      {isLoading && <p className="px-6 py-10 text-center text-sm text-muted-foreground">Loading ID cards…</p>}
      {isError && <p className="px-6 py-10 text-center text-sm text-destructive">{error.message}</p>}
      {updateCard.isError && <p className="px-6 py-2 text-sm text-destructive">{updateCard.error.message}</p>}
      {deleteCard.isError && <p className="px-6 py-2 text-sm text-destructive">{deleteCard.error.message}</p>}

      {!isLoading && !isError && rows.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead className="border-y border-border bg-slate-50">
            <tr>
              <th className={thClass}>Employee ID</th>
              <th className={thClass}>Name</th>
              <th className={thClass}>Job title</th>
              <th className={thClass}>Department</th>
              <th className={thClass}>Country</th>
              <th className={thClass}>Card type</th>
              <th className={thClass}>Expires</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageRows(rows, filters.page).map((card) => (
              <tr key={card.id} className="transition-colors hover:bg-slate-50">
                <td className={`${tdClass} font-mono text-xs text-muted-foreground`}>{card.employeeId}</td>
                <td className={tdClass}>
                  <div className="flex items-center gap-3">
                    {card.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={card.photoUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                    ) : (
                      <div className="size-9 shrink-0 rounded-full bg-slate-100" />
                    )}
                    <Link href={`/admin/id-registry/${card.id}`} className="font-medium text-brand-blue hover:underline">
                      {card.fullName}
                    </Link>
                  </div>
                </td>
                <td className={`${tdClass} text-muted-foreground`}>{card.jobTitle}</td>
                <td className={`${tdClass} text-muted-foreground`}>{card.department}</td>
                <td className={`${tdClass} text-muted-foreground`}>{card.country}</td>
                <td className={`${tdClass} text-muted-foreground`}>{CARD_TYPE_LABELS[card.cardType]}</td>
                <td className={`${tdClass} text-muted-foreground`}>{formatDate(card.expiryDate)}</td>
                <td className={tdClass}>
                  <IdStatusPill status={card.status} />
                </td>
                <td className={tdClass}>
                  <RowMenu
                    items={[
                      { label: "View / edit", onClick: () => router.push(`/admin/id-registry/${card.id}`) },
                      ...STATUS_OPTIONS.filter(([value]) => value !== card.status).map(([value, label]) => ({
                        label: `Mark ${label.toLowerCase()}`,
                        onClick: () => updateCard.mutate({ id: card.id, status: value }),
                      })),
                      {
                        label: "Delete",
                        onClick: () =>
                          window.confirm(`Delete ${card.fullName}'s ID card (${card.employeeId})? This can't be undone.`) &&
                          deleteCard.mutate(card.id),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </TableCard>
  );
}
