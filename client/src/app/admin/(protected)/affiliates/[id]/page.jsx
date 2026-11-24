"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAffiliates, useUpdateAffiliate, useDeleteAffiliate } from "@/hooks/useAffiliates";
import { AffiliateForm, AffiliateStatusPill, STATUS_OPTIONS, countryName } from "../AffiliatesView";

export default function AffiliateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: affiliates, isLoading, isError, error } = useAffiliates();
  const updateAffiliate = useUpdateAffiliate();
  const statusUpdate = useUpdateAffiliate();
  const deleteAffiliate = useDeleteAffiliate();
  const affiliate = affiliates?.find((a) => a.id === id);
  const back = () => router.push("/admin/affiliates");

  return (
    <div>
      <Link href="/admin/affiliates" className="text-sm text-brand-blue underline">← Back to Affiliates</Link>
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading affiliate…</p>}
      {isError && <p className="mt-8 text-sm text-destructive">{error.message}</p>}
      {affiliates && !affiliate && <p className="mt-8 text-sm text-muted-foreground">Affiliate not found.</p>}
      {affiliate && (
        <div className="mt-4 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">{affiliate.name}</h1>
              <AffiliateStatusPill status={affiliate.status} />
              <button
                type="button"
                disabled={deleteAffiliate.isPending}
                onClick={() => {
                  if (!window.confirm(`Delete affiliate ${affiliate.name} (${affiliate.referralCode})? This can't be undone.`)) return;
                  deleteAffiliate.mutate(id, { onSuccess: back });
                }}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="size-4" /> {deleteAffiliate.isPending ? "Deleting…" : "Delete affiliate"}
              </button>
            </div>
            {deleteAffiliate.isError && <p className="mt-2 text-sm text-destructive">{deleteAffiliate.error.message}</p>}
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-mono">{affiliate.referralCode}</span> · {countryName(affiliate.country)} ·{" "}
              {Number(affiliate.commissionRate)}% commission
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-navy-dark">Status</h2>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Affiliate status">
              {STATUS_OPTIONS.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={affiliate.status === value}
                  disabled={statusUpdate.isPending}
                  onClick={() => affiliate.status !== value && statusUpdate.mutate({ id, status: value })}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                    affiliate.status === value
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
            <AffiliateForm affiliate={affiliate} mutation={updateAffiliate} submitLabel="Save changes" onDone={back} onCancel={back} />
          </div>
        </div>
      )}
    </div>
  );
}
