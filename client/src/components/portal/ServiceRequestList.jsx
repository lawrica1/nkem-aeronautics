"use client";

import { useState } from "react";
import { ClipboardList, Plus, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { NewServiceRequestForm } from "@/components/portal/NewServiceRequestForm";
import { Button } from "@/components/ui/button";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ServiceRequestList({ requests, isLoading, isError, sector, onRefresh }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-brand-navy-dark">
          <ClipboardList className="size-4 text-brand-green" />
          Service Requests
        </h2>
        <div className="flex items-center gap-2">
          {!showForm && (
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="gap-1.5 bg-brand-navy text-white hover:bg-brand-navy/90"
            >
              <Plus className="size-3.5" />
              New Request
            </Button>
          )}
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-4 rounded-xl border border-border bg-background p-5">
          <p className="mb-4 text-sm font-semibold text-brand-navy-dark">New Service Request</p>
          <NewServiceRequestForm sector={sector} onClose={() => setShowForm(false)} />
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        {isLoading && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Loading requests…
          </div>
        )}

        {isError && (
          <div className="px-4 py-10 text-center text-sm text-destructive">
            Could not load requests. Please try again.
          </div>
        )}

        {!isLoading && !isError && requests?.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No requests yet. Use &ldquo;New Request&rdquo; to submit your first service request.
          </div>
        )}

        {!isLoading && !isError && requests?.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-input/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-brand-navy-dark">{req.service}</td>
                  <td className="px-4 py-3 text-muted-foreground">{req.location || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(req.createdAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
