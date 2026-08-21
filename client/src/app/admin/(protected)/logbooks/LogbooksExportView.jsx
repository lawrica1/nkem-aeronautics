"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FIRM_OPTIONS } from "@/lib/firms";

export function LogbooksExportView() {
  const [firm, setFirm] = useState("all");

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <Label htmlFor="export-firm">Firm</Label>
        <Select value={firm} onValueChange={setFirm}>
          <SelectTrigger id="export-firm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All firms</SelectItem>
            {FIRM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Only verified farmer records are included. Choose a firm to hand that firm just its own
          affiliated farmers.
        </p>
      </div>

      <div className="flex gap-3">
        <a
          href={`/api/admin/logbooks/export?firm=${firm}&format=csv`}
          className={cn(buttonVariants(), "bg-brand-navy text-white hover:bg-brand-navy/90")}
        >
          Download CSV
        </a>
        <a
          href={`/api/admin/logbooks/export?firm=${firm}&format=xlsx`}
          className={buttonVariants({ variant: "outline" })}
        >
          Download Excel
        </a>
      </div>
    </div>
  );
}
