"use client";

import { Fragment, useState } from "react";
import { ClipboardList, Plus, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { NewServiceRequestForm } from "@/components/portal/NewServiceRequestForm";
import { ReviewForm } from "@/components/portal/ReviewForm";
import { OperationMap } from "@/components/portal/OperationMap";
import { Button } from "@/components/ui/button";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OperationDetails({ request }) {
  const op = request.operation;
  if (!op) return null;

  return (
    <div className="space-y-3 bg-brand-input/20 px-4 py-3 text-sm">
      <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
        <div><dt className="text-xs text-muted-foreground">Pilot</dt><dd className="text-brand-navy-dark">{op.pilot?.name ?? "Not yet assigned"}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Drone</dt><dd className="text-brand-navy-dark">{op.drone?.name ?? "Not yet assigned"}</dd></div>
        {op.chemical ? <div><dt className="text-xs text-muted-foreground">Chemical</dt><dd className="text-brand-navy-dark">{op.chemical}</dd></div> : null}
        {op.scheduledAt ? <div><dt className="text-xs text-muted-foreground">Scheduled</dt><dd className="text-brand-navy-dark">{formatDate(op.scheduledAt)}</dd></div> : null}
      </dl>

      {op.results && (
        <div>
          <p className="text-xs text-muted-foreground">Results</p>
          <p className="text-brand-navy-dark">{op.results}</p>
        </div>
      )}

      {op.telemetry?.length > 0 && (
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Drone Position</p>
          <OperationMap telemetry={op.telemetry} />
        </div>
      )}

      {request.status === "completed" && (
        op.review ? (
          <p className="text-xs text-muted-foreground">
            You rated this operation {op.review.rating}/5{op.review.comment ? ` — “${op.review.comment}”` : ""}.
          </p>
        ) : (
          <ReviewForm operationId={op.id} />
        )
      )}
    </div>
  );
}

export function ServiceRequestList({ requests, isLoading, isError, sector, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

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
          <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-brand-input/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => {
                const hasOperation = !!req.operation;
                const isOpen = expandedId === req.id;
                return (
                  <Fragment key={req.id}>
                    <tr
                      className={hasOperation ? "cursor-pointer hover:bg-muted/30" : "hover:bg-muted/30"}
                      onClick={hasOperation ? () => setExpandedId(isOpen ? null : req.id) : undefined}
                    >
                      <td className="px-4 py-3 font-medium text-brand-navy-dark">{req.service}</td>
                      <td className="px-4 py-3 text-muted-foreground">{req.location || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(req.createdAt)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status} />
                      </td>
                    </tr>
                    {hasOperation && isOpen && (
                      <tr>
                        <td colSpan={4} className="p-0">
                          <OperationDetails request={req} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
