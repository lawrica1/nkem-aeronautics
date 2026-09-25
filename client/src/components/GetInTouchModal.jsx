"use client";

import { useState } from "react";
import { useCreateQuote } from "@/hooks/useQuotes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRY_OPTIONS } from "@/lib/adminOptions";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  company: "",
  country: "",
  message: "",
};

export function GetInTouchModal({ open, onOpenChange }) {
  const createMessage = useCreateQuote();
  const [form, setForm] = useState(EMPTY_FORM);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    createMessage.mutate(
      {
        sector: "general",
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        whatsapp: form.mobile,
        company: form.company,
        targetCountry: COUNTRY_OPTIONS.find((c) => c.value === form.country)?.label || form.country,
        message: form.message,
      },
      { onSuccess: () => setForm(EMPTY_FORM) },
    );
  }

  function handleOpenChange(next) {
    onOpenChange(next);
    if (!next) createMessage.reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get In Touch</DialogTitle>
        </DialogHeader>

        {createMessage.isSuccess ? (
          <div className="py-4 text-center">
            <p className="font-semibold text-brand-navy-dark">Thank you — your message has been sent.</p>
            <p className="mt-2 text-sm text-muted-foreground">Our team will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="git-first-name">First Name <span className="text-destructive">*</span></Label>
                <Input id="git-first-name" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="git-last-name">Last Name <span className="text-destructive">*</span></Label>
                <Input id="git-last-name" required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="git-email">Email <span className="text-destructive">*</span></Label>
              <Input id="git-email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="git-mobile">Mobile Number <span className="text-destructive">*</span></Label>
              <Input id="git-mobile" type="tel" required placeholder="+260 XXX XXX XXX" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="git-company">Company Name</Label>
              <Input id="git-company" value={form.company} onChange={(e) => set("company", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="git-country">Select Country</Label>
              <Select value={form.country} onValueChange={(v) => set("country", v)}>
                <SelectTrigger id="git-country" className="w-full"><SelectValue placeholder="Select a country" /></SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="git-message">How can we help? <span className="text-destructive">*</span></Label>
              <textarea
                id="git-message"
                required
                rows={3}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            {createMessage.isError && <p className="text-sm text-destructive">{createMessage.error.message}</p>}

            <Button type="submit" disabled={createMessage.isPending} className="w-full bg-brand-blue text-white hover:bg-brand-blue-dark">
              {createMessage.isPending ? "Submitting…" : "Submit"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
