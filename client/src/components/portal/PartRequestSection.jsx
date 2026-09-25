"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";
import { useMyPartRequests, useCreatePartRequest } from "@/hooks/usePartRequests";
import { FileUpload } from "@/components/portal/FileUpload";
import { Button } from "@/components/ui/button";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function PartRequestSection() {
  const { data: requests } = useMyPartRequests();
  const createRequest = useCreatePartRequest();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    createRequest.mutate(
      { description, fileAssetIds: files.map((f) => f.id) },
      { onSuccess: () => { setDescription(""); setFiles([]); setShowForm(false); } },
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-brand-navy-dark">
            <Wrench className="size-4 text-brand-green" />
            Parts
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Need a replacement part? Describe it and add photos — we&rsquo;ll identify and source it for you.
          </p>
        </div>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} className="shrink-0 bg-brand-navy text-white hover:bg-brand-navy/90">
            New Part Request
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-xl border border-border bg-background p-5">
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the part you need — drone model, what broke, etc."
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
          <FileUpload value={files} onChange={setFiles} purpose="part-request" maxFiles={5} />
          {createRequest.isError && <p className="text-sm text-destructive">{createRequest.error.message}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={createRequest.isPending} className="flex-1 bg-brand-navy text-white hover:bg-brand-navy/90">
              {createRequest.isPending ? "Submitting…" : "Submit Request"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {requests?.length > 0 && (
        <ul className="mt-4 space-y-2">
          {requests.map((request) => (
            <li key={request.id} className="rounded-xl border border-border px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-brand-navy-dark">{request.description}</span>
                <span className="shrink-0 rounded-full bg-brand-input px-2.5 py-0.5 text-xs font-medium text-brand-navy-dark">
                  {request.statusLabel}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
              {request.adminNotes && <p className="mt-1 text-xs text-muted-foreground">Nkem: {request.adminNotes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
