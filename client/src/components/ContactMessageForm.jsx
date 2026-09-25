"use client";

import { useState } from "react";
import { useCreateQuote } from "@/hooks/useQuotes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EMPTY_FORM = { name: "", email: "", message: "" };

export function ContactMessageForm() {
  const createMessage = useCreateQuote();
  const [form, setForm] = useState(EMPTY_FORM);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    createMessage.mutate(
      { sector: "general", ...form },
      { onSuccess: () => setForm(EMPTY_FORM) },
    );
  }

  if (createMessage.isSuccess) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center">
        <p className="font-semibold text-brand-navy-dark">Thank you — your message has been sent.</p>
        <p className="mt-2 text-sm text-muted-foreground">Our customer service team will get back to you shortly.</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => createMessage.reset()}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-background p-6">
      <div className="space-y-1.5">
        <Label htmlFor="contact-msg-name">Name</Label>
        <Input id="contact-msg-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-msg-email">
          Your Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contact-msg-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-msg-message">
          Message / Comment <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="contact-msg-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      </div>

      {createMessage.isError && <p className="text-sm text-destructive">{createMessage.error.message}</p>}

      <Button type="submit" disabled={createMessage.isPending} className="w-full bg-brand-blue text-white hover:bg-brand-blue-dark">
        {createMessage.isPending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
