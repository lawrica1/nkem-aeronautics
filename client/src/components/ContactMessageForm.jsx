"use client";

import { useState } from "react";
import { useCreateQuote } from "@/hooks/useQuotes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { COUNTRIES } from "@/lib/countries";

const SERVICE_OPTIONS = [
  { value: "general", label: "General / Customer Service" },
  { value: "agricultural", label: "Agricultural Drone Services" },
  { value: "wildlife", label: "Wildlife & Surveillance" },
  { value: "mining", label: "Mining Operations" },
  { value: "pipeline", label: "Pipeline & Infrastructure Inspection" },
  { value: "survey-mapping", label: "Aerial & Survey Mapping" },
  { value: "evtol", label: "eVTOL & Heavy-Lift Operations" },
];

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const EMPTY_FORM = { name: "", email: "", whatsapp: "", sector: "general", targetCountry: "", message: "" };

export function ContactMessageForm() {
  const createMessage = useCreateQuote();
  const [form, setForm] = useState(EMPTY_FORM);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      targetCountry: COUNTRIES.find((c) => c.code === form.targetCountry)?.name || form.targetCountry,
    };
    createMessage.mutate(payload, { onSuccess: () => setForm(EMPTY_FORM) });
  }

  if (createMessage.isSuccess) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center">
        <p className="font-semibold text-brand-navy-dark">Thank you — your message has been sent.</p>
        <p className="mt-2 text-sm text-muted-foreground">Our team will get back to you shortly.</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => createMessage.reset()}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-background p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cmf-name">Name</Label>
          <Input id="cmf-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cmf-email">Email <span className="text-destructive">*</span></Label>
          <Input id="cmf-email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cmf-country">Country</Label>
          <select
            id="cmf-country"
            className={fieldClass}
            value={form.targetCountry}
            onChange={(e) => set("targetCountry", e.target.value)}
          >
            <option value="">Select country…</option>
            {COUNTRIES.map(({ code, name }) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cmf-whatsapp">Phone / WhatsApp</Label>
          <PhoneInput
            id="cmf-whatsapp"
            name="whatsapp"
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            countryCode={form.targetCountry || undefined}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cmf-service">Service of Interest</Label>
        <select id="cmf-service" className={fieldClass} value={form.sector} onChange={(e) => set("sector", e.target.value)}>
          {SERVICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cmf-message">Message <span className="text-destructive">*</span></Label>
        <textarea
          id="cmf-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us what you need…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      {createMessage.isError && (
        <p className="text-sm text-destructive">{createMessage.error.message}</p>
      )}

      <Button type="submit" disabled={createMessage.isPending} className="w-full bg-brand-blue text-white hover:bg-brand-blue-dark">
        {createMessage.isPending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
