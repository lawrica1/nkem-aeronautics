"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getAdminToken, getApiBaseUrl } from "@/lib/api";
import { FIRM_OPTIONS } from "@/lib/firms";

export function LogbooksExportView() {
  const [firm, setFirm] = useState("all");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  async function download(format) {
    setError("");
    setIsDownloading(true);

    try {
      const token = getAdminToken();
      const response = await fetch(
        `${getApiBaseUrl()}/admin/logbooks/export?firm=${firm}&format=${format}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? `Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `nkem-logbooks-${firm}-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setIsDownloading(false);
    }
  }

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
        <Button
          type="button"
          disabled={isDownloading}
          onClick={() => download("csv")}
          className="bg-brand-navy text-white hover:bg-brand-navy/90"
        >
          Download CSV
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isDownloading}
          onClick={() => download("xlsx")}
        >
          Download Excel
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
