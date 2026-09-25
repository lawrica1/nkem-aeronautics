"use client";

import { useState } from "react";
import { useAdminRequests } from "@/hooks/useAdminRequests";
import { usePilots, useDrones, useCreatePilot, useCreateDrone } from "@/hooks/usePilotsAndDrones";
import { COUNTRY_OPTIONS } from "@/lib/adminOptions";
import { useAssignOperation, useUpdateOperation, useAttachOperationMedia } from "@/hooks/useOperations";
import { useLogTelemetry } from "@/hooks/useTelemetry";
import { usePartners, useAssignPartner } from "@/hooks/usePartners";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { FileUpload } from "@/components/portal/FileUpload";
import { OperationMap } from "@/components/portal/OperationMap";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const STATUS_OPTIONS = [
  ["assigned", "Assigned"],
  ["in_progress", "In Progress"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
  ["rejected", "Rejected"],
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

function PilotDronePicker({ pilots, drones, pilotId, droneId, onPilotChange, onDroneChange }) {
  const createPilot = useCreatePilot();
  const createDrone = useCreateDrone();
  const [newPilot, setNewPilot] = useState(null);
  const [newDrone, setNewDrone] = useState(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>Pilot</Label>
        {newPilot === null ? (
          <div className="flex gap-2">
            <select className={fieldClass} value={pilotId} onChange={(e) => onPilotChange(e.target.value)}>
              <option value="">No pilot yet</option>
              {pilots?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Button type="button" variant="outline" onClick={() => setNewPilot({ name: "", telephone: "", droneTypes: "" })}>
              + New
            </Button>
          </div>
        ) : (
          <div className="space-y-2 rounded-lg border border-border p-3">
            <input className={fieldClass} placeholder="Pilot name" value={newPilot.name} onChange={(e) => setNewPilot({ ...newPilot, name: e.target.value })} />
            <input className={fieldClass} placeholder="Telephone (optional)" value={newPilot.telephone} onChange={(e) => setNewPilot({ ...newPilot, telephone: e.target.value })} />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={!newPilot.name || createPilot.isPending}
                onClick={() =>
                  createPilot.mutate(newPilot, {
                    onSuccess: (pilot) => {
                      onPilotChange(pilot.id);
                      setNewPilot(null);
                    },
                  })
                }
              >
                {createPilot.isPending ? "Saving…" : "Add pilot"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setNewPilot(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Drone</Label>
        {newDrone === null ? (
          <div className="flex gap-2">
            <select className={fieldClass} value={droneId} onChange={(e) => onDroneChange(e.target.value)}>
              <option value="">No drone yet</option>
              {drones?.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <Button type="button" variant="outline" onClick={() => setNewDrone({ name: "", model: "" })}>
              + New
            </Button>
          </div>
        ) : (
          <div className="space-y-2 rounded-lg border border-border p-3">
            <input className={fieldClass} placeholder="Drone name" value={newDrone.name} onChange={(e) => setNewDrone({ ...newDrone, name: e.target.value })} />
            <input className={fieldClass} placeholder="Model (optional)" value={newDrone.model} onChange={(e) => setNewDrone({ ...newDrone, model: e.target.value })} />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={!newDrone.name || createDrone.isPending}
                onClick={() =>
                  createDrone.mutate(newDrone, {
                    onSuccess: (drone) => {
                      onDroneChange(drone.id);
                      setNewDrone(null);
                    },
                  })
                }
              >
                {createDrone.isPending ? "Saving…" : "Add drone"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setNewDrone(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AssignForm({ request, pilots, drones }) {
  const assign = useAssignOperation();
  const [pilotId, setPilotId] = useState("");
  const [droneId, setDroneId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [chemical, setChemical] = useState("");
  const [comments, setComments] = useState("");

  return (
    <div className="space-y-4">
      <PilotDronePicker pilots={pilots} drones={drones} pilotId={pilotId} droneId={droneId} onPilotChange={setPilotId} onDroneChange={setDroneId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Scheduled date</Label>
          <input type="date" className={fieldClass} value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Chemical <span className="font-normal text-muted-foreground">(if applicable)</span></Label>
          <input className={fieldClass} value={chemical} onChange={(e) => setChemical(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Notes for the operation</Label>
        <textarea rows={2} className={fieldClass} value={comments} onChange={(e) => setComments(e.target.value)} />
      </div>

      {assign.isError && <p className="text-sm text-destructive">{assign.error.message}</p>}

      <Button
        disabled={assign.isPending}
        className="bg-brand-navy text-white hover:bg-brand-navy/90"
        onClick={() =>
          assign.mutate({
            serviceRequestId: request.id,
            pilotId: pilotId || undefined,
            droneId: droneId || undefined,
            scheduledAt: scheduledAt || undefined,
            chemical,
            comments,
          })
        }
      >
        {assign.isPending ? "Assigning…" : "Assign & mark as Assigned"}
      </Button>
    </div>
  );
}

function OperationPanel({ operation }) {
  const update = useUpdateOperation();
  const attachMedia = useAttachOperationMedia();
  const logTelemetry = useLogTelemetry();
  const [results, setResults] = useState(operation.results || "");
  const [status, setStatus] = useState("in_progress");
  const [pendingFiles, setPendingFiles] = useState([]);
  const [gps, setGps] = useState({ latitude: "", longitude: "", altitude: "" });

  return (
    <div className="space-y-4">
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div><dt className="text-muted-foreground">Pilot</dt><dd className="font-medium text-brand-navy-dark">{operation.pilot?.name ?? "Unassigned"}</dd></div>
        <div><dt className="text-muted-foreground">Drone</dt><dd className="font-medium text-brand-navy-dark">{operation.drone?.name ?? "Unassigned"}</dd></div>
        <div><dt className="text-muted-foreground">Scheduled</dt><dd className="font-medium text-brand-navy-dark">{formatDate(operation.scheduledAt)}</dd></div>
        <div><dt className="text-muted-foreground">Chemical</dt><dd className="font-medium text-brand-navy-dark">{operation.chemical || "—"}</dd></div>
      </dl>

      {operation.review && (
        <div className="rounded-lg border border-border bg-brand-input/40 p-3 text-sm">
          <p className="font-medium text-brand-navy-dark">Farmer review — {operation.review.rating}/5</p>
          {operation.review.comment && <p className="mt-1 text-muted-foreground">{operation.review.comment}</p>}
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Footage &amp; photos</Label>
        {operation.files.length > 0 && (
          <p className="text-xs text-muted-foreground">{operation.files.length} file(s) already attached and visible to the customer.</p>
        )}
        <FileUpload value={pendingFiles} onChange={setPendingFiles} admin purpose="operation-media" />
        {pendingFiles.length > 0 && (
          <Button
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
            {attachMedia.isPending ? "Attaching…" : `Attach ${pendingFiles.length} file(s) to this operation`}
          </Button>
        )}
      </div>

      {operation.drone && (
        <div className="space-y-2">
          <Label>Drone position <span className="font-normal text-muted-foreground">— no live hardware feed yet, log manually</span></Label>
          {operation.telemetry.length > 0 && <OperationMap telemetry={operation.telemetry} />}
          <div className="flex flex-wrap items-end gap-2">
            <input type="number" step="any" placeholder="Latitude" className={`${fieldClass} w-32`} value={gps.latitude} onChange={(e) => setGps({ ...gps, latitude: e.target.value })} />
            <input type="number" step="any" placeholder="Longitude" className={`${fieldClass} w-32`} value={gps.longitude} onChange={(e) => setGps({ ...gps, longitude: e.target.value })} />
            <input type="number" step="any" placeholder="Altitude (m, optional)" className={`${fieldClass} w-40`} value={gps.altitude} onChange={(e) => setGps({ ...gps, altitude: e.target.value })} />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!gps.latitude || !gps.longitude || logTelemetry.isPending}
              onClick={() =>
                logTelemetry.mutate(
                  { droneId: operation.drone.id, operationId: operation.id, ...gps },
                  { onSuccess: () => setGps({ latitude: "", longitude: "", altitude: "" }) },
                )
              }
            >
              {logTelemetry.isPending ? "Logging…" : "Log position"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Results / comments</Label>
        <textarea rows={3} className={fieldClass} value={results} onChange={(e) => setResults(e.target.value)} />
      </div>

      <div className="flex items-end gap-3">
        <div className="space-y-1.5">
          <Label>Update request status</Label>
          <select className={fieldClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <Button
          disabled={update.isPending}
          className="bg-brand-navy text-white hover:bg-brand-navy/90"
          onClick={() => update.mutate({ id: operation.id, results, status })}
        >
          {update.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
      {update.isError && <p className="text-sm text-destructive">{update.error.message}</p>}
    </div>
  );
}

function PartnerShare({ request, partners }) {
  const assignPartner = useAssignPartner();

  return (
    <div className="flex flex-wrap items-end gap-2 border-t border-border pt-4">
      <div className="space-y-1.5">
        <Label>Share with partner</Label>
        <select
          className={fieldClass}
          style={{ width: "auto" }}
          value={request.partner?.id ?? ""}
          onChange={(e) => assignPartner.mutate({ id: request.id, partnerId: e.target.value || null })}
        >
          <option value="">Not shared</option>
          {partners?.map((partner) => (
            <option key={partner.id} value={partner.id}>{partner.name}</option>
          ))}
        </select>
      </div>
      <p className="pb-2 text-xs text-muted-foreground">
        Partners get read-only visibility of what you share here.
      </p>
      {assignPartner.isError && <p className="w-full text-sm text-destructive">{assignPartner.error.message}</p>}
    </div>
  );
}

export function RequestsAdminView() {
  const [country, setCountry] = useState("");
  const { data: requests, isLoading, isError, error } = useAdminRequests({ country });
  const { data: pilots } = usePilots();
  const { data: drones } = useDrones();
  const { data: partners } = usePartners();
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="country-filter" className="text-xs">Country</Label>
          <select id="country-filter" className={fieldClass} style={{ width: "auto" }} value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading requests…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}
      {!isLoading && !isError && !requests?.length && <p className="text-sm text-muted-foreground">No service requests match.</p>}

      {!isLoading && !isError && requests?.length > 0 && requests.map((request) => {
        const isOpen = expandedId === request.id;
        return (
          <div key={request.id} className="rounded-2xl border border-border bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setExpandedId(isOpen ? null : request.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
            >
              <div>
                <p className="flex items-center gap-2 font-medium text-brand-navy-dark">
                  {request.user?.name ? `${request.user.name} ${request.user.surname ?? ""}` : "Unnamed"} — {request.service}
                  {request.partner && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200">
                      Shared · {request.partner.name}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {request.region || "No region"} · Submitted {formatDate(request.createdAt)}
                </p>
              </div>
              <StatusBadge status={request.status} />
            </button>

            {isOpen && (
              <div className="space-y-4 border-t border-border px-4 py-4">
                {request.operation ? (
                  <OperationPanel operation={request.operation} />
                ) : (
                  <AssignForm request={request} pilots={pilots} drones={drones} />
                )}
                <PartnerShare request={request} partners={partners} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
