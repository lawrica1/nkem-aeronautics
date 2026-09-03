"use client";

import { UserRound, CheckCircle2, Sprout, Binoculars, Building2 } from "lucide-react";

const SECTOR_LABELS = {
  agricultural: "Agriculture",
  wildlife: "Wildlife & Surveillance",
  realestate: "Real Estate & Survey",
};

const SECTOR_ICONS = {
  agricultural: Sprout,
  wildlife: Binoculars,
  realestate: Building2,
};

function SectorBadge({ sector }) {
  const Icon = SECTOR_ICONS[sector] ?? Sprout;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gray-light px-3 py-1 text-xs font-medium text-brand-navy">
      <Icon className="size-3.5" />
      {SECTOR_LABELS[sector] ?? sector}
    </span>
  );
}

export function ProfileCard({ farmer, onLogout }) {
  const displayName = farmer ? `${farmer.name} ${farmer.surname}` : "—";

  return (
    <div className="h-fit rounded-xl border border-border bg-background p-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-brand-input">
          <UserRound className="size-9 text-brand-navy/50" />
        </div>

        <p className="mt-3 text-lg font-semibold text-brand-navy-dark">{displayName}</p>

        {farmer?.isVerified && (
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-green">
            <CheckCircle2 className="size-3.5" />
            Verified Account
          </span>
        )}

        {farmer?.sector && (
          <div className="mt-2">
            <SectorBadge sector={farmer.sector} />
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3 text-sm">
        {farmer?.identificationNumber && (
          <div>
            <p className="text-xs text-muted-foreground">Logbook ID</p>
            <p className="mt-0.5 font-mono font-semibold text-brand-navy-dark">
              {farmer.identificationNumber}
            </p>
          </div>
        )}

        {farmer?.sector === "agricultural" && (
          <>
            {farmer?.crop && (
              <div>
                <p className="text-xs text-muted-foreground">Crop</p>
                <p className="mt-0.5 text-brand-navy-dark">{farmer.crop}</p>
              </div>
            )}
            {farmer?.firm && farmer.firm !== "none" && (
              <div>
                <p className="text-xs text-muted-foreground">Firm</p>
                <p className="mt-0.5 text-brand-navy-dark">
                  {farmer.firm === "other" ? (farmer.otherFirm ?? "Other") : farmer.firm}
                </p>
              </div>
            )}
          </>
        )}

        {farmer?.sector === "wildlife" && farmer?.wildlifeOrg && (
          <div>
            <p className="text-xs text-muted-foreground">Organisation</p>
            <p className="mt-0.5 text-brand-navy-dark">{farmer.wildlifeOrg}</p>
          </div>
        )}

        {farmer?.telephone && (
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="mt-0.5 text-brand-navy-dark">{farmer.telephone}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="mt-6 w-full rounded-lg bg-destructive/10 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
      >
        Logout
      </button>
    </div>
  );
}
