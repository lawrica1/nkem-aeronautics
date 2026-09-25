"use client";

import { Users, ClipboardList } from "lucide-react";
import { useAdminStats } from "@/hooks/useAdminStats";

const CARD = "rounded-2xl border border-border bg-white p-6 shadow-sm";

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className={`${CARD} flex items-center gap-4`}>
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
        <Icon className="size-6 text-brand-blue" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold tracking-tight text-brand-navy-dark tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function StatTable({ title, rows = [], labelKey = "value" }) {
  return (
    <div className={CARD}>
      <h2 className="font-semibold text-brand-navy-dark">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <table className="mt-3 w-full text-left text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={`${title}-${row.value}`} className="border-b border-border last:border-0">
                <td className="py-2 pr-4 text-muted-foreground">{row[labelKey] ?? row.value}</td>
                <td className="py-2 text-right font-medium text-brand-navy-dark tabular-nums">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function AdminReportsPage() {
  const { data: stats, isLoading, isError, error } = useAdminStats();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Real registered-user counts and service demand summaries from the Node.js backend.
      </p>

      {isLoading ? <div className={`mt-8 text-sm text-muted-foreground ${CARD}`}>Loading reports...</div> : null}

      {isError ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error.message}</div>
      ) : null}

      {stats ? (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <StatTile icon={Users} label="Verified users" value={stats.totalUsers} />
            <StatTile icon={ClipboardList} label="Service requests logged" value={stats.totalRequests} />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <StatTable title="By Sector" rows={stats.bySector} />
            <StatTable title="By Country" rows={stats.byCountry} />
            <StatTable title="By Region" rows={stats.byRegion} />
            <StatTable title="By Firm Affiliation" rows={stats.byFirm} labelKey="label" />
            <StatTable title="By Crop" rows={stats.byCrop} />
            <StatTable title="Service Requests by Status" rows={stats.byStatus} />
          </div>
        </>
      ) : null}
    </div>
  );
}
