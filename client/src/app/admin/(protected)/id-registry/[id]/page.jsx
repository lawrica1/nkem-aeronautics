"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useIdCards, useUpdateIdCard, useDeleteIdCard } from "@/hooks/useIdCards";
import { Trash2 } from "lucide-react";
import { IdCardForm, IdStatusPill, STATUS_OPTIONS, CARD_TYPE_LABELS, formatDate } from "../IdRegistryView";

export default function IdCardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: cards, isLoading, isError, error } = useIdCards();
  const updateCard = useUpdateIdCard();
  const statusUpdate = useUpdateIdCard();
  const deleteCard = useDeleteIdCard();
  const card = cards?.find((c) => c.id === id);
  const back = () => router.push("/admin/id-registry");

  return (
    <div>
      <Link href="/admin/id-registry" className="text-sm text-brand-blue underline">← Back to ID Registry</Link>
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading ID card…</p>}
      {isError && <p className="mt-8 text-sm text-destructive">{error.message}</p>}
      {cards && !card && <p className="mt-8 text-sm text-muted-foreground">ID card not found.</p>}
      {card && (
        <div className="mt-4 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">{card.fullName}</h1>
              <IdStatusPill status={card.status} />
              <button
                type="button"
                disabled={deleteCard.isPending}
                onClick={() => {
                  if (!window.confirm(`Delete ${card.fullName}'s ID card (${card.employeeId})? This can't be undone.`)) return;
                  deleteCard.mutate(id, { onSuccess: back });
                }}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="size-4" /> {deleteCard.isPending ? "Deleting…" : "Delete card"}
              </button>
            </div>
            {deleteCard.isError && <p className="mt-2 text-sm text-destructive">{deleteCard.error.message}</p>}
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-mono">{card.employeeId}</span> · {CARD_TYPE_LABELS[card.cardType]} card · issued{" "}
              {formatDate(card.issueDate)}, expires {formatDate(card.expiryDate)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-navy-dark">Card status</h2>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Card status">
              {STATUS_OPTIONS.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={card.status === value}
                  disabled={statusUpdate.isPending}
                  onClick={() => card.status !== value && statusUpdate.mutate({ id, status: value })}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                    card.status === value
                      ? "border-brand-navy bg-brand-navy text-white"
                      : "border-border text-brand-navy-dark hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {statusUpdate.isError && <p className="mt-2 text-sm text-destructive">{statusUpdate.error.message}</p>}
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-brand-navy-dark">Details</h2>
            <IdCardForm card={card} mutation={updateCard} submitLabel="Save changes" onDone={back} onCancel={back} />
          </div>
        </div>
      )}
    </div>
  );
}
