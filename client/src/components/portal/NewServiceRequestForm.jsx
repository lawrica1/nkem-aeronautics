"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServiceRequest } from "@/hooks/useServiceRequest";
import { getServiceOptions } from "@/lib/serviceOptions";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function NewServiceRequestForm({ sector, onClose }) {
  const queryClient = useQueryClient();
  const serviceRequest = useServiceRequest();
  const options = getServiceOptions(sector);

  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    serviceRequest.mutate(
      { service, description, location },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["farmer", "service-requests"] });
          onClose();
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="service">Service Required</Label>
        <select
          id="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40"
        >
          <option value="">Select a service…</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">Farm / Site Location</Label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Fako Division, Buea Rural"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Additional Details <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe the crop, area size, urgency, or any other relevant information…"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40"
        />
      </div>

      {serviceRequest.isError && (
        <p className="text-sm text-destructive">{serviceRequest.error.message}</p>
      )}

      <div className="flex gap-3 pt-1">
        <Button
          type="submit"
          disabled={serviceRequest.isPending}
          className="flex-1 bg-brand-navy text-white hover:bg-brand-navy/90"
        >
          {serviceRequest.isPending ? "Submitting…" : "Submit Request"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
