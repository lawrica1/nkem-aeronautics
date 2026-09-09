"use client";

import { useState } from "react";
import { useCreateQuote } from "@/hooks/useQuotes";
import { useProducts } from "@/hooks/useProducts";
import { PRODUCTS } from "@/lib/catalog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INTEREST_OPTIONS = [
  { value: "purchase", label: "Purchasing a product" },
  { value: "service", label: "Requesting a service" },
  { value: "partnership", label: "Partnership / Distribution" },
  { value: "general", label: "General Inquiry" },
];

export function QuoteRequestForm({ sector }) {
  const createQuote = useCreateQuote();
  const { data: dbProducts } = useProducts("evtol", undefined, undefined, { enabled: sector === "evtol" });
  const productOptions = sector === "evtol" ? (dbProducts ?? []) : PRODUCTS.filter((p) => p.sector === sector);

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    company: "",
    targetCountry: "",
    interestedProduct: "",
    interestedIn: "",
    message: "",
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    createQuote.mutate(
      { sector, ...form },
      {
        onSuccess: () => {
          setForm({
            name: "",
            email: "",
            whatsapp: "",
            company: "",
            targetCountry: "",
            interestedProduct: "",
            interestedIn: "",
            message: "",
          });
        },
      },
    );
  }

  if (createQuote.isSuccess) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center">
        <p className="font-semibold text-brand-navy-dark">Thank you — your request has been sent.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Our team will get back to you shortly.
        </p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => createQuote.reset()}>
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4 rounded-xl border border-border bg-background p-6 sm:p-8">
      <h3 className="text-center text-2xl font-bold text-brand-navy-dark">Request A Quote</h3>

      <div className="space-y-1.5">
        <Label htmlFor={`${sector}-quote-name`}>Name</Label>
        <Input id={`${sector}-quote-name`} value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${sector}-quote-email`}>
          Your Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${sector}-quote-email`}
          type="email"
          required
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${sector}-quote-whatsapp`}>WhatsApp</Label>
        <Input id={`${sector}-quote-whatsapp`} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${sector}-quote-company`}>Company</Label>
        <Input id={`${sector}-quote-company`} value={form.company} onChange={(e) => set("company", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${sector}-quote-country`}>
          Targeted Country/Region <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${sector}-quote-country`}
          required
          value={form.targetCountry}
          onChange={(e) => set("targetCountry", e.target.value)}
        />
      </div>

      {productOptions.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor={`${sector}-quote-product`}>Interested Products</Label>
          <Select value={form.interestedProduct} onValueChange={(v) => set("interestedProduct", v)}>
            <SelectTrigger id={`${sector}-quote-product`} className="w-full">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {productOptions.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor={`${sector}-quote-interest`}>I am interested in</Label>
        <Select value={form.interestedIn} onValueChange={(v) => set("interestedIn", v)}>
          <SelectTrigger id={`${sector}-quote-interest`} className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {INTEREST_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${sector}-quote-message`}>
          Message <span className="text-destructive">*</span>
        </Label>
        <textarea
          id={`${sector}-quote-message`}
          required
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      </div>

      {createQuote.isError && (
        <p className="text-sm text-destructive">{createQuote.error.message}</p>
      )}

      <Button
        type="submit"
        disabled={createQuote.isPending}
        className="w-full bg-brand-blue text-white hover:bg-brand-blue-dark"
      >
        {createQuote.isPending ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}
